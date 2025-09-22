'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestChatbotPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          lang: 'auto',
          sessionId: `test_${Date.now()}`,
          conversationHistory: []
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.message || data.response || 'No response received');
      } else {
        setError(data.error || 'API request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const testStreamingAPI = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          lang: 'auto',
          sessionId: `test_stream_${Date.now()}`,
          conversationHistory: []
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Streaming API request failed');
      }
      
      const reader = res.body?.getReader();
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
                  setResponse(fullResponse);
                } else if (data.type === 'end') {
                  setResponse(fullResponse);
                } else if (data.type === 'error') {
                  setError(data.error || 'Streaming error');
                }
              } catch (parseError) {
                console.error('Error parsing streaming data:', parseError);
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Chatbot API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter test message..."
              onKeyPress={(e) => e.key === 'Enter' && testAPI()}
            />
            <Button onClick={testAPI} disabled={loading || !message.trim()}>
              Test Regular API
            </Button>
            <Button onClick={testStreamingAPI} disabled={loading || !message.trim()} variant="outline">
              Test Streaming API
            </Button>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Testing API...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {response && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800">Response:</h3>
              <p className="text-green-700 whitespace-pre-wrap">{response}</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Messages:</h3>
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMessage("Hello, how are you?")}
              >
                Simple Greeting
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMessage("I need a doctor for heart problems")}
              >
                Doctor Request
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMessage("Show me ASHA workers")}
              >
                ASHA Workers
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMessage("मुझे बुखार है")}
              >
                Hindi Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
