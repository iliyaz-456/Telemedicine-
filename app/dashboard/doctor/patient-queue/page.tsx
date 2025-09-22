'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/ui/back-button';
import { 
  Users, 
  Video, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import VideoCallModal from '@/components/video-call-modal';
import { useQueue } from '@/hooks/useQueue';

// Types for patient queue
interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: 'Ready' | 'Waiting' | 'In Consultation';
  appointmentTime: string;
  phone: string;
  email: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  meetingId?: string;
  meetingCode?: string;
}

// Demo patient queue data
const demoPatients: Patient[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    patientId: 'PAT001',
    status: 'Ready',
    appointmentTime: '10:00 AM',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    reason: 'Routine Checkup',
    priority: 'Medium'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    patientId: 'PAT002',
    status: 'Waiting',
    appointmentTime: '10:30 AM',
    phone: '+91 98765 43211',
    email: 'priya.sharma@email.com',
    reason: 'Follow-up Consultation',
    priority: 'High'
  },
  {
    id: '3',
    name: 'Amit Patel',
    patientId: 'PAT003',
    status: 'Waiting',
    appointmentTime: '11:00 AM',
    phone: '+91 98765 43212',
    email: 'amit.patel@email.com',
    reason: 'Chest Pain',
    priority: 'High'
  },
  {
    id: '4',
    name: 'Sunita Devi',
    patientId: 'PAT004',
    status: 'Waiting',
    appointmentTime: '11:30 AM',
    phone: '+91 98765 43213',
    email: 'sunita.devi@email.com',
    reason: 'General Consultation',
    priority: 'Medium'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    patientId: 'PAT005',
    status: 'Waiting',
    appointmentTime: '12:00 PM',
    phone: '+91 98765 43214',
    email: 'vikram.singh@email.com',
    reason: 'Blood Pressure Check',
    priority: 'Low'
  }
];

function PatientQueue() {
  const { user } = useAuth();
  const router = useRouter();
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Use the queue hook for API integration
  const {
    patients,
    isLoading,
    error,
    fetchPatients,
    updatePatientStatus,
    getQueueStats
  } = useQueue(user?._id || 'doctor-1');

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  /**
   * Handle starting a video consultation with a patient
   */
  const handleStartMeeting = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsVideoCallModalOpen(true);
  };

  /**
   * Handle video call modal close
   */
  const handleCloseVideoCall = () => {
    setIsVideoCallModalOpen(false);
    setSelectedPatient(null);
  };

  /**
   * Handle updating patient status
   */
  const handleUpdatePatientStatus = async (patientId: string, status: Patient['status']) => {
    try {
      await updatePatientStatus(patientId, status);
    } catch (error) {
      console.error('Failed to update patient status:', error);
    }
  };

  /**
   * Handle canceling a meeting/consultation
   */
  const handleCancelMeeting = async (patient: Patient) => {
    try {
      // If patient is in consultation, change status back to Ready
      // If patient is ready, change status back to Waiting
      const newStatus = patient.status === 'In Consultation' ? 'Ready' : 'Waiting';
      await updatePatientStatus(patient.patientId, newStatus);
    } catch (error) {
      console.error('Failed to cancel meeting:', error);
    }
  };

  /**
   * Refresh the patient queue
   */
  const handleRefresh = () => {
    fetchPatients();
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'Ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'Waiting':
        return <Badge className="bg-yellow-100 text-yellow-800">Waiting</Badge>;
      case 'In Consultation':
        return <Badge className="bg-blue-100 text-blue-800">In Consultation</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * Get priority badge color
   */
  const getPriorityBadge = (priority: Patient['priority']) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Queue</h1>
                <p className="text-gray-600">Manage your consultation queue</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Queue Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total in Queue</p>
                  <p className="text-2xl font-bold">{getQueueStats().total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold">{getQueueStats().ready}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Waiting</p>
                  <p className="text-2xl font-bold">{getQueueStats().waiting}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Consultation</p>
                  <p className="text-2xl font-bold">{getQueueStats().inConsultation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading queue</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-3 border-red-300 text-red-600 hover:bg-red-100"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Patient Queue List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Patient Queue
            </CardTitle>
            <CardDescription>
              Patients waiting for consultation in order of priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading queue...</h3>
                <p className="text-gray-600">Please wait while we fetch the patient queue.</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
                <p className="text-gray-600">All patients have been attended to.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Queue Number and Patient Info */}
                    <div className="flex items-center space-x-6">
                      {/* Queue Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                          <span className="text-sm text-gray-500">ID: {patient.patientId}</span>
                          {getStatusBadge(patient.status)}
                          {getPriorityBadge(patient.priority)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Appointment: {patient.appointmentTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Reason: </span>
                          <span className="text-sm text-gray-600">{patient.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {patient.status === 'Ready' && (
                        <>
                          <Button
                            onClick={() => handleStartMeeting(patient)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Start Meeting
                          </Button>
                          <Button
                            onClick={() => handleCancelMeeting(patient)}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {patient.status === 'Waiting' && (
                        <Button
                          onClick={() => handleUpdatePatientStatus(patient.patientId, 'Ready')}
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {patient.status === 'In Consultation' && (
                        <>
                          <Button
                            variant="outline"
                            disabled
                            className="border-blue-600 text-blue-600"
                          >
                            In Progress
                          </Button>
                          <Button
                            onClick={() => handleCancelMeeting(patient)}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Video Call Modal */}
      {selectedPatient && (
        <VideoCallModal
          isOpen={isVideoCallModalOpen}
          onClose={handleCloseVideoCall}
          doctorName={user?.name || 'Dr. Smith'}
          doctorId={user?._id || 'doctor-1'}
          patientName={selectedPatient.name}
          patientId={selectedPatient.patientId}
        />
      )}
    </div>
  );
}

export default withAuth(PatientQueue, ['Doctor']);
