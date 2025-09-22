'use client';

import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackButton from '@/components/ui/back-button';
import { Calendar, Clock, Heart, User, Phone, FileText, Pill, Search, MapPin, Home } from 'lucide-react';
import Link from 'next/link';

function PatientDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <User className="w-5 h-5 mr-1" />
                Patient
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
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Book Appointment
              </CardTitle>
              <CardDescription>
                Schedule a consultation with a doctor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/book">Book Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-2 text-green-600" />
                Teleconsultation
              </CardTitle>
              <CardDescription>
                Connect with ASHA workers for immediate help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Connect Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Medical Records
              </CardTitle>
              <CardDescription>
                View your health records and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/medical-records">View Records</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Medicine Tracker
              </CardTitle>
              <CardDescription>
                Search medicines and check availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/medicine-tracker">Track Medicines</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center text-gray-500 py-8">
                  No upcoming appointments
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Age</span>
                  <span className="text-sm">{user?.age || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gender</span>
                  <span className="text-sm">{user?.gender || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Phone</span>
                  <span className="text-sm">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Medical History</span>
                  <span className="text-sm text-right">
                    {user?.medicalHistory?.length ? 
                      user.medicalHistory.join(', ') : 
                      'No history recorded'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                No recent activity
              </div>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Health Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💧 Stay hydrated - drink at least 8 glasses of water daily
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    🚶‍♂️ Take a 30-minute walk daily for better cardiovascular health
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    😴 Ensure 7-9 hours of quality sleep each night
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default withAuth(PatientDashboard, ['Patient']);