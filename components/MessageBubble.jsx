'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Stethoscope, Clock, AlertCircle } from 'lucide-react';

/**
 * MessageBubble component for displaying chat messages
 * Shows user messages on the right, bot messages on the left
 * Includes doctor suggestions and error states
 */
const MessageBubble = ({ message, isUser, timestamp, doctorSuggestion, isError = false }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : isError
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-green-500 to-green-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {/* Doctor Suggestion */}
          {doctorSuggestion && !isUser && !isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Recommended Doctor</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Doctor:</span>
                  <span className="text-sm text-gray-900">{doctorSuggestion.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Specialty:</span>
                  <span className="text-sm text-gray-900">{doctorSuggestion.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Reason:</span>
                  <span className="text-sm text-gray-900">{doctorSuggestion.reason}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full bg-blue-500 text-white text-xs py-2 px-3 rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => {
                  // In a real app, this would navigate to booking page
                  alert(`Booking appointment with ${doctorSuggestion.name} - ${doctorSuggestion.category}`);
                }}
              >
                Book Appointment
              </motion.button>
            </motion.div>
          )}

          {/* Error Icon for error messages */}
          {isError && (
            <div className="flex items-center space-x-1 mt-2">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span className="text-xs text-red-600">Error</span>
            </div>
          )}

          {/* Timestamp */}
          <div className={`flex items-center space-x-1 mt-2 text-xs ${
            isUser ? 'text-blue-100' : isError ? 'text-red-500' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
