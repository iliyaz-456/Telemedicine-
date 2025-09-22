'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/ui/back-button';
import { Calendar, Clock, Users, User, Stethoscope, FileText, Video, Brain, Home } from 'lucide-react';
import Link from 'next/link';
import VideoCallModal from '@/components/video-call-modal';

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome back, Dr. {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Stethoscope className="w-5 h-5 mr-1" />
                Doctor
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm" className="shadow-sm hover:shadow">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Video Consultations</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hours Worked</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Video className="w-5 h-5 mr-2 text-blue-600" />
                Start Consultation
              </CardTitle>
              <CardDescription>
                Begin a video consultation with patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setIsVideoCallModalOpen(true)}
              >
                Start Video Call
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Patient Queue
              </CardTitle>
              <CardDescription>
                View patients waiting for consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/dashboard/doctor/patient-queue')}
              >
                View Queue
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Medical Records
              </CardTitle>
              <CardDescription>
                Access patient medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/dashboard/doctor/medical-records')}
              >
                View Records
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-gray-600">Routine Checkup</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">10:00 AM</p>
                    <Badge variant="outline" className="text-xs">Scheduled</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-sm text-gray-600">Follow-up</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">11:30 AM</p>
                    <Badge variant="outline" className="text-xs">Scheduled</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Amit Patel</p>
                    <p className="text-sm text-gray-600">Consultation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">2:00 PM</p>
                    <Badge variant="default" className="text-xs bg-green-600">In Progress</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Specialization</span>
                  <span className="text-sm">{user?.specialization || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">License Number</span>
                  <span className="text-sm">{user?.licenseNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Experience</span>
                  <span className="text-sm">{user?.experience ? `${user.experience} years` : 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Phone</span>
                  <span className="text-sm">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Address</span>
                  <span className="text-sm text-right">{user?.address || 'Not provided'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Sunita Devi</p>
                    <p className="text-sm text-gray-600">Yesterday, 4:30 PM</p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Vikram Singh</p>
                    <p className="text-sm text-gray-600">Yesterday, 2:15 PM</p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Prescription
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Patient Directory
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary (Coming Soon) */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Summary (Coming Soon)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-dashed rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Submit patient health records here to get a concise summary. Feature coming soon.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button variant="outline" disabled title="Coming soon" className="cursor-not-allowed opacity-60">
                  Generate Summary
                </Button>
                <span className="text-xs text-muted-foreground">This feature is a placeholder and currently disabled.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallModalOpen}
        onClose={() => setIsVideoCallModalOpen(false)}
        doctorName={user?.name || 'Dr. Smith'}
        doctorId={user?._id || 'doctor-1'}
        patientName="Patient"
        patientId="patient-1"
      />
    </div>
  );
}

export default withAuth(DoctorDashboard, ['Doctor']);