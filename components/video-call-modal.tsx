'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  Copy, 
  Check, 
  X, 
  Clock,
  User,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { generateRoomId, generateRoomCode, isValidRoomId } from '@/lib/video-utils';
import VideoCall from './video-call';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorId: string;
  patientName?: string;
  patientId?: string;
}

/**
 * VideoCallModal Component
 * 
 * Features:
 * - Room creation and joining interface
 * - Room code sharing functionality
 * - Video call initialization
 * - Responsive design for desktop and mobile
 * - Error handling and loading states
 */
export default function VideoCallModal({ 
  isOpen, 
  onClose, 
  doctorName, 
  doctorId, 
  patientName = 'Patient',
  patientId 
}: VideoCallModalProps) {
  // State management
  const [roomId, setRoomId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'create' | 'join'>('create');

  // Generate room ID and code when modal opens
  useEffect(() => {
    if (isOpen && !roomId) {
      const newRoomId = generateRoomId();
      const newRoomCode = generateRoomCode();
      setRoomId(newRoomId);
      setRoomCode(newRoomCode);
    }
  }, [isOpen, roomId]);

  /**
   * Create a new video call room
   */
  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true);
      setError('');
      
      // Simulate room creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsInCall(true);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  /**
   * Join an existing video call room
   */
  const handleJoinRoom = async () => {
    try {
      setIsJoiningRoom(true);
      setError('');
      
      // Validate room ID format
      if (!isValidRoomId(joinRoomId)) {
        setError('Invalid room ID format. Please check and try again.');
        return;
      }
      
      // Simulate joining room delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRoomId(joinRoomId);
      setIsInCall(true);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room. Please try again.');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  /**
   * Copy room code to clipboard
   */
  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  /**
   * Copy room ID to clipboard
   */
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  /**
   * End the video call
   */
  const handleEndCall = () => {
    setIsInCall(false);
    setRoomId('');
    setRoomCode('');
    setJoinRoomId('');
    setError('');
    onClose();
  };

  /**
   * Reset modal state when closed
   */
  useEffect(() => {
    if (!isOpen) {
      setIsInCall(false);
      setRoomId('');
      setRoomCode('');
      setJoinRoomId('');
      setError('');
      setMode('create');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Show video call interface when in call
  if (isInCall) {
    return (
      <VideoCall
        roomId={roomId}
        userRole="doctor"
        onEndCall={handleEndCall}
        doctorName={doctorName}
        patientName={patientName}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Video className="w-5 h-5 mr-2 text-blue-600" />
              Video Consultation
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Start or join a video consultation with your patient
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={mode === 'create' ? 'default' : 'outline'}
              onClick={() => setMode('create')}
              className="flex-1"
            >
              Create Room
            </Button>
            <Button
              variant={mode === 'join' ? 'default' : 'outline'}
              onClick={() => setMode('join')}
              className="flex-1"
            >
              Join Room
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Create Room Mode */}
          {mode === 'create' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Create New Consultation</h3>
                <p className="text-sm text-gray-600">
                  Create a new video consultation room and share the details with your patient.
                </p>
              </div>

              {/* Room Details */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="roomCode" className="text-sm font-medium">
                    Room Code (Share this with patient)
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="roomCode"
                      value={roomCode}
                      readOnly
                      className="font-mono text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyRoomCode}
                      className="px-3"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="roomId" className="text-sm font-medium">
                    Room ID (Technical)
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="roomId"
                      value={roomId}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyRoomId}
                      className="px-3"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Doctor:</span>
                  <span className="text-sm text-blue-700">{doctorName}</span>
                </div>
              </div>

              <Button
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
                className="w-full"
                size="lg"
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Start Consultation
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Join Room Mode */}
          {mode === 'join' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Join Existing Room</h3>
                <p className="text-sm text-gray-600">
                  Enter the room ID to join an existing video consultation.
                </p>
              </div>

              <div>
                <Label htmlFor="joinRoomId" className="text-sm font-medium">
                  Room ID
                </Label>
                <Input
                  id="joinRoomId"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Enter room ID (e.g., room-abc123-def456)"
                  className="mt-1 font-mono"
                />
              </div>

              <Button
                onClick={handleJoinRoom}
                disabled={isJoiningRoom || !joinRoomId.trim()}
                className="w-full"
                size="lg"
              >
                {isJoiningRoom ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining Room...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Join Room
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Ensure your camera and microphone are working</p>
            <p>• Share the room code with your patient</p>
            <p>• The room will be active for 24 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
