# Video Call Implementation

This document describes the video call functionality implemented for the telemedicine app using Agora SDK.

## Features

### ✅ Implemented Features

1. **Video Call Component** (`components/video-call.tsx`)
   - Real-time video and audio communication
   - Mute/unmute controls for audio and video
   - End call functionality
   - Responsive design for desktop and mobile
   - Loading states and error handling
   - Mock implementation for development

2. **Video Call Modal** (`components/video-call-modal.tsx`)
   - Room creation and joining interface
   - Room code sharing functionality
   - Video call initialization
   - Responsive design
   - Error handling and loading states

3. **Video Utilities** (`lib/video-utils.ts`)
   - Room ID generation
   - Room code generation
   - Room validation
   - Call state management
   - Session tracking

4. **Doctor Dashboard Integration**
   - "Start Video Call" button functionality
   - Modal integration
   - User authentication integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install agora-rtc-sdk-ng
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Agora Video SDK Configuration
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id_here
```

### 3. Get Agora App ID

1. Go to [Agora Console](https://console.agora.io/)
2. Create a new project
3. Copy the App ID
4. Add it to your `.env.local` file

### 4. Production Setup

For production, you'll need to:

1. **Replace Mock SDK**: Replace the mock Agora SDK in `video-call.tsx` with the real SDK:
   ```typescript
   import AgoraRTC from 'agora-rtc-sdk-ng';
   ```

2. **Implement Token Server**: Create a token server for secure authentication
3. **Add Error Handling**: Implement proper error handling for network issues
4. **Add Recording**: Implement call recording if needed

## Usage

### For Doctors

1. Click "Start Video Call" on the doctor dashboard
2. Choose to create a new room or join an existing one
3. Share the room code with the patient
4. Start the video consultation

### For Patients

1. Enter the room code provided by the doctor
2. Join the video call
3. Use controls to mute/unmute or turn video on/off

## Components

### VideoCall Component

```typescript
interface VideoCallProps {
  roomId: string;
  userRole: 'doctor' | 'patient';
  onEndCall: () => void;
  doctorName?: string;
  patientName?: string;
}
```

### VideoCallModal Component

```typescript
interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorId: string;
  patientName?: string;
  patientId?: string;
}
```

## Room Management

### Room ID Format
- Format: `room-{timestamp}-{randomString}`
- Example: `room-abc123-def456`

### Room Code Format
- Format: 6-character alphanumeric
- Example: `ABC123`

### Room Validation
- Rooms expire after 24 hours
- Room IDs are validated before joining
- Invalid rooms show appropriate error messages

## Controls

### Video Controls
- **Mute/Unmute**: Toggle microphone on/off
- **Video On/Off**: Toggle camera on/off
- **End Call**: Terminate the video call

### UI Features
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Shows loading indicators during connection
- **Error Handling**: Displays user-friendly error messages
- **Hover Effects**: Smooth transitions and animations

## Development Notes

### Mock Implementation
The current implementation uses a mock Agora SDK for development. This allows you to:
- Test the UI and user flow
- Develop without needing Agora credentials
- Simulate video call behavior

### Production Migration
To migrate to production:

1. Replace mock SDK with real Agora SDK
2. Implement proper token generation
3. Add error handling for network issues
4. Test with real video/audio devices

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access**
   - Ensure browser permissions are granted
   - Check if devices are connected and working

2. **Connection Issues**
   - Verify Agora App ID is correct
   - Check network connectivity
   - Ensure room ID is valid

3. **Audio/Video Not Working**
   - Check browser compatibility
   - Verify device permissions
   - Test with different browsers

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Considerations

1. **Token Authentication**: Implement token-based authentication for production
2. **Room Access Control**: Add proper access control for rooms
3. **Data Privacy**: Ensure video data is not stored or logged
4. **User Verification**: Verify user identities before allowing calls

## Future Enhancements

1. **Screen Sharing**: Add screen sharing functionality
2. **Call Recording**: Implement call recording with user consent
3. **Chat Integration**: Add text chat during video calls
4. **File Sharing**: Allow file sharing during consultations
5. **Call Scheduling**: Integrate with appointment scheduling
6. **Mobile App**: Create mobile app versions
7. **Analytics**: Add call analytics and reporting

## Support

For technical support or questions about the video call implementation, please refer to:
- [Agora Documentation](https://docs.agora.io/)
- [Agora Community](https://www.agora.io/en/community/)
- [Next.js Documentation](https://nextjs.org/docs)


