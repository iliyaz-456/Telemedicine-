# Optimized Sehat Saathi Chatbot Setup Guide

## 🚀 Quick Setup

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```env
# Google Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection String (Required)
MONGODB_URI=mongodb://localhost:27017/telemedicine

# NextAuth Configuration (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

### 3. Install Dependencies
```bash
npm install @google/generative-ai framer-motion
```

### 4. Start the Application
```bash
npm run dev
```

## ✨ New Features

### 🎯 Optimized Responses
- **Concise**: Responses limited to 80 words maximum
- **Clear**: Simple, easy-to-understand language
- **Focused**: Direct answers without unnecessary details

### 🌍 Enhanced Multilingual Support
- **English**: Full support with medical terminology
- **Hindi**: Native Hindi responses with proper script
- **Punjabi**: Complete Punjabi support with Gurmukhi script
- **Auto-detection**: Intelligent language detection based on script and keywords

### ⚡ Real-time Streaming
- **Live responses**: See responses as they're generated
- **Faster interaction**: No waiting for complete responses
- **Better UX**: Real-time typing indicators

### 💾 MongoDB Integration
- **Persistent chat history**: All conversations saved to database
- **User sessions**: Track conversations per user/session
- **Performance metrics**: Response time and token usage tracking
- **Error logging**: Comprehensive error tracking

### 🔒 Security Improvements
- **Secure API keys**: No hardcoded keys in source code
- **User authentication**: Optional user-based chat history
- **Input validation**: Proper message validation and sanitization

## 🏗️ Architecture

### File Structure
```
Telemedicine-/
├── app/api/chat/
│   ├── route.ts              # Main chat API (non-streaming)
│   └── stream/route.ts       # Streaming chat API
├── backend/models/
│   └── ChatMessage.ts        # MongoDB chat message model
├── components/
│   ├── ChatWidget.jsx        # Main floating button
│   ├── ChatWindow.jsx        # Original chat window
│   └── ChatWindowStream.jsx  # Enhanced streaming chat window
├── hooks/
│   ├── useChat.js            # Original chat hook
│   └── useChatStream.js      # Enhanced streaming chat hook
└── .env.local                # Environment variables
```

### API Endpoints

#### POST /api/chat
Standard chat API with MongoDB integration
```json
{
  "message": "I have a fever",
  "lang": "english",
  "sessionId": "session_123",
  "conversationHistory": [...]
}
```

#### POST /api/chat/stream
Streaming chat API for real-time responses
```json
{
  "message": "I have a fever",
  "lang": "english", 
  "sessionId": "session_123",
  "conversationHistory": [...]
}
```

### MongoDB Schema

#### ChatMessage Collection
```javascript
{
  userId: ObjectId,           // User ID (or 'anonymous')
  sessionId: String,          // Session identifier
  role: 'user' | 'assistant', // Message role
  message: String,            // Message content
  language: String,           // Detected language
  detectedLanguage: String,   // Auto-detected language
  doctorSuggestion: Object,   // Doctor recommendation
  isError: Boolean,           // Error flag
  metadata: Object,           // Response time, model info
  createdAt: Date,            // Timestamp
  updatedAt: Date             // Last updated
}
```

## 🎛️ Configuration

### Language Detection
The system automatically detects language using:
- **Script detection**: Devanagari (Hindi), Gurmukhi (Punjabi), Latin (English)
- **Keyword matching**: Language-specific medical terms
- **Fallback**: Defaults to English if unclear

### Response Optimization
- **Token limits**: Maximum 200 tokens per response
- **Temperature**: 0.7 for balanced creativity/consistency
- **Context window**: Last 6 messages for efficiency
- **Response truncation**: Automatic truncation at 300 characters

### Performance Settings
- **Streaming**: Real-time response generation
- **Caching**: MongoDB connection pooling
- **Error handling**: Graceful fallbacks
- **Rate limiting**: Built-in request validation

## 🔧 Customization

### Adding New Languages
1. Update `LANGUAGE_KEYWORDS` in `/app/api/chat/route.ts`
2. Add system prompt in `getSystemPrompt()` function
3. Update language selector in `ChatWindowStream.jsx`

### Modifying Response Style
Edit the system prompts in `getSystemPrompt()` function:
```javascript
const prompts = {
  english: `Your custom prompt here...`,
  hindi: `आपका कस्टम प्रॉम्प्ट यहाँ...`,
  punjabi: `ਤੁਹਾਡਾ ਕਸਟਮ ਪ੍ਰੋਮਪਟ ਇੱਥੇ...`
};
```

### Doctor Recommendations
Update `DOCTOR_MAPPING` in `/app/api/chat/route.ts`:
```javascript
const DOCTOR_MAPPING = {
  'symptom': { 
    name: 'Dr. Name', 
    category: 'Specialty', 
    reason: 'Reason for recommendation' 
  }
};
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `GEMINI_API_KEY` is set in `.env.local`
   - Verify the API key is valid and has proper permissions

2. **MongoDB Connection Error**
   - Check `MONGODB_URI` in `.env.local`
   - Ensure MongoDB is running (local) or accessible (cloud)

3. **Streaming Not Working**
   - Check browser compatibility (Chrome/Edge recommended)
   - Verify network connection stability
   - Check console for JavaScript errors

4. **Language Detection Issues**
   - Ensure proper script input (Devanagari for Hindi, Gurmukhi for Punjabi)
   - Check if language keywords are being detected
   - Manually select language if auto-detection fails

### Debug Mode
Enable detailed logging by checking browser console and server logs for:
- API response times
- Language detection results
- MongoDB operation status
- Streaming connection status

## 📊 Monitoring

### Performance Metrics
- Response time tracking
- Token usage monitoring
- Error rate analysis
- User engagement metrics

### Health Checks
- API endpoint availability
- MongoDB connection status
- Gemini API quota usage
- Memory and CPU usage

## 🔄 Migration from Old Version

### Backward Compatibility
- Original `/api/chat` endpoint still works
- Old `ChatWindow.jsx` component still functional
- Gradual migration supported

### Migration Steps
1. Update environment variables
2. Install new dependencies
3. Deploy new components
4. Test streaming functionality
5. Monitor performance

## 📞 Support

For technical support:
1. Check this setup guide
2. Review console logs
3. Verify environment variables
4. Test with minimal configuration
5. Contact development team

---

**Note**: This optimized chatbot provides supportive health guidance only. Always consult healthcare professionals for actual medical concerns. The chatbot uses real Google Gemini AI for all responses with enhanced performance and multilingual support.
