'use server';
import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '../../../../backend/utils/mongodb';
import ChatMessage from '../../../../backend/models/ChatMessage';
import { getToken } from 'next-auth/jwt';
import { getDoctorData, getASHAData, formatDoctorData, formatASHAData } from '../../../../lib/mockData';

// Types for the streaming chat API
interface StreamChatRequest {
  message: string;
  lang?: string;
  sessionId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; message: string }>;
}

// Language detection keywords (same as main route)
const LANGUAGE_KEYWORDS = {
  hindi: ['है', 'हैं', 'में', 'को', 'से', 'पर', 'के', 'की', 'का', 'हो', 'कर', 'दे', 'ले', 'जा', 'आ', 'बीमार', 'दर्द', 'बुखार', 'खांसी', 'सिरदर्द', 'पेट', 'सीना', 'मुझे', 'मेरे', 'हिंदी', 'भारत'],
  punjabi: ['ਹੈ', 'ਹਨ', 'ਵਿੱਚ', 'ਨੂੰ', 'ਤੋਂ', 'ਤੇ', 'ਦੇ', 'ਦੀ', 'ਦਾ', 'ਹੋ', 'ਕਰ', 'ਦੇ', 'ਲੈ', 'ਜਾ', 'ਆ', 'ਬੀਮਾਰ', 'ਦਰਦ', 'ਬੁਖਾਰ', 'ਖੰਘ', 'ਸਿਰਦਰਦ', 'ਪੇਟ', 'ਛਾਤੀ', 'ਮੈਨੂੰ', 'ਮੇਰੇ', 'ਪੰਜਾਬੀ', 'ਪੰਜਾਬ'],
  english: ['is', 'are', 'in', 'to', 'from', 'on', 'the', 'a', 'an', 'and', 'or', 'but', 'have', 'has', 'had', 'will', 'would', 'should', 'could', 'pain', 'fever', 'headache', 'stomach', 'chest', 'i', 'my', 'english', 'india']
};

// Enhanced language detection function
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();
  
  const hindiCount = LANGUAGE_KEYWORDS.hindi.filter(word => lowerText.includes(word)).length;
  const punjabiCount = LANGUAGE_KEYWORDS.punjabi.filter(word => lowerText.includes(word)).length;
  const englishCount = LANGUAGE_KEYWORDS.english.filter(word => lowerText.includes(word)).length;
  
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasGurmukhi = /[\u0A00-\u0A7F]/.test(text);
  
  if (hasGurmukhi || punjabiCount > 0) return 'punjabi';
  if (hasDevanagari || hindiCount > 0) return 'hindi';
  if (englishCount > 0) return 'english';
  
  return 'english';
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

// Optimized system prompts
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

// Initialize Gemini AI
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  return new GoogleGenerativeAI(apiKey);
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
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: StreamChatRequest = await request.json();
    const { message, lang, sessionId, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user authentication
    let userId = 'anonymous';
    try {
      const token = await getToken({ req: request });
      if (token?.sub) {
        userId = token.sub;
      }
    } catch (authError) {
      console.log('Auth not available, using anonymous user');
    }

    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const detectedLanguage = lang && lang !== 'auto' ? lang : detectLanguage(message);

    // Check for mock data requests first
    const mockDataResponse = checkForMockDataRequest(message, detectedLanguage);

    // Save user message to MongoDB
    await saveChatMessage(
      userId,
      currentSessionId,
      'user',
      message.trim(),
      detectedLanguage,
      detectedLanguage
    );

    // Prepare conversation context
    let chatHistory = conversationHistory;
    if (chatHistory.length === 0) {
      try {
        await connectDB();
        const dbHistory = await ChatMessage.find({
          userId,
          sessionId: currentSessionId
        })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('role message language createdAt')
        .lean();
        
        chatHistory = dbHistory.reverse().map(msg => ({
          role: msg.role,
          message: msg.message
        }));
      } catch (error) {
        console.error('Error getting chat history:', error);
        chatHistory = [];
      }
    }

    // Initialize Gemini and create streaming response
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });

    // Build prompt
    let conversationContext = '';
    if (chatHistory && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-4);
      conversationContext = '\n\nRecent context:\n' + 
        recentHistory.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}`
        ).join('\n');
    }
    
    const systemPrompt = getSystemPrompt(detectedLanguage);
    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}\nAssistant:`;

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          
          // Handle mock data response
          if (mockDataResponse) {
            fullResponse = mockDataResponse;
            
            // Send mock data as chunks for streaming effect
            const words = fullResponse.split(' ');
            for (let i = 0; i < words.length; i++) {
              const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
              
              const data = JSON.stringify({
                type: 'chunk',
                content: chunk,
                sessionId: currentSessionId
              });
              
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              
              // Small delay for streaming effect
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          } else {
            // Handle Gemini API streaming with quota error handling
            try {
              const result = await model.generateContentStream(fullPrompt);
              
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                
                // Send chunk to client
                const data = JSON.stringify({
                  type: 'chunk',
                  content: chunkText,
                  sessionId: currentSessionId
                });
                
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            } catch (apiError) {
              console.error('❌ Gemini API Streaming Error:', apiError);
              
              // If API fails due to quota or other issues, use fallback response
              const errorMessage = apiError instanceof Error ? apiError.message : 'API error';
              
              if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
                console.log('📊 Quota exceeded, using fallback response');
                fullResponse = getFallbackResponse(message, detectedLanguage);
              } else {
                console.log('🌐 API error, using fallback response');
                fullResponse = getFallbackResponse(message, detectedLanguage);
              }
              
              // Send fallback response as chunks for streaming effect
              const words = fullResponse.split(' ');
              for (let i = 0; i < words.length; i++) {
                const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
                
                const data = JSON.stringify({
                  type: 'chunk',
                  content: chunk,
                  sessionId: currentSessionId
                });
                
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                
                // Small delay for streaming effect
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          }

          // Save complete response to MongoDB
          await saveChatMessage(
            userId,
            currentSessionId,
            'assistant',
            fullResponse,
            detectedLanguage,
            detectedLanguage,
            null,
            false,
            {
              responseTime: Date.now() - startTime,
              model: mockDataResponse ? 'mock-data' : 'gemini-1.5-flash'
            }
          );

          // Send completion signal
          const completionData = JSON.stringify({
            type: 'complete',
            sessionId: currentSessionId,
            detectedLanguage
          });
          
          controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
          controller.close();

        } catch (error) {
          console.error('Streaming error:', error);
          
          // Save error message
          await saveChatMessage(
            userId,
            currentSessionId,
            'assistant',
            "I apologize, but I'm experiencing technical difficulties. Please try again.",
            'english',
            'english',
            null,
            true,
            { responseTime: Date.now() - startTime }
          );

          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            sessionId: currentSessionId
          });
          
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Streaming API error:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
