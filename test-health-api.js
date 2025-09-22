// Test script for health-related queries
const testHealthAPI = async () => {
  const testMessages = [
    'I have a fever',
    'मुझे बुखार है',
    'ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ',
    'I have a headache',
    'मुझे सिरदर्द है',
    'I have chest pain'
  ];
  
  for (const message of testMessages) {
    try {
      console.log(`\n🧪 Testing: "${message}"`);
      
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          lang: 'auto',
          sessionId: `test_health_${Date.now()}`,
          conversationHistory: []
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Response:', data.message);
        console.log('🌍 Language:', data.detectedLanguage);
      } else {
        console.log('❌ Error:', data.error);
      }
      
    } catch (error) {
      console.error('💥 Test failed:', error.message);
    }
  }
};

testHealthAPI();
