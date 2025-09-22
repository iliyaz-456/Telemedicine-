/**
 * Simple test script for the optimized chatbot
 * Run with: node test-chatbot.js
 */

const testChatbot = async () => {
  console.log('🧪 Testing Optimized Sehat Saathi Chatbot...\n');

  // Test cases for different languages
  const testCases = [
    {
      message: "I have a fever and headache",
      language: "english",
      expectedLanguage: "english"
    },
    {
      message: "मुझे बुखार और सिरदर्द है",
      language: "hindi", 
      expectedLanguage: "hindi"
    },
    {
      message: "ਮੈਨੂੰ ਬੁਖਾਰ ਅਤੇ ਸਿਰਦਰਦ ਹੈ",
      language: "punjabi",
      expectedLanguage: "punjabi"
    },
    {
      message: "I have chest pain",
      language: "auto",
      expectedLanguage: "english"
    }
  ];

  console.log('📋 Test Cases:');
  testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.message} (${test.language})`);
  });

  console.log('\n✅ Test script created successfully!');
  console.log('📝 To test the chatbot:');
  console.log('1. Start your Next.js app: npm run dev');
  console.log('2. Open http://localhost:3000');
  console.log('3. Click the chat widget');
  console.log('4. Try the test messages above');
  console.log('5. Check MongoDB for saved messages');
  
  console.log('\n🔧 Environment Setup Required:');
  console.log('- GEMINI_API_KEY in .env.local');
  console.log('- MONGODB_URI in .env.local');
  console.log('- MongoDB running/accessible');
  
  console.log('\n📊 Expected Results:');
  console.log('- Concise responses (under 80 words)');
  console.log('- Proper language detection');
  console.log('- Real-time streaming responses');
  console.log('- Messages saved to MongoDB');
  console.log('- Doctor recommendations when relevant');
};

// Run the test
testChatbot().catch(console.error);
