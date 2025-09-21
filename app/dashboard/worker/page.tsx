'use client';

import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Users, User, Heart, FileText, Video, AlertCircle, Pill, Activity } from 'lucide-react';
import Link from 'next/link';

function WorkerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ASHA Worker Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Heart className="w-4 h-4 mr-1" />
                Healthcare Worker
              </Badge>
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
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patients Assisted Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Calls Made</p>
                  <p className="text-2xl font-bold">24</p>
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
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Emergency Cases</p>
                  <p className="text-2xl font-bold">2</p>
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
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Patient Call
              </CardTitle>
              <CardDescription>
                Make a call to assist patients in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Call</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Video className="w-5 h-5 mr-2 text-green-600" />
                Doctor Connect
              </CardTitle>
              <CardDescription>
                Connect patient with doctor via video call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Connect to Doctor</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Health Records
              </CardTitle>
              <CardDescription>
                Update and manage patient health records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/worker/health-records">Manage Records</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Medicine Management
              </CardTitle>
              <CardDescription>
                Manage patient medicine requests and track availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/worker/medicine-management">Manage Medicines</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Disease Updates
              </CardTitle>
              <CardDescription>
                Monitor disease outbreaks and notify villages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/worker/disease-updates">View Updates</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Village Health Survey</p>
                    <p className="text-sm text-gray-600">Complete health checkups</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-700">Pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Medicine Distribution</p>
                    <p className="text-sm text-gray-600">Distribute prescribed medicines</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Maternal Health Check</p>
                    <p className="text-sm text-gray-600">Check on expecting mothers</p>
                  </div>
                  <Badge variant="outline" className="text-blue-700 border-blue-700">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Worker Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Worker Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Worker ID</span>
                  <span className="text-sm">{user?.workerId || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Work Location</span>
                  <span className="text-sm">{user?.location || 'Not provided'}</span>
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

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Called Sunita Devi</p>
                    <p className="text-xs text-gray-600">Helped with doctor consultation - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Video className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Video consultation with Dr. Sharma</p>
                    <p className="text-xs text-gray-600">Connected patient Rajesh Kumar - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated health records</p>
                    <p className="text-xs text-gray-600">Added vaccination records for 5 children - 6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">District Hospital</p>
                    <p className="text-sm text-gray-600">Emergency Services</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Call
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Ambulance Service</p>
                    <p className="text-sm text-gray-600">Emergency Transport</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Call
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Dr. Arun Kumar</p>
                    <p className="text-sm text-gray-600">On-call Doctor</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default withAuth(WorkerDashboard, ['Worker']);