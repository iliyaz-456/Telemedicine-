import { useState, useCallback, useEffect } from 'react';

/**
 * Enhanced chat hook with streaming support for real-time responses
 * Handles streaming API calls, state management, error handling, and MongoDB integration
 */
export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState('');

  // Initialize session ID on first use
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  /**
   * Send a message with streaming response
   * @param {string} message - The user's message
   * @param {string} language - The detected or selected language
   */
  const sendMessage = useCallback(async (message, language = 'auto') => {
    if (!message.trim()) return;

    // Add user message immediately to the chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    try {
      // Prepare conversation history for context (only last 6 messages for efficiency)
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        message: msg.message
      }));

      // Create streaming response
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          lang: language,
          sessionId: sessionId,
          conversationHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let currentSessionId = sessionId;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                fullResponse += data.content;
                setStreamingMessage(fullResponse);
                
                // Update session ID if provided
                if (data.sessionId && data.sessionId !== currentSessionId) {
                  currentSessionId = data.sessionId;
                  setSessionId(data.sessionId);
                }
              } else if (data.type === 'complete') {
                // Streaming complete, add final message
                const botMessage = {
                  id: Date.now() + 1,
                  role: 'assistant',
                  message: fullResponse,
                  timestamp: new Date(),
                  detectedLanguage: data.detectedLanguage
                };

                setMessages(prev => [...prev, botMessage]);
                setStreamingMessage('');
                
                if (data.sessionId && data.sessionId !== currentSessionId) {
                  setSessionId(data.sessionId);
                }
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Streaming error occurred');
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError);
            }
          }
        }
      }

    } catch (err) {
      console.error('Streaming chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorBotMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        message: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorBotMessage]);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId]);

  /**
   * Clear all messages from the chat and start new session
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setStreamingMessage('');
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  /**
   * Retry the last user message
   * @param {string} language - The language to use for retry
   */
  const retryLastMessage = useCallback(async (language = 'auto') => {
    if (messages.length === 0) return;

    // Find the last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');

    if (lastUserMessage) {
      // Remove the last user message and any subsequent messages
      setMessages(prev => {
        const lastUserIndex = prev.findIndex(msg => 
          msg.role === 'user' && 
          msg.message === lastUserMessage.message && 
          msg.timestamp.getTime() === lastUserMessage.timestamp.getTime()
        );
        return prev.slice(0, lastUserIndex);
      });

      // Resend the message
      await sendMessage(lastUserMessage.message, language);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    streamingMessage,
    sendMessage,
    clearMessages,
    retryLastMessage
  };
};
