// Test script to verify Gemini API key setup
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Gemini API Key Setup...\n');

// Check if API key exists
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY not found in environment variables');
  console.log('📝 Please create a .env.local file with your API key');
  console.log('📖 See ENVIRONMENT_SETUP.md for detailed instructions');
  process.exit(1);
}

if (apiKey === 'your_actual_gemini_api_key_here' || apiKey === 'your_gemini_api_key_here') {
  console.log('❌ Please replace the placeholder API key with your actual Gemini API key');
  console.log('🔗 Get your API key from: https://makersuite.google.com/app/apikey');
  process.exit(1);
}

if (!apiKey.startsWith('AIzaSy')) {
  console.log('⚠️  Warning: API key format looks unusual');
  console.log('🔑 Gemini API keys usually start with "AIzaSy"');
}

console.log('✅ GEMINI_API_KEY found in environment variables');
console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

// Test API connection
async function testGeminiAPI() {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    console.log('\n🔄 Testing API connection...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Hello, this is a test message.");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API connection successful!');
    console.log(`📝 Test response: ${text.substring(0, 100)}...`);
    
  } catch (error) {
    console.log('❌ API connection failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('🔑 Your API key appears to be invalid');
      console.log('🔗 Get a new API key from: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.log('📊 You may have exceeded your API quota');
      console.log('⏰ Free tier allows 50 requests per day');
    } else {
      console.log('🌐 This might be a network or configuration issue');
    }
  }
}

testGeminiAPI();
