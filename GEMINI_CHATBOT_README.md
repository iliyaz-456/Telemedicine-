# Sehat Saathi - Health Advisor Chatbot

A real, working health advisor chatbot integrated with **Google Gemini API** for your Next.js telemedicine application. This chatbot provides live, AI-generated responses with multilingual support and voice input capabilities.

## 🚀 Features

### Core Functionality
- **Real Gemini AI Integration**: Live responses from Google Gemini API (no mock data)
- **Multilingual Support**: English, Hindi, Telugu with automatic language detection
- **Voice Input**: Web Speech API for hands-free interaction
- **Draggable Interface**: Move chat window anywhere on screen
- **Responsive Design**: Works perfectly on mobile and desktop
- **Health Advisor**: Professional, non-diagnostic health guidance
- **Doctor Recommendations**: Smart doctor category suggestions

### Technical Features
- **Gemini 1.5 Flash Model**: Fast, accurate AI responses
- **Real-time Chat**: Live conversation with AI
- **Error Handling**: Graceful fallbacks and error recovery
- **Smooth Animations**: Framer Motion powered transitions
- **Modular Architecture**: Clean, reusable components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, JavaScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini API (@google/generative-ai)
- **Voice**: Web Speech API
- **Backend**: Next.js API Routes

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
# Navigate to your project directory
cd Telemedicine-

# Install required packages
npm install @google/generative-ai framer-motion
```

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

### 3. Run the Application

```bash
# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

## 🎯 How to Use

### Basic Usage
1. **Access Chat**: Click the floating blue-green button in the bottom-right corner
2. **Type Message**: Enter your health concern in the text area
3. **Voice Input**: Click the microphone icon for voice input
4. **Language Selection**: Choose from Auto-detect, English, Hindi, or Telugu
5. **Get AI Response**: Receive live health guidance from Gemini AI

### Advanced Features
- **Drag Chat Window**: Click and drag the header to reposition
- **Minimize/Maximize**: Use the minimize button to collapse the chat
- **Voice Commands**: Speak naturally in your preferred language
- **Doctor Recommendations**: Get specific doctor suggestions based on symptoms

## 🏥 Health Advisor Capabilities

### What the Chatbot Does
- ✅ Provides supportive health guidance
- ✅ Offers general wellness tips
- ✅ Suggests appropriate doctor categories
- ✅ Helps with app navigation
- ✅ Responds in multiple languages
- ✅ Gives preventive health advice

### What the Chatbot Doesn't Do
- ❌ Provide medical diagnoses
- ❌ Prescribe medications
- ❌ Replace professional medical advice
- ❌ Give treatment recommendations

### Doctor Category Mapping
- **Fever/General Symptoms** → General Physician
- **Chest Pain/Heart Issues** → Cardiologist
- **Skin Problems** → Dermatologist
- **Child Health** → Pediatrician
- **Bone/Joint Pain** → Orthopedist
- **Stomach Issues** → General Physician

## 🌐 Multilingual Support

### Supported Languages
- **English**: Default language with full support
- **Hindi**: हिंदी support with native responses
- **Telugu**: తెలుగు support with native responses
- **Auto-detect**: Automatic language detection

### How It Works
1. **Language Detection**: Automatically detects user's language
2. **Gemini Processing**: Sends language-specific prompts to Gemini
3. **Native Responses**: Gemini responds in the same language
4. **Context Awareness**: Maintains conversation context across languages

## 🎤 Voice Input

### Browser Support
- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Safari**: Limited support
- **Firefox**: Limited support

### Voice Features
- Real-time speech recognition
- Language-specific recognition
- Visual feedback during recording
- Error handling and fallbacks
- Hands-free interaction

## 🏗️ Architecture

### File Structure
```
Telemedicine-/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Backend API with Gemini integration
│   └── layout.tsx                # Global integration
├── components/
│   ├── ChatWidget.jsx            # Main floating button
│   ├── ChatWindow.jsx            # Chat interface
│   ├── MessageBubble.jsx         # Individual messages
│   └── VoiceRecorder.jsx         # Voice input component
├── hooks/
│   └── useChat.js                # Chat logic hook
└── .env.local                    # Environment variables
```

### Component Hierarchy
```
ChatWidget (Global)
├── ChatWindow
│   ├── MessageBubble (for each message)
│   ├── VoiceRecorder (when voice mode active)
│   └── useChat hook (state management)
```

### Data Flow
1. User input (text/voice) → ChatWindow
2. Message processing → useChat hook
3. API call → /api/chat route
4. Gemini AI processing → Live response generation
5. UI update → MessageBubble rendering

## 🔧 Configuration

### Environment Variables
```env
# Required for Gemini AI integration
GEMINI_API_KEY=your_api_key_here
```

### Customization Options
- **Doctor Mapping**: Modify `DOCTOR_MAPPING` in `/app/api/chat/route.ts`
- **Languages**: Add new languages in `LANGUAGE_KEYWORDS`
- **Styling**: Update Tailwind classes in components
- **Animations**: Modify Framer Motion configurations
- **System Prompts**: Customize AI behavior in `getSystemPrompt()`

## 🚨 Important Notes

### Health Disclaimer
- This is a **health advisor chatbot** for supportive guidance only
- **Not a substitute** for professional medical advice
- Always consult healthcare professionals for medical concerns
- Responses are **non-diagnostic** and **supportive only**

### API Usage
- **Real Gemini API**: All responses are generated by Google Gemini AI
- **No Mock Data**: The chatbot always fetches live responses
- **Rate Limits**: Be aware of Gemini API rate limits
- **Costs**: Monitor your Gemini API usage and costs

### Browser Compatibility
- **Web Speech API**: Chrome/Edge recommended for voice input
- **Modern browsers**: Required for full functionality
- **HTTPS**: Required for Web Speech API in production
- **Fallbacks**: Graceful degradation for unsupported features

## 🐛 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found" Error**:
   - Check your `.env.local` file exists
   - Verify the API key is correct
   - Restart your development server

2. **Voice Input Not Working**:
   - Check browser permissions for microphone
   - Ensure HTTPS connection (required for Web Speech API)
   - Try refreshing the page
   - Use Chrome or Edge for best results

3. **Chat Not Loading**:
   - Check console for errors
   - Verify all dependencies are installed
   - Ensure Next.js server is running
   - Check network connectivity

4. **API Errors**:
   - Verify Gemini API key is valid
   - Check API rate limits
   - Monitor network connectivity
   - Check console for detailed error messages

5. **Translation Issues**:
   - Gemini handles multilingual responses automatically
   - Check if the language is supported
   - Verify the API key has proper permissions

### Debug Mode
Enable debug logging by checking the browser console for detailed error messages.

## 🔮 Future Enhancements

### Planned Features
- **More Languages**: Bengali, Tamil, Marathi support
- **Advanced Context**: Better conversation memory
- **Integration**: Connect with actual doctor booking system
- **Analytics**: Usage tracking and insights
- **Offline Mode**: Cached responses for offline use

### Technical Improvements
- **Performance**: Optimize bundle size and API calls
- **Accessibility**: WCAG compliance improvements
- **Testing**: Unit and integration tests
- **Monitoring**: Error tracking and analytics
- **Security**: Enhanced API key protection

## 📄 API Reference

### POST /api/chat

**Request Body:**
```json
{
  "message": "I have a fever",
  "lang": "english",
  "conversationHistory": [
    {
      "role": "user",
      "message": "Hello"
    },
    {
      "role": "assistant", 
      "message": "Hi! How can I help you today?"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "I understand you're experiencing fever. Here are some supportive measures...",
  "doctorSuggestion": {
    "name": "Dr. Meena",
    "category": "General Physician",
    "reason": "Fever and general symptoms"
  },
  "detectedLanguage": "english"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with real Gemini API
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review the code comments
- Test with a valid Gemini API key
- Verify browser compatibility

## 📝 License

This project is part of the TelemediConnect telemedicine application.

---

**Remember**: This chatbot provides supportive health guidance only. Always consult healthcare professionals for actual medical concerns. The chatbot uses real Google Gemini AI for all responses - no mock data is used.
