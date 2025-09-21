'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Download,
  Eye,
  Heart,
  AlertCircle,
  Clock
} from 'lucide-react';

// Mock data for registered patients by ASHA worker
// In a real app, this would come from an API with proper access control
const mockRegisteredPatients = [
  {
    id: 'patient1',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    phone: '+91-9876543210',
    email: 'john@example.com',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: ['Diabetes', 'Hypertension'],
    registeredBy: 'worker1', // ASHA worker ID
    registeredAt: '2024-01-15',
    lastVisit: '2024-02-10',
    status: 'Active'
  },
  {
    id: 'patient2',
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    phone: '+91-9876543211',
    email: 'jane@example.com',
    bloodType: 'A+',
    allergies: ['Dust', 'Pollen'],
    medicalHistory: ['Asthma'],
    registeredBy: 'worker1',
    registeredAt: '2024-01-20',
    lastVisit: '2024-02-05',
    status: 'Active'
  },
  {
    id: 'patient3',
    name: 'Mike Johnson',
    age: 45,
    gender: 'Male',
    phone: '+91-9876543212',
    email: 'mike@example.com',
    bloodType: 'B+',
    allergies: [],
    medicalHistory: ['Heart Disease', 'High Cholesterol'],
    registeredBy: 'worker1',
    registeredAt: '2024-01-25',
    lastVisit: '2024-02-08',
    status: 'Active'
  },
  {
    id: 'patient4',
    name: 'Sarah Wilson',
    age: 32,
    gender: 'Female',
    phone: '+91-9876543213',
    email: 'sarah@example.com',
    bloodType: 'AB+',
    allergies: ['Latex'],
    medicalHistory: ['Thyroid'],
    registeredBy: 'worker1',
    registeredAt: '2024-02-01',
    lastVisit: '2024-02-12',
    status: 'Active'
  }
];

// Mock health records data for each patient
const mockHealthRecords = {
  'patient1': {
    diagnoses: [
      {
        id: 1,
        condition: 'Type 2 Diabetes',
        date: '2024-01-15',
        doctor: 'Dr. Sarah Johnson',
        status: 'Active',
        severity: 'Moderate',
        description: 'Diabetes mellitus type 2, well-controlled with medication',
        symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue']
      },
      {
        id: 2,
        condition: 'Hypertension',
        date: '2024-01-20',
        doctor: 'Dr. Michael Chen',
        status: 'Active',
        severity: 'Mild',
        description: 'High blood pressure requiring ongoing medication management',
        symptoms: ['Headaches', 'Dizziness']
      }
    ],
    prescriptions: [
      {
        id: 1,
        medication: 'Metformin 500mg',
        dosage: 'Twice daily',
        startDate: '2024-01-15',
        endDate: 'Ongoing',
        doctor: 'Dr. Sarah Johnson',
        condition: 'Type 2 Diabetes',
        status: 'Active',
        instructions: 'Take with meals, check blood sugar levels'
      },
      {
        id: 2,
        medication: 'Lisinopril 10mg',
        dosage: 'Once daily',
        startDate: '2024-01-20',
        endDate: 'Ongoing',
        doctor: 'Dr. Michael Chen',
        condition: 'Hypertension',
        status: 'Active',
        instructions: 'Take with food, monitor blood pressure regularly'
      }
    ],
    labResults: [
      {
        id: 1,
        testName: 'HbA1c',
        date: '2024-02-01',
        doctor: 'Dr. Sarah Johnson',
        status: 'Good',
        results: {
          'HbA1c': '6.8%',
          'Average Glucose': '154 mg/dL'
        },
        notes: 'Diabetes well-controlled, continue current treatment'
      },
      {
        id: 2,
        testName: 'Lipid Panel',
        date: '2024-02-01',
        doctor: 'Dr. Michael Chen',
        status: 'Normal',
        results: {
          'Total Cholesterol': '180 mg/dL',
          'LDL Cholesterol': '110 mg/dL',
          'HDL Cholesterol': '45 mg/dL',
          'Triglycerides': '125 mg/dL'
        },
        notes: 'All values within normal range'
      }
    ],
    visitHistory: [
      {
        id: 1,
        date: '2024-02-10',
        doctor: 'Dr. Sarah Johnson',
        specialty: 'Endocrinology',
        type: 'Follow-up',
        reason: 'Diabetes management',
        diagnosis: 'Type 2 Diabetes - well controlled',
        treatment: 'Continue Metformin',
        nextAppointment: '2024-03-10'
      },
      {
        id: 2,
        date: '2024-02-08',
        doctor: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        type: 'Follow-up',
        reason: 'Blood pressure check',
        diagnosis: 'Hypertension - stable',
        treatment: 'Continue Lisinopril',
        nextAppointment: '2024-03-08'
      }
    ]
  },
  // Similar structure for other patients...
  'patient2': {
    diagnoses: [
      {
        id: 3,
        condition: 'Asthma',
        date: '2024-01-20',
        doctor: 'Dr. Priya Sharma',
        status: 'Active',
        severity: 'Mild',
        description: 'Allergic asthma, well-controlled with inhaler',
        symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness']
      }
    ],
    prescriptions: [
      {
        id: 3,
        medication: 'Albuterol Inhaler',
        dosage: 'As needed',
        startDate: '2024-01-20',
        endDate: 'Ongoing',
        doctor: 'Dr. Priya Sharma',
        condition: 'Asthma',
        status: 'Active',
        instructions: 'Use during asthma attacks or before exercise'
      }
    ],
    labResults: [],
    visitHistory: [
      {
        id: 3,
        date: '2024-02-05',
        doctor: 'Dr. Priya Sharma',
        specialty: 'Pulmonology',
        type: 'Follow-up',
        reason: 'Asthma check-up',
        diagnosis: 'Asthma - well controlled',
        treatment: 'Continue inhaler as needed',
        nextAppointment: '2024-03-05'
      }
    ]
  }
};

function HealthRecordsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState(mockRegisteredPatients);
  const [filteredPatients, setFilteredPatients] = useState(mockRegisteredPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Get status badge for patient
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center"><Heart className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="flex items-center"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/worker" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Patient Health Records</h1>
                <p className="text-gray-600 mt-1">Manage health records of your registered patients</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                ASHA Worker
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className={`mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Search Registered Patients
              </CardTitle>
              <CardDescription>
                Search by patient name, phone number, or email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => p.status === 'Active').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Search Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredPatients.length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Cards */}
        <div className={`transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Registered Patients ({filteredPatients.length})
              </CardTitle>
              <CardDescription>
                Click "View Health Record" to see detailed health information for each patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'No patients have been registered yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient, index) => (
                    <Card 
                      key={patient.id} 
                      className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{patient.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {patient.age} years, {patient.gender}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(patient.status)}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Contact Information */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {patient.email}
                          </div>
                        </div>

                        {/* Medical Summary */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Blood Type:</span>
                              <p className="text-gray-900">{patient.bloodType}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Allergies:</span>
                              <p className="text-gray-900">
                                {patient.allergies.length > 0 ? patient.allergies.length : 'None'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium text-gray-600">Medical History:</span>
                            <p className="text-gray-900 text-sm">
                              {patient.medicalHistory.length > 0 ? patient.medicalHistory.join(', ') : 'None recorded'}
                            </p>
                          </div>
                        </div>

                        {/* Registration Info */}
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Registered: {formatDate(patient.registeredAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Last Visit: {formatDate(patient.lastVisit)}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Link href={`/dashboard/worker/health-records/${patient.id}`} className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            View Health Record
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Export the component with authentication wrapper
export default withAuth(HealthRecordsPage, ['Worker']);
