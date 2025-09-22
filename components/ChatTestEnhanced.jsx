'use client';

import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

/**
 * Enhanced test component for Sehat Shakti chatbot
 * Tests all new features including mock data, UI fixes, and multilingual support
 */
const ChatTestEnhanced = () => {
  const [testResults, setTestResults] = useState([]);

  const runTests = async () => {
    const tests = [
      {
        name: 'UI Layout Fix',
        description: 'Check if chatbot opens fully visible without being cut off',
        status: 'pending'
      },
      {
        name: 'Healthcare Logo',
        description: 'Verify hospital emoji logo and Sehat Shakti name',
        status: 'pending'
      },
      {
        name: 'Mock Doctor Data - English',
        description: 'Test doctor list in English',
        status: 'pending'
      },
      {
        name: 'Mock Doctor Data - Hindi',
        description: 'Test doctor list in Hindi',
        status: 'pending'
      },
      {
        name: 'Mock Doctor Data - Punjabi',
        description: 'Test doctor list in Punjabi',
        status: 'pending'
      },
      {
        name: 'Mock ASHA Data - English',
        description: 'Test ASHA worker contacts in English',
        status: 'pending'
      },
      {
        name: 'Mock ASHA Data - Hindi',
        description: 'Test ASHA worker contacts in Hindi',
        status: 'pending'
      },
      {
        name: 'Mock ASHA Data - Punjabi',
        description: 'Test ASHA worker contacts in Punjabi',
        status: 'pending'
      },
      {
        name: 'Real-time Performance',
        description: 'Verify streaming responses work without delays',
        status: 'pending'
      },
      {
        name: 'MongoDB Integration',
        description: 'Confirm chat history is saved and retrieved',
        status: 'pending'
      }
    ];

    setTestResults(tests);
  };

  const testCases = {
    doctorRequests: {
      english: [
        "Show me doctor list",
        "I need a cardiologist",
        "Do you have any dermatologists?",
        "List all specialists"
      ],
      hindi: [
        "डॉक्टर सूची दिखाएं",
        "मुझे हृदय रोग विशेषज्ञ चाहिए",
        "क्या आपके पास त्वचा रोग विशेषज्ञ हैं?",
        "सभी विशेषज्ञों की सूची दें"
      ],
      punjabi: [
        "ਡਾਕਟਰ ਸੂਚੀ ਦਿਖਾਓ",
        "ਮੈਨੂੰ ਦਿਲ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ ਚਾਹੀਦਾ ਹੈ",
        "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਚਮੜੀ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ ਹਨ?",
        "ਸਾਰੇ ਵਿਸ਼ੇਸ਼ਗਾਂ ਦੀ ਸੂਚੀ ਦਿਓ"
      ]
    },
    ashaRequests: {
      english: [
        "Show ASHA worker contacts",
        "I need ASHA worker details",
        "List all ASHA workers",
        "ASHA worker information"
      ],
      hindi: [
        "आशा कार्यकर्ता संपर्क दिखाएं",
        "मुझे आशा कार्यकर्ता विवरण चाहिए",
        "सभी आशा कार्यकर्ताओं की सूची दें",
        "आशा कार्यकर्ता जानकारी"
      ],
      punjabi: [
        "ਆਸ਼ਾ ਵਰਕਰ ਸੰਪਰਕ ਦਿਖਾਓ",
        "ਮੈਨੂੰ ਆਸ਼ਾ ਵਰਕਰ ਵਿਵਰਣ ਚਾਹੀਦਾ ਹੈ",
        "ਸਾਰੇ ਆਸ਼ਾ ਵਰਕਰਾਂ ਦੀ ਸੂਚੀ ਦਿਓ",
        "ਆਸ਼ਾ ਵਰਕਰ ਜਾਣਕਾਰੀ"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Sehat Shakti Chatbot - Enhanced Testing
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium text-green-600">1. UI Layout Test</h3>
                <p>• Open the chat widget (bottom right)</p>
                <p>• Verify the chat window opens fully visible</p>
                <p>• Check that no content is cut off at the top</p>
              </div>
              
              <div>
                <h3 className="font-medium text-green-600">2. Logo & Branding Test</h3>
                <p>• Look for 🏥 hospital emoji in the header</p>
                <p>• Verify "Sehat Shakti" name is displayed</p>
                <p>• Check welcome message shows correct name</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">3. Mock Doctor Data Test</h3>
                <p>• Try: "Show me doctor list" (English)</p>
                <p>• Try: "डॉक्टर सूची दिखाएं" (Hindi)</p>
                <p>• Try: "ਡਾਕਟਰ ਸੂਚੀ ਦਿਖਾਓ" (Punjabi)</p>
                <p>• Test specific specializations: cardiologist, dermatologist, etc.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-600">4. Mock ASHA Data Test</h3>
                <p>• Try: "Show ASHA worker contacts" (English)</p>
                <p>• Try: "आशा कार्यकर्ता संपर्क दिखाएं" (Hindi)</p>
                <p>• Try: "ਆਸ਼ਾ ਵਰਕਰ ਸੰਪਰਕ ਦਿਖਾਓ" (Punjabi)</p>
                <p>• Verify contact details and specializations</p>
              </div>
              
              <div>
                <h3 className="font-medium text-purple-600">5. Performance Test</h3>
                <p>• Check real-time streaming responses</p>
                <p>• Verify no delays in message display</p>
                <p>• Test language switching functionality</p>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Test Cases</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Doctor Requests</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>English:</strong> "Show me doctor list"
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Hindi:</strong> "डॉक्टर सूची दिखाएं"
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Punjabi:</strong> "ਡਾਕਟਰ ਸੂਚੀ ਦਿਖਾਓ"
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">ASHA Worker Requests</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-green-50 rounded">
                    <strong>English:</strong> "Show ASHA worker contacts"
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <strong>Hindi:</strong> "आशा कार्यकर्ता संपर्क दिखाएं"
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <strong>Punjabi:</strong> "ਆਸ਼ਾ ਵਰਕਰ ਸੰਪਰਕ ਦਿਖਾਓ"
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Specialization Tests</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-yellow-50 rounded">
                    <strong>Cardiologist:</strong> "I need a heart doctor"
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <strong>Dermatologist:</strong> "Skin specialist needed"
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <strong>Pediatrician:</strong> "Child doctor required"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <button
            onClick={runTests}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Run All Tests
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

        {/* Expected Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Expected Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-green-600 mb-2">✅ UI & Branding</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Chat window opens fully visible</li>
                <li>• Hospital emoji (🏥) in header</li>
                <li>• "Sehat Shakti" name displayed</li>
                <li>• No content cut off at top</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-600 mb-2">✅ Mock Data</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Doctor lists with contact details</li>
                <li>• ASHA worker information</li>
                <li>• Multilingual responses</li>
                <li>• Specialization-specific data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-purple-600 mb-2">✅ Performance</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Real-time streaming responses</li>
                <li>• No delays in message display</li>
                <li>• Smooth language switching</li>
                <li>• MongoDB integration working</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-orange-600 mb-2">✅ Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Input field clears after sending</li>
                <li>• Language selector visible</li>
                <li>• Chat history persistence</li>
                <li>• Error handling & recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Widget - Always visible for testing */}
      <ChatWidget />
    </div>
  );
};

export default ChatTestEnhanced;
