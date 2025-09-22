'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minimize2, Maximize2, Send, Languages } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useChat } from '../hooks/useChat';

/**
 * ChatWindow component - Main chat interface
 * Features: draggable, responsive, multilingual support
 */
const ChatWindow = ({ isMinimized, onMinimize, onClose }) => {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle dragging functionality
  const handleMouseDown = (e) => {
    // Only allow dragging from header area
    if (e.target === e.currentTarget || (e.target).closest('.chat-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message, selectedLanguage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const languages = [
    { value: 'auto', label: 'Auto Detect' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' },
    { value: 'telugu', label: 'తెలుగు' }
  ];

  return (
    <motion.div
      ref={chatWindowRef}
      className={`fixed z-40 ${isMinimized ? 'bottom-20 right-6 w-80 h-16' : 'bottom-20 right-6 w-96 h-[600px]'} bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        width: isMinimized ? 320 : 384,
        height: isMinimized ? 64 : 600
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="chat-header bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 cursor-move select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">SS</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Sehat Saathi</h3>
              <p className="text-xs opacity-90">Health Advisor</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white bg-opacity-20 text-white text-xs rounded px-2 py-1 border-none outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="text-gray-800">
                  {lang.label}
                </option>
              ))}
            </select>
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h4 className="font-semibold mb-2">Welcome to Sehat Saathi!</h4>
                <p className="text-sm">I&apos;m your health advisor. How can I help you today?</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>• Ask about symptoms or health concerns</p>
                  <p>• Get doctor recommendations</p>
                  <p>• Navigate the app features</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.role === 'user'}
                  timestamp={msg.timestamp}
                  doctorSuggestion={msg.doctorSuggestion}
                  isError={msg.isError}
                />
              ))
            )}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Sehat Saathi is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your health concern..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatWindow;
