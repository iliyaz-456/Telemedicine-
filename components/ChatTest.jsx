'use client';

import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

/**
 * Test component for the optimized chatbot
 * Use this to test the chatbot functionality
 */
const ChatTest = () => {
  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    const tests = [
      {
        name: 'Input Field Clearing',
        description: 'Check if input field clears after sending message',
        status: 'pending'
      },
      {
        name: 'Language Selector Visibility',
        description: 'Check if language selector is visible and functional',
        status: 'pending'
      },
      {
        name: 'Real-time UI Updates',
        description: 'Check if chat UI updates immediately',
        status: 'pending'
      },
      {
        name: 'Multilingual Support',
        description: 'Test English, Hindi, and Punjabi responses',
        status: 'pending'
      },
      {
        name: 'MongoDB Integration',
        description: 'Verify chat history is saved to database',
        status: 'pending'
      }
    ];

    setTestResults(tests);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          NabhaCare Chatbot Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium">1. Input Field Clearing Test</h3>
              <p>• Type a message and press Enter or click Send</p>
              <p>• Verify the input field clears immediately</p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Language Selector Test</h3>
              <p>• Check if the language dropdown is visible in the header</p>
              <p>• Try selecting different languages (English, Hindi, Punjabi)</p>
              <p>• Verify the selector has proper styling and contrast</p>
            </div>
            
            <div>
              <h3 className="font-medium">3. Real-time Updates Test</h3>
              <p>• Send a message and watch for immediate UI updates</p>
              <p>• Check if streaming responses appear in real-time</p>
              <p>• Verify both user and bot messages appear instantly</p>
            </div>
            
            <div>
              <h3 className="font-medium">4. Multilingual Test</h3>
              <p>• Test with English: "I have a fever"</p>
              <p>• Test with Hindi: "मुझे बुखार है"</p>
              <p>• Test with Punjabi: "ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ"</p>
              <p>• Verify responses are in the correct language</p>
            </div>
            
            <div>
              <h3 className="font-medium">5. MongoDB Integration Test</h3>
              <p>• Send several messages</p>
              <p>• Check MongoDB for saved chat messages</p>
              <p>• Verify session management works</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <button
            onClick={runTests}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Run Tests
          </button>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((test, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className={`w-3 h-3 rounded-full ${
                    test.status === 'pending' ? 'bg-yellow-400' :
                    test.status === 'passed' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-sm text-gray-600">{test.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Widget - Always visible for testing */}
      <ChatWidget />
    </div>
  );
};

export default ChatTest;
