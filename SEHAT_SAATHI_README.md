# Sehat Saathi - Health Advisor Chatbot

A comprehensive, multilingual health advisor chatbot prototype for the TelemediConnect telemedicine application. This is a fully functional, frontend-heavy prototype with backend integration for Gemini AI.

## 🚀 Features

### Core Functionality
- **Floating Chat Widget**: Always accessible on every page
- **Multilingual Support**: English, Hindi, Telugu with auto-detection
- **Voice Input**: Web Speech API integration with fallback
- **Draggable Interface**: Move chat window anywhere on screen
- **Real-time Chat**: Smooth animations and responsive design
- **Health Advisor**: Professional, non-diagnostic health guidance
- **Doctor Mapping**: Intelligent doctor recommendations based on symptoms

### Technical Features
- **Gemini AI Integration**: Real AI responses with fallback to mock data
- **Responsive Design**: Works on mobile and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Voice-to-Text**: Browser Web Speech API
- **Language Detection**: Automatic language identification
- **Translation**: Built-in translation system
- **Modular Architecture**: Reusable components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Voice**: Web Speech API
- **AI**: Google Gemini API
- **Backend**: Next.js API Routes

## 📦 Installation

1. **Clone and Navigate**:
   ```bash
   cd Telemedicine-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables** (Optional):
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   **Note**: The system works with mock responses if no API key is provided.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Navigate to `http://localhost:3000`

## 🎯 How to Use

### Basic Usage
1. **Access Chat**: Click the floating blue-green button in the bottom-right corner
2. **Type Message**: Enter your health concern in the text area
3. **Voice Input**: Click the microphone icon for voice input
4. **Language Selection**: Choose from Auto-detect, English, Hindi, or Telugu
5. **Get Response**: Receive health guidance and doctor recommendations

### Advanced Features
- **Drag Chat Window**: Click and drag the header to reposition
- **Minimize/Maximize**: Use the minimize button to collapse the chat
- **Voice Commands**: Speak naturally in your preferred language
- **Doctor Recommendations**: Get specific doctor suggestions based on symptoms

## 🏥 Health Advisor Capabilities

### Supported Symptoms & Doctor Mapping
- **Fever** → Dr. Meena (General Physician)
- **Chest Pain** → Dr. Sharma (Cardiologist)
- **Skin Issues** → Dr. Raj (Dermatologist)
- **Child Health** → Dr. Priya (Pediatrician)
- **Bone/Joint Pain** → Dr. Kumar (Orthopedist)
- **Stomach Issues** → Dr. Meena (General Physician)
- **Headaches** → Dr. Meena (General Physician)

### Response Guidelines
- ✅ Supportive health guidance
- ✅ General wellness tips
- ✅ Doctor recommendations
- ✅ Symptom monitoring advice
- ❌ Medical diagnoses
- ❌ Medication prescriptions
- ❌ Treatment recommendations

## 🌐 Multilingual Support

### Supported Languages
- **English**: Default language
- **Hindi**: हिंदी support with translation
- **Telugu**: తెలుగు support with translation
- **Auto-detect**: Automatic language detection

### Translation Features
- Automatic language detection
- Real-time translation
- Context-aware responses
- Fallback to English if translation fails

## 🎤 Voice Input

### Browser Support
- **Chrome**: Full support
- **Edge**: Full support
- **Safari**: Limited support
- **Firefox**: Limited support

### Voice Features
- Real-time speech recognition
- Language-specific recognition
- Visual feedback during recording
- Error handling and fallbacks

## 🏗️ Architecture

### Component Structure
```
components/chat/
├── ChatWidget.tsx          # Main floating button
├── ChatWindow.tsx          # Chat interface
├── MessageBubble.tsx       # Individual messages
└── VoiceRecorder.tsx       # Voice input component

hooks/
└── useChat.ts              # Chat logic hook

app/api/chat/
└── route.ts                # Backend API endpoint
```

### Data Flow
1. User input (text/voice) → ChatWindow
2. Message processing → useChat hook
3. API call → /api/chat route
4. Gemini AI processing → Response generation
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

## 🚨 Important Notes

### Health Disclaimer
- This is a **prototype** for demonstration purposes
- **Not a substitute** for professional medical advice
- Always consult healthcare professionals for medical concerns
- Responses are **non-diagnostic** and **supportive only**

### Browser Compatibility
- **Web Speech API**: Chrome/Edge recommended
- **Modern browsers**: Required for full functionality
- **Mobile**: Responsive design works on all devices
- **Fallbacks**: Graceful degradation for unsupported features

## 🐛 Troubleshooting

### Common Issues

1. **Voice Input Not Working**:
   - Check browser permissions for microphone
   - Ensure HTTPS connection (required for Web Speech API)
   - Try refreshing the page

2. **Chat Not Loading**:
   - Check console for errors
   - Verify all dependencies are installed
   - Ensure Next.js server is running

3. **API Errors**:
   - Check Gemini API key configuration
   - Verify network connectivity
   - Check API rate limits

4. **Translation Issues**:
   - Fallback to English if translation fails
   - Check language detection accuracy
   - Verify translation mappings

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🔮 Future Enhancements

### Planned Features
- **More Languages**: Bengali, Tamil, Marathi support
- **Advanced AI**: Better context understanding
- **Integration**: Connect with actual doctor booking
- **Analytics**: Usage tracking and insights
- **Offline Mode**: Cached responses for offline use

### Technical Improvements
- **Performance**: Optimize bundle size
- **Accessibility**: WCAG compliance
- **Testing**: Unit and integration tests
- **Monitoring**: Error tracking and analytics

## 📄 License

This project is part of the TelemediConnect telemedicine application prototype.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review the code comments
- Test with mock data first
- Verify browser compatibility

---

**Remember**: This is a prototype for demonstration purposes. Always consult healthcare professionals for actual medical concerns.
