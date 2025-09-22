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

// Check if user is asking for mock data
function checkForMockDataRequest(message: string, language: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Check for doctor list requests
  const doctorKeywords = ['doctor', 'doctor list', 'doctors', 'specialist', 'specialists', 'डॉक्टर', 'विशेषज्ञ', 'ਡਾਕਟਰ', 'ਵਿਸ਼ੇਸ਼ਗ'];
  const isDoctorRequest = doctorKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (isDoctorRequest) {
    const specializations = {
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
- When users ask for doctor lists, provide detailed doctor information
- When users ask for ASHA worker contacts, provide ASHA worker details
- You have access to local Nabha healthcare providers
- Always provide contact information when requested

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
- जब उपयोगकर्ता डॉक्टर सूची मांगें, तो विस्तृत डॉक्टर जानकारी दें
- जब उपयोगकर्ता आशा कार्यकर्ता संपर्क मांगें, तो आशा कार्यकर्ता विवरण दें
- आपके पास स्थानीय नाभा स्वास्थ्य सेवा प्रदाताओं की जानकारी है
- अनुरोध पर हमेशा संपर्क जानकारी प्रदान करें

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
- ਜਦੋਂ ਵਰਤੋਂਕਾਰ ਡਾਕਟਰ ਸੂਚੀ ਮੰਗਦੇ ਹਨ, ਤਾਂ ਵਿਸਤ੍ਰਿਤ ਡਾਕਟਰ ਜਾਣਕਾਰੀ ਦਿਓ
- ਜਦੋਂ ਵਰਤੋਂਕਾਰ ਆਸ਼ਾ ਵਰਕਰ ਸੰਪਰਕ ਮੰਗਦੇ ਹਨ, ਤਾਂ ਆਸ਼ਾ ਵਰਕਰ ਵਿਵਰਣ ਦਿਓ
- ਤੁਹਾਡੇ ਕੋਲ ਸਥਾਨਕ ਨਾਭਾ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾਵਾਂ ਦੀ ਜਾਣਕਾਰੀ ਹੈ
- ਬੇਨਤੀ 'ਤੇ ਹਮੇਸ਼ਾ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰੋ

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
  doctorSuggestion?: any,
  isError?: boolean,
  metadata?: any
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
            // Handle Gemini API streaming
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
