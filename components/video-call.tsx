'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Agora SDK types (simplified for this implementation)
interface AgoraRTC {
  createClient: (config: any) => any;
  createMicrophoneAndCameraTracks: () => Promise<any[]>;
  Client: any;
}

// Mock Agora SDK for development (replace with actual SDK in production)
const createMockAgoraSDK = () => {
  return {
    createClient: (config: any) => ({
      join: async (appId: string, channel: string, token: string | null, uid: string | null) => {
        console.log('Mock: Joining channel', { appId, channel, token, uid });
        return Promise.resolve();
      },
      leave: async () => {
        console.log('Mock: Leaving channel');
        return Promise.resolve();
      },
      publish: async (tracks: any[]) => {
        console.log('Mock: Publishing tracks', tracks);
        return Promise.resolve();
      },
      unpublish: async (tracks: any[]) => {
        console.log('Mock: Unpublishing tracks', tracks);
        return Promise.resolve();
      },
      on: (event: string, callback: Function) => {
        console.log('Mock: Event listener added', event);
        // Simulate user joined event after 2 seconds
        if (event === 'user-published') {
          setTimeout(() => {
            callback('mock-user', { audioTrack: true, videoTrack: true });
          }, 2000);
        }
      },
      off: (event: string, callback: Function) => {
        console.log('Mock: Event listener removed', event);
      }
    }),
    createMicrophoneAndCameraTracks: () => {
      console.log('Mock: Creating microphone and camera tracks');
      return Promise.resolve([
        { 
          close: () => console.log('Mock: Audio track closed'),
          setEnabled: (enabled: boolean) => console.log('Mock: Audio track enabled:', enabled)
        },
        { 
          close: () => console.log('Mock: Video track closed'),
          setEnabled: (enabled: boolean) => console.log('Mock: Video track enabled:', enabled)
        }
      ]);
    }
  };
};

interface VideoCallProps {
  roomId: string;
  userRole: 'doctor' | 'patient';
  onEndCall: () => void;
  doctorName?: string;
  patientName?: string;
}

/**
 * VideoCall Component
 * 
 * Features:
 * - Real-time video and audio communication using Agora SDK
 * - Mute/unmute controls for audio and video
 * - End call functionality
 * - Responsive design for desktop and mobile
 * - Loading states and error handling
 * - Mock implementation for development
 */
export default function VideoCall({ 
  roomId, 
  userRole, 
  onEndCall, 
  doctorName = 'Dr. Smith', 
  patientName = 'Patient' 
}: VideoCallProps) {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState(1); // Start with 1 (current user)
  
  // Refs for video elements and Agora client
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<any>(null);
  const localTracksRef = useRef<any[]>([]);

  // Agora configuration
  const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || 'mock-app-id';
  const CHANNEL = roomId;
  const TOKEN = null; // For development, use null. In production, generate token from server

  /**
   * Initialize Agora client and join channel
   */
  useEffect(() => {
    const initializeCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, import actual Agora SDK
        // import AgoraRTC from 'agora-rtc-sdk-ng';
        const AgoraRTC = createMockAgoraSDK();

        // Create Agora client
        const client = AgoraRTC.createClient({ 
          mode: 'rtc', 
          codec: 'vp8' 
        });
        clientRef.current = client;

        // Create local tracks (microphone and camera)
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = [audioTrack, videoTrack];

        // Set up local video element
        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

        // Set up event listeners
        client.on('user-published', async (user: any, mediaType: string) => {
          console.log('User published:', user, mediaType);
          setParticipants(prev => prev + 1);
          
          // In a real implementation, you would subscribe to the remote user's tracks
          // For mock, we'll just show a placeholder
          if (remoteVideoRef.current) {
            remoteVideoRef.current.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
            remoteVideoRef.current.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; font-size: 18px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  👤
                </div>
                <div>${userRole === 'doctor' ? patientName : doctorName}</div>
                <div style="font-size: 14px; opacity: 0.8;">Connected</div>
              </div>
            `;
          }
        });

        client.on('user-unpublished', (user: any) => {
          console.log('User unpublished:', user);
          setParticipants(prev => Math.max(1, prev - 1));
        });

        // Join the channel
        await client.join(APP_ID, CHANNEL, TOKEN, null);
        
        // Publish local tracks
        await client.publish(localTracksRef.current);
        
        setIsConnected(true);
        setIsLoading(false);
        
        console.log('Successfully joined channel:', CHANNEL);
      } catch (err) {
        console.error('Error initializing call:', err);
        setError('Failed to initialize video call. Please try again.');
        setIsLoading(false);
      }
    };

    initializeCall();

    // Cleanup function
    return () => {
      if (clientRef.current) {
        clientRef.current.leave();
      }
      localTracksRef.current.forEach(track => track.close());
    };
  }, [roomId, userRole, doctorName, patientName]);

  /**
   * Toggle microphone mute/unmute
   */
  const toggleMute = () => {
    if (localTracksRef.current[0]) {
      const newMutedState = !isMuted;
      localTracksRef.current[0].setEnabled(!newMutedState);
      setIsMuted(newMutedState);
    }
  };

  /**
   * Toggle video on/off
   */
  const toggleVideo = () => {
    if (localTracksRef.current[1]) {
      const newVideoState = !isVideoOff;
      localTracksRef.current[1].setEnabled(!newVideoState);
      setIsVideoOff(newVideoState);
    }
  };

  /**
   * End the call
   */
  const endCall = async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.leave();
      }
      localTracksRef.current.forEach(track => track.close());
      onEndCall();
    } catch (err) {
      console.error('Error ending call:', err);
      onEndCall(); // Still call onEndCall to close the modal
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Initializing Video Call</h3>
            <p className="text-gray-600">Setting up your consultation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onEndCall} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {userRole === 'doctor' ? `Consultation with ${patientName}` : `Consultation with ${doctorName}`}
            </h2>
            <p className="text-sm text-gray-600">Room: {roomId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {participants} participant{participants > 1 ? 's' : ''}
          </Badge>
          <Badge className={`flex items-center ${isConnected ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            {isConnected ? 'Connected' : 'Connecting...'}
          </Badge>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-gray-800 p-4">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Local Video (Doctor/Patient) */}
          <div className="relative bg-gray-700 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {userRole === 'doctor' ? doctorName : patientName} (You)
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-12 h-12 mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              </div>
            )}
          </div>

          {/* Remote Video (Patient/Doctor) */}
          <div className="relative bg-gray-700 rounded-lg overflow-hidden">
            <div
              ref={remoteVideoRef}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-center text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <p>Waiting for participant...</p>
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {userRole === 'doctor' ? patientName : doctorName}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white px-4 py-4 flex items-center justify-center space-x-4">
        <Button
          onClick={toggleMute}
          variant={isMuted ? "destructive" : "outline"}
          size="lg"
          className="rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        <Button
          onClick={toggleVideo}
          variant={isVideoOff ? "destructive" : "outline"}
          size="lg"
          className="rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>

        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
