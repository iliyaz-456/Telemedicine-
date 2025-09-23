'use server';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '../../../backend/utils/mongodb';
import ChatMessage from '../../../backend/models/ChatMessage';
import { getToken } from 'next-auth/jwt';
import { getDoctorData, getASHAData, formatDoctorData, formatASHAData } from '../../../lib/mockData';

// Types for the chat API
interface ChatRequest {
  message: string;
  lang?: string;
  sessionId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; message: string }>;
}

interface ChatResponse {
  success: boolean;
  message: string;
  doctorSuggestion?: {
    name: string;
    category: string;
    reason: string;
  };
  detectedLanguage?: string;
  sessionId?: string;
  error?: string;
}

// Doctor mapping for recommendations
const DOCTOR_MAPPING = {
  'fever': { name: 'Dr. Meena', category: 'General Physician', reason: 'Fever and general symptoms' },
  'chest pain': { name: 'Dr. Sharma', category: 'Cardiologist', reason: 'Cardiac symptoms' },
  'heart': { name: 'Dr. Sharma', category: 'Cardiologist', reason: 'Heart-related concerns' },
  'skin': { name: 'Dr. Raj', category: 'Dermatologist', reason: 'Skin conditions' },
  'rash': { name: 'Dr. Raj', category: 'Dermatologist', reason: 'Skin rash or irritation' },
  'child': { name: 'Dr. Priya', category: 'Pediatrician', reason: 'Pediatric care' },
  'baby': { name: 'Dr. Priya', category: 'Pediatrician', reason: 'Infant care' },
  'bone': { name: 'Dr. Kumar', category: 'Orthopedist', reason: 'Bone and joint issues' },
  'joint': { name: 'Dr. Kumar', category: 'Orthopedist', reason: 'Joint pain or mobility issues' },
  'stomach': { name: 'Dr. Meena', category: 'General Physician', reason: 'Digestive issues' },
  'headache': { name: 'Dr. Meena', category: 'General Physician', reason: 'Headaches and general symptoms' },
  'cough': { name: 'Dr. Meena', category: 'General Physician', reason: 'Respiratory symptoms' },
  'breathing': { name: 'Dr. Meena', category: 'General Physician', reason: 'Breathing difficulties' }
};

// Language detection keywords
const LANGUAGE_KEYWORDS = {
  hindi: ['है', 'हैं', 'में', 'को', 'से', 'पर', 'के', 'की', 'का', 'हो', 'कर', 'दे', 'ले', 'जा', 'आ', 'बीमार', 'दर्द', 'बुखार', 'खांसी', 'सिरदर्द', 'पेट', 'सीना', 'मुझे', 'मेरे', 'हिंदी', 'भारत'],
  punjabi: ['ਹੈ', 'ਹਨ', 'ਵਿੱਚ', 'ਨੂੰ', 'ਤੋਂ', 'ਤੇ', 'ਦੇ', 'ਦੀ', 'ਦਾ', 'ਹੋ', 'ਕਰ', 'ਦੇ', 'ਲੈ', 'ਜਾ', 'ਆ', 'ਬੀਮਾਰ', 'ਦਰਦ', 'ਬੁਖਾਰ', 'ਖੰਘ', 'ਸਿਰਦਰਦ', 'ਪੇਟ', 'ਛਾਤੀ', 'ਮੈਨੂੰ', 'ਮੇਰੇ', 'ਪੰਜਾਬੀ', 'ਪੰਜਾਬ'],
  english: ['is', 'are', 'in', 'to', 'from', 'on', 'the', 'a', 'an', 'and', 'or', 'but', 'have', 'has', 'had', 'will', 'would', 'should', 'could', 'pain', 'fever', 'headache', 'stomach', 'chest', 'i', 'my', 'english', 'india']
};

// Enhanced language detection function
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Count language-specific keywords
  const hindiCount = LANGUAGE_KEYWORDS.hindi.filter(word => lowerText.includes(word)).length;
  const punjabiCount = LANGUAGE_KEYWORDS.punjabi.filter(word => lowerText.includes(word)).length;
  const englishCount = LANGUAGE_KEYWORDS.english.filter(word => lowerText.includes(word)).length;
  
  // Check for script patterns
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasGurmukhi = /[\u0A00-\u0A7F]/.test(text);
  
  if (hasGurmukhi || punjabiCount > 0) return 'punjabi';
  if (hasDevanagari || hindiCount > 0) return 'hindi';
  if (englishCount > 0) return 'english';
  
  // Default to English if no clear indicators
  return 'english';
}

// Check for doctor recommendation keywords
function getDoctorSuggestion(message: string): { name: string; category: string; reason: string } | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, doctorInfo] of Object.entries(DOCTOR_MAPPING)) {
    if (lowerMessage.includes(keyword)) {
      return doctorInfo;
    }
  }
  
  return null;
}

// Check if user is asking for mock data
function checkForMockDataRequest(message: string, language: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Check for doctor list requests
  const doctorKeywords = ['doctor', 'doctor list', 'doctors', 'specialist', 'specialists', 'डॉक्टर', 'विशेषज्ञ', 'ਡਾਕਟਰ', 'ਵਿਸ਼ੇਸ਼ਗ'];
  const isDoctorRequest = doctorKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isDoctorRequest) {
    const specializations: { [key: string]: string[] } = {
      english: ['cardiologist', 'heart', 'dermatologist', 'skin', 'pediatrician', 'child', 'orthopedist', 'bone', 'joint'],
      hindi: ['हृदय', 'दिल', 'त्वचा', 'बाल', 'हड्डी', 'जोड़'],
      punjabi: ['ਦਿਲ', 'ਚਮੜੀ', 'ਬੱਚੇ', 'ਹੱਡੀਆਂ', 'ਜੋੜ']
    };
    
    const langSpecs = specializations[language] || specializations.english;
    let specialization = 'general';
    
    for (const spec of langSpecs) {
      if (lowerMessage.includes(spec)) {
        if (spec.includes('heart') || spec.includes('दिल') || spec.includes('ਹ੍ਦਯ')) specialization = 'cardiologist';
        else if (spec.includes('skin') || spec.includes('त्वचा') || spec.includes('ਚਮੜੀ')) specialization = 'dermatologist';
        else if (spec.includes('child') || spec.includes('बाल') || spec.includes('ਬੱਚੇ')) specialization = 'pediatrician';
        else if (spec.includes('bone') || spec.includes('joint') || spec.includes('हड्डी') || spec.includes('ਜੋੜ')) specialization = 'orthopedist';
        break;
      }
    }
    
    const doctors = getDoctorData(language, specialization);
    return formatDoctorData(doctors, language);
  }
  
  // Check for ASHA worker requests
  const ashaKeywords = ['asha', 'asha worker', 'asha workers', 'आशा', 'आशा कार्यकर्ता', 'ਆਸ਼ਾ', 'ਆਸ਼ਾ ਵਰਕਰ'];
  const isASHARequest = ashaKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isASHARequest) {
    const ashaWorkers = getASHAData(language);
    return formatASHAData(ashaWorkers, language);
  }
  
  return null;
}

// Initialize Gemini AI with secure API key handling
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

// Generate optimized system prompt based on language
function getSystemPrompt(language: string): string {
  const prompts = {
    english: `You are Nabha Care, a concise health advisor for a telemedicine app in Nabha village.

CRITICAL RULES:
- Keep responses under 80 words
- NEVER diagnose or prescribe
- Always suggest seeing a doctor for proper evaluation
- Be empathetic and supportive
- For serious symptoms, recommend immediate medical attention
- Help with app navigation and doctor selection
- Use simple, clear language

SPECIAL FEATURES:
- When users ask for doctor lists, provide doctor information (name, specialization, experience, availability, location)
- When users ask for ASHA worker contacts, provide ASHA worker details (name, area, experience, specializations, availability)
- You have access to local Nabha healthcare providers
- Never share phone numbers or personal contact details for privacy protection

Respond in English only.`,

    hindi: `आप नाभा केयर हैं, नाभा गाँव के टेलीमेडिसिन ऐप के लिए एक संक्षिप्त स्वास्थ्य सलाहकार।

महत्वपूर्ण नियम:
- जवाब 80 शब्दों से कम रखें
- कभी निदान या दवा न दें
- हमेशा डॉक्टर से मिलने की सलाह दें
- सहानुभूतिपूर्ण और सहायक बनें
- गंभीर लक्षणों के लिए तुरंत चिकित्सा सलाह दें
- ऐप नेविगेशन और डॉक्टर चुनने में मदद करें
- सरल, स्पष्ट भाषा का प्रयोग करें

विशेष सुविधाएं:
- जब उपयोगकर्ता डॉक्टर सूची मांगें, तो डॉक्टर जानकारी दें (नाम, विशेषज्ञता, अनुभव, उपलब्धता, स्थान)
- जब उपयोगकर्ता आशा कार्यकर्ता संपर्क मांगें, तो आशा कार्यकर्ता विवरण दें (नाम, क्षेत्र, अनुभव, विशेषज्ञता, उपलब्धता)
- आपके पास स्थानीय नाभा स्वास्थ्य सेवा प्रदाताओं की जानकारी है
- गोपनीयता सुरक्षा के लिए कभी भी फोन नंबर या व्यक्तिगत संपर्क विवरण साझा न करें

केवल हिंदी में जवाब दें।`,

    punjabi: `ਤੁਸੀਂ ਨਾਭਾ ਕੇਅਰ ਹੋ, ਨਾਭਾ ਪਿੰਡ ਦੇ ਟੈਲੀਮੈਡੀਸਿਨ ਐਪ ਲਈ ਇੱਕ ਸੰਖੇਪ ਸਿਹਤ ਸਲਾਹਕਾਰ।

ਮਹੱਤਵਪੂਰਨ ਨਿਯਮ:
- ਜਵਾਬ 80 ਸ਼ਬਦਾਂ ਤੋਂ ਘੱਟ ਰੱਖੋ
- ਕਦੇ ਵੀ ਨਿਦਾਨ ਜਾਂ ਦਵਾਈ ਨਾ ਦਿਓ
- ਹਮੇਸ਼ਾ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣ ਦੀ ਸਲਾਹ ਦਿਓ
- ਹਮਦਰਦੀ ਅਤੇ ਸਹਾਇਕ ਬਣੋ
- ਗੰਭੀਰ ਲੱਛਣਾਂ ਲਈ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਲਾਹ ਦਿਓ
- ਐਪ ਨੈਵੀਗੇਸ਼ਨ ਅਤੇ ਡਾਕਟਰ ਚੁਣਨ ਵਿੱਚ ਮਦਦ ਕਰੋ
- ਸਧਾਰਨ, ਸਪਸ਼ਟ ਭਾਸ਼ਾ ਦਾ ਪ੍ਰਯੋਗ ਕਰੋ

ਵਿਸ਼ੇਸ਼ ਸੁਵਿਧਾਵਾਂ:
- ਜਦੋਂ ਵਰਤੋਂਕਾਰ ਡਾਕਟਰ ਸੂਚੀ ਮੰਗਦੇ ਹਨ, ਤਾਂ ਡਾਕਟਰ ਜਾਣਕਾਰੀ ਦਿਓ (ਨਾਮ, ਵਿਸ਼ੇਸ਼ਤਾ, ਅਨੁਭਵ, ਉਪਲਬਧਤਾ, ਟਿਕਾਣਾ)
- ਜਦੋਂ ਵਰਤੋਂਕਾਰ ਆਸ਼ਾ ਵਰਕਰ ਸੰਪਰਕ ਮੰਗਦੇ ਹਨ, ਤਾਂ ਆਸ਼ਾ ਵਰਕਰ ਵਿਵਰਣ ਦਿਓ (ਨਾਮ, ਖੇਤਰ, ਅਨੁਭਵ, ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ, ਉਪਲਬਧਤਾ)
- ਤੁਹਾਡੇ ਕੋਲ ਸਥਾਨਕ ਨਾਭਾ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾਵਾਂ ਦੀ ਜਾਣਕਾਰੀ ਹੈ
- ਗੁਪਤਤਾ ਸੁਰੱਖਿਆ ਲਈ ਕਦੇ ਵੀ ਫੋਨ ਨੰਬਰ ਜਾਂ ਨਿੱਜੀ ਸੰਪਰਕ ਵਿਵਰਣ ਸਾਂਝੇ ਨਾ ਕਰੋ

ਕੇਵਲ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।`
  };
  
  return prompts[language as keyof typeof prompts] || prompts.english;
}

// Enhanced fallback responses for when API quota is exceeded
function getFallbackResponse(message: string, language: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Health-related fallback responses
  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('बुखार') || lowerMessage.includes('ਤਾਪਮਾਨ')) {
    return language === 'hindi' ? 
      'बुखार के लिए: आराम करें, पानी पिएं, और अगर तापमान 102°F से अधिक है तो डॉक्टर से संपर्क करें।' :
      language === 'punjabi' ?
      'ਬੁਖਾਰ ਲਈ: ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਅਤੇ ਜੇ ਤਾਪਮਾਨ 102°F ਤੋਂ ਵੱਧ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।' :
      'For fever: Rest, drink water, and contact a doctor if temperature is above 102°F.';
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द') || lowerMessage.includes('ਸਿਰਦਰਦ')) {
    return language === 'hindi' ?
      'सिरदर्द के लिए: आराम करें, पानी पिएं, और अगर दर्द गंभीर है तो डॉक्टर से संपर्क करें।' :
      language === 'punjabi' ?
      'ਸਿਰਦਰਦ ਲਈ: ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਅਤੇ ਜੇ ਦਰਦ ਗੰਭੀਰ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।' :
      'For headache: Rest, drink water, and contact a doctor if pain is severe.';
  }
  
  if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी') || lowerMessage.includes('ਖੰਘ')) {
    return language === 'hindi' ?
      'खांसी के लिए: गर्म पानी पिएं, आराम करें, और अगर खांसी 2 सप्ताह से अधिक रहती है तो डॉक्टर से संपर्क करें।' :
      language === 'punjabi' ?
      'ਖੰਘ ਲਈ: ਗਰਮ ਪਾਣੀ ਪੀਓ, ਆਰਾਮ ਕਰੋ, ਅਤੇ ਜੇ ਖੰਘ 2 ਹਫ਼ਤਿਆਂ ਤੋਂ ਵੱਧ ਰਹਿੰਦੀ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।' :
      'For cough: Drink warm water, rest, and contact a doctor if cough persists for more than 2 weeks.';
  }
  
  if (lowerMessage.includes('stomach') || lowerMessage.includes('पेट') || lowerMessage.includes('ਪੇਟ')) {
    return language === 'hindi' ?
      'पेट की समस्या के लिए: हल्का भोजन करें, पानी पिएं, और अगर दर्द बढ़ता है तो डॉक्टर से संपर्क करें।' :
      language === 'punjabi' ?
      'ਪੇਟ ਦੀ ਸਮੱਸਿਆ ਲਈ: ਹਲਕਾ ਭੋਜਨ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਅਤੇ ਜੇ ਦਰਦ ਵਧਦਾ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।' :
      'For stomach issues: Eat light food, drink water, and contact a doctor if pain worsens.';
  }
  
  if (lowerMessage.includes('chest') || lowerMessage.includes('सीना') || lowerMessage.includes('ਛਾਤੀ')) {
    return language === 'hindi' ?
      'छाती की समस्या के लिए: तुरंत डॉक्टर से संपर्क करें। यह गंभीर हो सकता है।' :
      language === 'punjabi' ?
      'ਛਾਤੀ ਦੀ ਸਮੱਸਿਆ ਲਈ: ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ। ਇਹ ਗੰਭੀਰ ਹੋ ਸਕਦਾ ਹੈ।' :
      'For chest issues: Contact a doctor immediately. This could be serious.';
  }
  
  // General health advice
  if (lowerMessage.includes('pain') || lowerMessage.includes('दर्द') || lowerMessage.includes('ਦਰਦ')) {
    return language === 'hindi' ?
      'दर्द के लिए: आराम करें, पानी पिएं, और अगर दर्द गंभीर है तो डॉक्टर से संपर्क करें।' :
      language === 'punjabi' ?
      'ਦਰਦ ਲਈ: ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਅਤੇ ਜੇ ਦਰਦ ਗੰਭੀਰ ਹੈ ਤਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।' :
      'For pain: Rest, drink water, and contact a doctor if pain is severe.';
  }
  
  // Friendly fallback with retry suggestion
  return language === 'hindi' ?
    'मैं वर्तमान में व्यस्त हूं। कृपया कुछ मिनट बाद पुनः प्रयास करें या डॉक्टर से सीधे संपर्क करें।' :
    language === 'punjabi' ?
    'ਮੈਂ ਇਸ ਸਮੇਂ ਵਿਅਸਤ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਮਿੰਟ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਡਾਕਟਰ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ।' :
    'I am currently busy. Please try again in a few minutes or contact a doctor directly.';
}

// Optimized Gemini API call with quota handling
async function callGeminiAPI(message: string, language: string, conversationHistory: Array<{ role: string; message: string }>): Promise<string> {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 200, // Limit response length
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
    
    // Build concise conversation context (only last 2 exchanges)
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-4); // Last 2 exchanges
      conversationContext = '\n\nRecent context:\n' + 
        recentHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}`
        ).join('\n');
    }
    
    const systemPrompt = getSystemPrompt(language);
    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Ensure response is concise
    return text.length > 300 ? text.substring(0, 300) + '...' : text;
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Check if it's a quota exceeded error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
      console.log('📊 Quota exceeded, using fallback response');
      return getFallbackResponse(message, language);
    }
    
    // For other errors, also use fallback
    console.log('🌐 API error, using fallback response');
    return getFallbackResponse(message, language);
  }
}

// Save chat message to MongoDB
async function saveChatMessage(
  userId: string, 
  sessionId: string, 
  role: 'user' | 'assistant', 
  message: string, 
  language: string,
  detectedLanguage?: string,
  doctorSuggestion?: {
    name: string;
    category: string;
    reason: string;
  } | null,
  isError?: boolean,
  metadata?: {
    responseTime?: number;
    model?: string;
    tokens?: number;
    originalError?: string;
  }
) {
  try {
    await connectDB();
    
    const chatMessage = new ChatMessage({
      userId,
      sessionId,
      role,
      message,
      language,
      detectedLanguage,
      doctorSuggestion,
      isError,
      metadata
    });
    
    await chatMessage.save();
    return chatMessage;
  } catch (error) {
    console.error('Error saving chat message:', error);
    // Don't throw error to avoid breaking the chat flow
  }
}

// Get chat history from MongoDB
async function getChatHistory(userId: string, sessionId: string, limit: number = 10) {
  try {
    await connectDB();
    
    const messages = await ChatMessage.find({
      userId,
      sessionId
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('role message language createdAt')
    .lean();
    
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Parse request body once at the beginning
  let body: ChatRequest;
  let message: string;
  let lang: string;
  let sessionId: string;
  let conversationHistory: any[];
  
  try {
    body = await request.json();
    message = body.message || '';
    lang = body.lang || 'auto';
    sessionId = body.sessionId || '';
    conversationHistory = body.conversationHistory || [];
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
  
  try {
    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user authentication (optional - for logged-in users)
    let userId = 'anonymous';
    try {
      const token = await getToken({ req: request });
      if (token?.sub) {
        userId = token.sub;
      }
    } catch (authError) {
      // Continue with anonymous user if auth fails
      console.log('Auth not available, using anonymous user');
    }

    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Detect language if not provided or auto
    const detectedLanguage = lang && lang !== 'auto' ? lang : detectLanguage(message);
    
    // Check for mock data requests first
    const mockDataResponse = checkForMockDataRequest(message, detectedLanguage);
    
    // Get doctor suggestion if applicable
    const doctorSuggestion = getDoctorSuggestion(message);

    // Save user message to MongoDB
    await saveChatMessage(
      userId,
      currentSessionId,
      'user',
      message.trim(),
      detectedLanguage,
      detectedLanguage
    );

    // Get recent chat history from MongoDB if not provided
    let chatHistory = conversationHistory;
    if (chatHistory.length === 0) {
      const dbHistory = await getChatHistory(userId, currentSessionId, 6);
      chatHistory = dbHistory.map(msg => ({
        role: msg.role,
        message: msg.message
      }));
    }

    // Use mock data if available, otherwise call Gemini API
    let finalResponse;
    if (mockDataResponse) {
      finalResponse = mockDataResponse;
    } else {
      finalResponse = await callGeminiAPI(message, detectedLanguage, chatHistory);
    }
    const responseTime = Date.now() - startTime;

    // Save assistant response to MongoDB
    await saveChatMessage(
      userId,
      currentSessionId,
      'assistant',
      finalResponse,
      detectedLanguage,
      detectedLanguage,
      doctorSuggestion,
      false,
      {
        responseTime,
        model: mockDataResponse ? 'mock-data' : 'gemini-1.5-flash'
      }
    );

    const responseData: ChatResponse = {
      success: true,
      message: finalResponse,
      doctorSuggestion: doctorSuggestion || undefined,
      detectedLanguage,
      sessionId: currentSessionId
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Try to save error message to MongoDB
    try {
      const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let userId = 'anonymous';
      try {
        const token = await getToken({ req: request });
        if (token?.sub) {
          userId = token.sub;
        }
      } catch {
        // Continue with anonymous user
      }

      await saveChatMessage(
        userId,
        currentSessionId,
        'assistant',
        "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.",
        'english',
        'english',
        null,
        true,
        { responseTime: Date.now() - startTime }
      );
    } catch (saveError) {
      console.error('Error saving error message:', saveError);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact support if the issue persists."
      },
      { status: 500 }
    );
  }
}
