import { useState, useCallback } from 'react';

/**
 * Custom hook for managing chat functionality with Gemini API
 * Handles API calls, state management, and error handling
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Send a message to the Gemini API and handle the response
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

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        message: msg.message
      }));

      // Call the backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          lang: language,
          conversationHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      if (data.success) {
        // Add bot response to the chat
        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          message: data.message,
          timestamp: new Date(),
          doctorSuggestion: data.doctorSuggestion,
          detectedLanguage: data.detectedLanguage
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Chat error:', err);
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
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  /**
   * Clear all messages from the chat
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
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
    sendMessage,
    clearMessages,
    retryLastMessage
  };
};
