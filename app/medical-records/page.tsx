'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackToDashboardButton } from '@/components/ui/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Pill, 
  TestTube, 
  Stethoscope, 
  Download,
  Eye,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  FileDown,
  Table
} from 'lucide-react';

// Mock medical data - in a real app, this would come from an API
const mockMedicalData = {
  patientInfo: {
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: 'Jane Doe - 9876543210'
  },
  diagnoses: [
    {
      id: 1,
      condition: 'Hypertension',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'Active',
      severity: 'Moderate',
      description: 'High blood pressure requiring ongoing medication management',
      symptoms: ['Headaches', 'Dizziness', 'Chest pain']
    },
    {
      id: 2,
      condition: 'Type 2 Diabetes',
      date: '2023-11-20',
      doctor: 'Dr. Michael Chen',
      status: 'Active',
      severity: 'Mild',
      description: 'Diabetes mellitus type 2, well-controlled with medication',
      symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue']
    },
    {
      id: 3,
      condition: 'Acute Bronchitis',
      date: '2024-02-10',
      doctor: 'Dr. Priya Sharma',
      status: 'Resolved',
      severity: 'Mild',
      description: 'Respiratory infection that has been successfully treated',
      symptoms: ['Cough', 'Chest congestion', 'Shortness of breath']
    }
  ],
  prescriptions: [
    {
      id: 1,
      medication: 'Lisinopril 10mg',
      dosage: 'Once daily',
      startDate: '2024-01-15',
      endDate: 'Ongoing',
      doctor: 'Dr. Sarah Johnson',
      condition: 'Hypertension',
      status: 'Active',
      instructions: 'Take with food, monitor blood pressure regularly'
    },
    {
      id: 2,
      medication: 'Metformin 500mg',
      dosage: 'Twice daily',
      startDate: '2023-11-20',
      endDate: 'Ongoing',
      doctor: 'Dr. Michael Chen',
      condition: 'Type 2 Diabetes',
      status: 'Active',
      instructions: 'Take with meals, check blood sugar levels'
    },
    {
      id: 3,
      medication: 'Amoxicillin 500mg',
      dosage: 'Three times daily',
      startDate: '2024-02-10',
      endDate: '2024-02-17',
      doctor: 'Dr. Priya Sharma',
      condition: 'Acute Bronchitis',
      status: 'Completed',
      instructions: 'Complete full course, take with plenty of water'
    }
  ],
  labResults: [
    {
      id: 1,
      testName: 'Complete Blood Count (CBC)',
      date: '2024-02-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'Normal',
      results: {
        'Hemoglobin': '14.2 g/dL',
        'White Blood Cells': '7.5 K/μL',
        'Platelets': '285 K/μL',
        'Hematocrit': '42%'
      },
      notes: 'All values within normal range'
    },
    {
      id: 2,
      testName: 'Lipid Panel',
      date: '2024-01-20',
      doctor: 'Dr. Michael Chen',
      status: 'Abnormal',
      results: {
        'Total Cholesterol': '220 mg/dL',
        'LDL Cholesterol': '145 mg/dL',
        'HDL Cholesterol': '35 mg/dL',
        'Triglycerides': '200 mg/dL'
      },
      notes: 'Elevated LDL and triglycerides, HDL below recommended level'
    },
    {
      id: 3,
      testName: 'HbA1c',
      date: '2024-01-20',
      doctor: 'Dr. Michael Chen',
      status: 'Good',
      results: {
        'HbA1c': '6.8%',
        'Average Glucose': '154 mg/dL'
      },
      notes: 'Diabetes well-controlled, continue current treatment'
    }
  ],
  visitHistory: [
    {
      id: 1,
      date: '2024-02-15',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      type: 'Follow-up',
      reason: 'Blood pressure check',
      diagnosis: 'Hypertension - stable',
      treatment: 'Continue current medication',
      nextAppointment: '2024-03-15'
    },
    {
      id: 2,
      date: '2024-02-10',
      doctor: 'Dr. Priya Sharma',
      specialty: 'Pulmonology',
      type: 'Consultation',
      reason: 'Chest congestion and cough',
      diagnosis: 'Acute Bronchitis',
      treatment: 'Antibiotics and rest',
      nextAppointment: null
    },
    {
      id: 3,
      date: '2024-01-20',
      doctor: 'Dr. Michael Chen',
      specialty: 'Endocrinology',
      type: 'Follow-up',
      reason: 'Diabetes management',
      diagnosis: 'Type 2 Diabetes - well controlled',
      treatment: 'Continue Metformin',
      nextAppointment: '2024-04-20'
    },
    {
      id: 4,
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      type: 'Initial Consultation',
      reason: 'High blood pressure concerns',
      diagnosis: 'Hypertension',
      treatment: 'Started Lisinopril',
      nextAppointment: '2024-02-15'
    }
  ]
};

function MedicalRecordsPage() {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Export functionality
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would call an API endpoint to generate PDF
      // For now, we'll create a simple text-based export
      const exportData = generateExportData();
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user?.name || 'Medical'}_Records_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = generateCSVData();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user?.name || 'Medical'}_Records_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Generate export data for text/PDF format
  const generateExportData = () => {
    const patientName = user?.name || 'Unknown Patient';
    const exportDate = new Date().toLocaleDateString();
    
    let data = `MEDICAL RECORDS REPORT\n`;
    data += `Patient: ${patientName}\n`;
    data += `Generated: ${exportDate}\n`;
    data += `========================================\n\n`;
    
    // Patient Info
    data += `PATIENT INFORMATION\n`;
    data += `Name: ${patientName}\n`;
    data += `Age: ${user?.age || 'Not provided'}\n`;
    data += `Gender: ${user?.gender || 'Not provided'}\n`;
    data += `Blood Type: ${mockMedicalData.patientInfo.bloodType}\n`;
    data += `Allergies: ${mockMedicalData.patientInfo.allergies.join(', ')}\n\n`;
    
    // Diagnoses
    data += `DIAGNOSES\n`;
    mockMedicalData.diagnoses.forEach((diagnosis, index) => {
      data += `${index + 1}. ${diagnosis.condition}\n`;
      data += `   Date: ${new Date(diagnosis.date).toLocaleDateString()}\n`;
      data += `   Doctor: ${diagnosis.doctor}\n`;
      data += `   Status: ${diagnosis.status}\n`;
      data += `   Severity: ${diagnosis.severity}\n`;
      data += `   Description: ${diagnosis.description}\n\n`;
    });
    
    // Prescriptions
    data += `PRESCRIPTIONS\n`;
    mockMedicalData.prescriptions.forEach((prescription, index) => {
      data += `${index + 1}. ${prescription.medication}\n`;
      data += `   Dosage: ${prescription.dosage}\n`;
      data += `   Doctor: ${prescription.doctor}\n`;
      data += `   Status: ${prescription.status}\n`;
      data += `   Instructions: ${prescription.instructions}\n\n`;
    });
    
    // Lab Results
    data += `LAB RESULTS\n`;
    mockMedicalData.labResults.forEach((result, index) => {
      data += `${index + 1}. ${result.testName}\n`;
      data += `   Date: ${new Date(result.date).toLocaleDateString()}\n`;
      data += `   Doctor: ${result.doctor}\n`;
      data += `   Status: ${result.status}\n`;
      data += `   Results:\n`;
      Object.entries(result.results).forEach(([key, value]) => {
        data += `     ${key}: ${value}\n`;
      });
      data += `   Notes: ${result.notes}\n\n`;
    });
    
    // Visit History
    data += `VISIT HISTORY\n`;
    mockMedicalData.visitHistory.forEach((visit, index) => {
      data += `${index + 1}. ${visit.type} - ${visit.specialty}\n`;
      data += `   Date: ${new Date(visit.date).toLocaleDateString()}\n`;
      data += `   Doctor: ${visit.doctor}\n`;
      data += `   Reason: ${visit.reason}\n`;
      data += `   Diagnosis: ${visit.diagnosis}\n`;
      data += `   Treatment: ${visit.treatment}\n\n`;
    });
    
    return data;
  };

  // Generate CSV data
  const generateCSVData = () => {
    const patientName = user?.name || 'Unknown Patient';
    let csv = `Medical Records for ${patientName}\n\n`;
    
    // Diagnoses CSV
    csv += `Diagnoses\n`;
    csv += `Condition,Date,Doctor,Status,Severity,Description\n`;
    mockMedicalData.diagnoses.forEach(diagnosis => {
      csv += `"${diagnosis.condition}","${new Date(diagnosis.date).toLocaleDateString()}","${diagnosis.doctor}","${diagnosis.status}","${diagnosis.severity}","${diagnosis.description}"\n`;
    });
    
    csv += `\nPrescriptions\n`;
    csv += `Medication,Dosage,Doctor,Status,Instructions\n`;
    mockMedicalData.prescriptions.forEach(prescription => {
      csv += `"${prescription.medication}","${prescription.dosage}","${prescription.doctor}","${prescription.status}","${prescription.instructions}"\n`;
    });
    
    csv += `\nLab Results\n`;
    csv += `Test Name,Date,Doctor,Status,Notes\n`;
    mockMedicalData.labResults.forEach(result => {
      csv += `"${result.testName}","${new Date(result.date).toLocaleDateString()}","${result.doctor}","${result.status}","${result.notes}"\n`;
    });
    
    csv += `\nVisit History\n`;
    csv += `Type,Specialty,Date,Doctor,Reason,Diagnosis,Treatment\n`;
    mockMedicalData.visitHistory.forEach(visit => {
      csv += `"${visit.type}","${visit.specialty}","${new Date(visit.date).toLocaleDateString()}","${visit.doctor}","${visit.reason}","${visit.diagnosis}","${visit.treatment}"\n`;
    });
    
    return csv;
  };

  // Helper function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'resolved':
      case 'completed':
      case 'normal':
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'abnormal':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" />Abnormal</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Helper function to get severity badge
  const getSeverityBadge = (severity: string) => {
    const colors = {
      'Mild': 'bg-yellow-100 text-yellow-800',
      'Moderate': 'bg-orange-100 text-orange-800',
      'Severe': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{severity}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToDashboardButton userRole={user?.role || 'Patient'} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                <p className="text-gray-600 mt-1">Your complete health history and medical information</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center" disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Records'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToPDF} className="flex items-center">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV} className="flex items-center">
                  <Table className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Overview Card */}
        <div className={`mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Age & Gender</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.age ? `${user.age} years` : 'Not provided'}, {user?.gender || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Blood Type</p>
                  <p className="text-lg font-semibold text-gray-900">{mockMedicalData.patientInfo.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user?.medicalHistory && user.medicalHistory.length > 0 ? (
                      user.medicalHistory.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No allergies recorded</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records Tabs */}
        <div className={`transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="diagnoses" className="flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Diagnoses
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center">
                <Pill className="w-4 h-4 mr-2" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="lab-results" className="flex items-center">
                <TestTube className="w-4 h-4 mr-2" />
                Lab Results
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Diagnoses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                      Recent Diagnoses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockMedicalData.diagnoses.slice(0, 2).map((diagnosis) => (
                      <div key={diagnosis.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{diagnosis.condition}</h4>
                          {getStatusBadge(diagnosis.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{diagnosis.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(diagnosis.date).toLocaleDateString()} • {diagnosis.doctor}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="w-5 h-5 mr-2 text-green-600" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockMedicalData.prescriptions.filter(p => p.status === 'Active').map((prescription) => (
                      <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{prescription.medication}</h4>
                          {getStatusBadge(prescription.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{prescription.dosage}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Since {new Date(prescription.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Lab Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Lab Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockMedicalData.labResults.slice(0, 3).map((result) => (
                      <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{result.testName}</h4>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(result.date).toLocaleDateString()} • {result.doctor}
                        </p>
                        <p className="text-xs text-gray-600">{result.notes}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Diagnoses Tab */}
            <TabsContent value="diagnoses" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {mockMedicalData.diagnoses.map((diagnosis, index) => (
                  <Card key={diagnosis.id} className={`transition-all duration-300 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{diagnosis.condition}</CardTitle>
                          <CardDescription className="mt-1">
                            Diagnosed on {new Date(diagnosis.date).toLocaleDateString()} by {diagnosis.doctor}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(diagnosis.status)}
                          {getSeverityBadge(diagnosis.severity)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700">{diagnosis.description}</p>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline">{symptom}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {mockMedicalData.prescriptions.map((prescription, index) => (
                  <Card key={prescription.id} className={`transition-all duration-300 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{prescription.medication}</CardTitle>
                          <CardDescription className="mt-1">
                            Prescribed by {prescription.doctor} for {prescription.condition}
                          </CardDescription>
                        </div>
                        {getStatusBadge(prescription.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Dosage:</h4>
                          <p className="text-gray-700">{prescription.dosage}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Duration:</h4>
                          <p className="text-gray-700">
                            {new Date(prescription.startDate).toLocaleDateString()} - {prescription.endDate}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Instructions:</h4>
                        <p className="text-gray-700">{prescription.instructions}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Lab Results Tab */}
            <TabsContent value="lab-results" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {mockMedicalData.labResults.map((result, index) => (
                  <Card key={result.id} className={`transition-all duration-300 hover:shadow-lg ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{result.testName}</CardTitle>
                          <CardDescription className="mt-1">
                            {new Date(result.date).toLocaleDateString()} • {result.doctor}
                          </CardDescription>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(result.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="font-semibold text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                      {result.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Notes:</h4>
                          <p className="text-gray-700">{result.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Visit History Section */}
        <div className={`mt-8 transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Visit History
              </CardTitle>
              <CardDescription>Complete history of your medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMedicalData.visitHistory.map((visit, index) => (
                  <div key={visit.id} className={`p-4 border-l-4 border-blue-200 bg-gray-50 rounded-r-lg transition-all duration-300 hover:shadow-md ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`} style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{visit.type} - {visit.specialty}</h4>
                        <p className="text-sm text-gray-600">{visit.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {visit.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span> {visit.reason}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Treatment:</span> {visit.treatment}
                      </p>
                      {visit.nextAppointment && (
                        <p className="text-sm text-blue-600">
                          <span className="font-medium">Next Appointment:</span> {new Date(visit.nextAppointment).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Export the component with authentication wrapper
export default withAuth(MedicalRecordsPage, ['Patient']);
