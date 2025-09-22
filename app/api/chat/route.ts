'use server';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for the chat API
interface ChatRequest {
  message: string;
  lang?: string;
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
  hindi: ['है', 'हैं', 'में', 'को', 'से', 'पर', 'के', 'की', 'का', 'हो', 'कर', 'दे', 'ले', 'जा', 'आ', 'बीमार', 'दर्द', 'बुखार', 'खांसी', 'सिरदर्द', 'पेट', 'सीना', 'मुझे', 'मेरे'],
  telugu: ['ఉంది', 'ఉన్నాయి', 'లో', 'కు', 'నుండి', 'పై', 'యొక్క', 'వేదన', 'జ్వరం', 'కఫం', 'అనారోగ్యం', 'వైద్యుడు', 'ఆసుపత్రి', 'తలనొప్పి', 'కడుపు', 'ఛాతీ', 'నాకు', 'నా'],
  english: ['is', 'are', 'in', 'to', 'from', 'on', 'the', 'a', 'an', 'and', 'or', 'but', 'have', 'has', 'had', 'will', 'would', 'should', 'could', 'pain', 'fever', 'headache', 'stomach', 'chest', 'i', 'my']
};

// Simple language detection function
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Count language-specific keywords
  const hindiCount = LANGUAGE_KEYWORDS.hindi.filter(word => lowerText.includes(word)).length;
  const teluguCount = LANGUAGE_KEYWORDS.telugu.filter(word => lowerText.includes(word)).length;
  const englishCount = LANGUAGE_KEYWORDS.english.filter(word => lowerText.includes(word)).length;
  
  if (hindiCount > teluguCount && hindiCount > englishCount) return 'hindi';
  if (teluguCount > hindiCount && teluguCount > englishCount) return 'telugu';
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

// Initialize Gemini AI
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD8XY5KYiLvGxMq1-CIMfmUNjYClERwHZs';
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

// Generate system prompt based on language
function getSystemPrompt(language: string): string {
  const prompts = {
    english: `You are Sehat Saathi, a professional, multilingual health advisor in a telemedicine app. Your role is to provide supportive, non-diagnostic health guidance.

IMPORTANT GUIDELINES:
- Be supportive, professional, and concise (under 150 words)
- NEVER provide medical diagnoses or prescribe medications
- Always recommend consulting healthcare professionals for proper evaluation
- Provide general health tips and preventive guidance
- Be empathetic and understanding
- If symptoms seem serious, encourage immediate medical attention
- Help users navigate the app (booking appointments, selecting doctors)
- Suggest appropriate doctor categories when relevant
- Keep responses conversational and friendly

Respond in English.`,

    hindi: `आप सेहत साथी हैं, एक टेलीमेडिसिन ऐप में एक पेशेवर, बहुभाषी स्वास्थ्य सलाहकार। आपका काम सहायक, गैर-नैदानिक स्वास्थ्य मार्गदर्शन प्रदान करना है।

महत्वपूर्ण दिशानिर्देश:
- सहायक, पेशेवर और संक्षिप्त रहें (150 शब्दों से कम)
- कभी भी चिकित्सा निदान या दवाएं न लिखें
- हमेशा उचित मूल्यांकन के लिए स्वास्थ्य सेवा पेशेवरों से परामर्श करने की सलाह दें
- सामान्य स्वास्थ्य सुझाव और निवारक मार्गदर्शन प्रदान करें
- सहानुभूतिपूर्ण और समझदार बनें
- यदि लक्षण गंभीर लगते हैं, तो तुरंत चिकित्सा ध्यान देने के लिए प्रोत्साहित करें
- उपयोगकर्ताओं को ऐप नेविगेट करने में मदद करें (अपॉइंटमेंट बुक करना, डॉक्टर चुनना)
- प्रासंगिक होने पर उपयुक्त डॉक्टर श्रेणियां सुझाएं
- जवाब बातचीत के तरीके में और दोस्ताना रखें

हिंदी में जवाब दें।`,

    telugu: `మీరు సేహత్ సాథి, టెలిమెడిసిన్ యాప్‌లో ఒక వృత్తిపరమైన, బహుభాషా ఆరోగ్య సలహాదారుడు. మీ పాత్ర సహాయక, నాన్-డయాగ్నోస్టిక్ ఆరోగ్య మార్గదర్శకత్వం అందించడం.

ముఖ్యమైన మార్గదర్శకాలు:
- సహాయక, వృత్తిపరమైన మరియు సంక్షిప్తంగా ఉండండి (150 పదాల కంటే తక్కువ)
- ఎప్పుడూ వైద్య నిర్ధారణలు లేదా మందులు వ్రాయవద్దు
- సరైన మూల్యాంకనం కోసం ఆరోగ్య సంరక్షణ నిపుణులను సంప్రదించమని ఎల్లప్పుడూ సిఫార్సు చేయండి
- సాధారణ ఆరోగ్య చిట్కాలు మరియు నివారణ మార్గదర్శకత్వం అందించండి
- సానుభూతిపరుడైన మరియు అవగాహన కలిగిన వ్యక్తిగా ఉండండి
- లక్షణాలు తీవ్రంగా అనిపిస్తే, వెంటనే వైద్య శ్రద్ధ కోసం ప్రోత్సహించండి
- వినియోగదారులకు యాప్‌ను నావిగేట్ చేయడంలో సహాయం చేయండి (అపాయింట్‌మెంట్‌లు బుక్ చేయడం, వైద్యులను ఎంచుకోవడం)
- సంబంధితమైనప్పుడు తగిన వైద్యుడు వర్గాలను సూచించండి
- సంభాషణ శైలిలో మరియు స్నేహపూర్వకంగా జవాబులు ఇవ్వండి

తెలుగులో జవాబు ఇవ్వండి.`
  };
  
  return prompts[language as keyof typeof prompts] || prompts.english;
}

// Call Gemini API
async function callGeminiAPI(message: string, language: string, conversationHistory: Array<{ role: string; message: string }>): Promise<string> {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Build conversation context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n' + 
        conversationHistory.slice(-3).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
        ).join('\n');
    }
    
    const systemPrompt = getSystemPrompt(language);
    const fullPrompt = `${systemPrompt}\n\nUser message: ${message}${conversationContext}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, lang, conversationHistory = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Detect language if not provided
    const detectedLanguage = lang || detectLanguage(message);
    
    // Get doctor suggestion if applicable
    const doctorSuggestion = getDoctorSuggestion(message);

    // Call Gemini API for real response
    const geminiResponse = await callGeminiAPI(message, detectedLanguage, conversationHistory);

    const responseData: ChatResponse = {
      success: true,
      message: geminiResponse,
      // doctorSuggestion,
      detectedLanguage
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
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
