// Simple test script to verify the chatbot API
const testAPI = async () => {
  try {
    console.log('🧪 Testing Chatbot API...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, how are you?',
        lang: 'auto',
        sessionId: `test_${Date.now()}`,
        conversationHistory: []
      }),
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📝 Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ API call successful!');
      console.log('💬 Message:', data.message);
      console.log('🌍 Language:', data.detectedLanguage);
      console.log('🆔 Session ID:', data.sessionId);
    } else {
      console.log('❌ API call failed:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
};

testAPI();
