'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Users, TestTube } from 'lucide-react';
import VideoCallModal from './video-call-modal';

/**
 * VideoCallTest Component
 * 
 * This is a test component to verify video call functionality
 * without needing to go through the full doctor dashboard flow.
 * 
 * Features:
 * - Quick access to video call modal
 * - Test different user roles
 * - Verify room generation
 * - Test UI responsiveness
 */
export default function VideoCallTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testMode, setTestMode] = useState<'doctor' | 'patient'>('doctor');

  const testConfigs = {
    doctor: {
      name: 'Dr. Sarah Johnson',
      id: 'doctor-test-1',
      role: 'doctor' as const
    },
    patient: {
      name: 'John Doe',
      id: 'patient-test-1',
      role: 'patient' as const
    }
  };

  const currentConfig = testConfigs[testMode];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-blue-600" />
              Video Call Test Interface
            </CardTitle>
            <CardDescription>
              Test the video call functionality with different user roles and configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Test Mode Selection */}
              <div className="flex space-x-4">
                <Button
                  variant={testMode === 'doctor' ? 'default' : 'outline'}
                  onClick={() => setTestMode('doctor')}
                  className="flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Test as Doctor
                </Button>
                <Button
                  variant={testMode === 'patient' ? 'default' : 'outline'}
                  onClick={() => setTestMode('patient')}
                  className="flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Test as Patient
                </Button>
              </div>

              {/* Current Configuration */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Test Configuration:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium w-20">Role:</span>
                    <Badge variant={testMode === 'doctor' ? 'default' : 'secondary'}>
                      {currentConfig.role}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-20">Name:</span>
                    <span>{currentConfig.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-20">ID:</span>
                    <span className="font-mono text-xs">{currentConfig.id}</span>
                  </div>
                </div>
              </div>

              {/* Test Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center"
                  size="lg"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Open Video Call Modal
                </Button>
              </div>

              {/* Test Instructions */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click "Open Video Call Modal" to test the video call interface</li>
                  <li>• Try creating a new room and copying the room code</li>
                  <li>• Test the "Join Room" functionality with a room ID</li>
                  <li>• Verify that the video call interface loads correctly</li>
                  <li>• Test the mute/unmute and video on/off controls</li>
                  <li>• Check responsive design on different screen sizes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Call Modal */}
        <VideoCallModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          doctorName={testConfigs.doctor.name}
          doctorId={testConfigs.doctor.id}
          patientName={testConfigs.patient.name}
          patientId={testConfigs.patient.id}
        />
      </div>
    </div>
  );
}


