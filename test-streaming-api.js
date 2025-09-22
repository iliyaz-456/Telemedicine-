// Test script for streaming API
const testStreamingAPI = async () => {
  try {
    console.log('🧪 Testing Streaming API...');
    
    const response = await fetch('http://localhost:3000/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'I have a fever and headache',
        lang: 'auto',
        sessionId: `test_stream_${Date.now()}`,
        conversationHistory: []
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Streaming API request failed');
    }
    
    console.log('📊 Streaming Response:');
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'chunk') {
                fullResponse += data.content;
                process.stdout.write(data.content); // Show streaming effect
              } else if (data.type === 'complete' || data.type === 'end') {
                console.log('\n✅ Streaming completed');
                console.log('📝 Full response:', fullResponse);
                return;
              } else if (data.type === 'error') {
                console.log('\n❌ Streaming error:', data.error);
                return;
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError);
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Streaming test failed:', error.message);
  }
};

testStreamingAPI();
