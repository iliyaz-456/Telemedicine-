'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BackToDashboardButton } from '@/components/ui/back-button';
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Edit, 
  Save, 
  X,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Interface for consultation records
interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAddress: string;
  patientAge?: number;
  patientGender?: string;
  doctorName: string;
  doctorSpecialization?: string;
  consultationDate: string;
  consultationType: string;
  status: string;
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string | null;
  duration?: number | null;
  endTime?: string | null;
}

// Mock data for demo doctor consultations
// In a real app, this would come from an API
const mockDoctorConsultations: ConsultationRecord[] = [
  {
    id: 'consultation1',
    patientId: 'patient1',
    patientName: 'John Doe',
    patientPhone: '+91 98765 43210',
    patientEmail: 'john.doe@email.com',
    patientAddress: 'Village A, Nabha',
    patientAge: 45,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-15',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Fever', 'Cough', 'Headache'],
    diagnosis: 'Viral Fever',
    prescription: 'Paracetamol 500mg - 1 tablet every 6 hours for 3 days\nRest and plenty of fluids',
    notes: 'Patient responded well to treatment. Advised to follow up if symptoms persist.',
    followUpRequired: true,
    followUpDate: '2024-01-22',
    duration: 25
  },
  {
    id: 'consultation2',
    patientId: 'patient2',
    patientName: 'Priya Sharma',
    patientPhone: '+91 98765 43211',
    patientEmail: 'priya.sharma@email.com',
    patientAddress: 'Village B, Nabha',
    patientAge: 32,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-14',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Chest pain', 'Shortness of breath'],
    diagnosis: 'Mild chest congestion',
    prescription: 'Cough syrup - 2 teaspoons twice daily\nSteam inhalation twice daily',
    notes: 'Patient advised to avoid cold foods and maintain warm environment.',
    followUpRequired: false,
    followUpDate: null,
    duration: 18
  },
  {
    id: 'consultation3',
    patientId: 'patient3',
    patientName: 'Rajesh Kumar',
    patientPhone: '+91 98765 43212',
    patientEmail: 'rajesh.kumar@email.com',
    patientAddress: 'Village C, Nabha',
    patientAge: 28,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-13',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Stomach pain', 'Nausea', 'Loss of appetite'],
    diagnosis: 'Gastritis',
    prescription: 'Antacid - 1 tablet after meals\nAvoid spicy and oily foods',
    notes: 'Patient advised dietary modifications. Symptoms should improve in 2-3 days.',
    followUpRequired: true,
    followUpDate: '2024-01-20',
    duration: 22
  },
  {
    id: 'consultation4',
    patientId: 'patient4',
    patientName: 'Sunita Devi',
    patientPhone: '+91 98765 43213',
    patientEmail: 'sunita.devi@email.com',
    patientAddress: 'Village D, Nabha',
    patientAge: 55,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-12',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Joint pain', 'Swelling', 'Stiffness'],
    diagnosis: 'Arthritis',
    prescription: 'Pain relief gel - Apply twice daily\nCalcium supplement - 1 tablet daily',
    notes: 'Patient advised gentle exercises and warm compress. Long-term management required.',
    followUpRequired: true,
    followUpDate: '2024-01-26',
    duration: 35
  },
  {
    id: 'consultation5',
    patientId: 'patient5',
    patientName: 'Amit Singh',
    patientPhone: '+91 98765 43214',
    patientEmail: 'amit.singh@email.com',
    patientAddress: 'Village E, Nabha',
    patientAge: 38,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-11',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['High blood pressure', 'Dizziness'],
    diagnosis: 'Hypertension',
    prescription: 'Blood pressure medication - 1 tablet daily\nLow salt diet\nRegular exercise',
    notes: 'Patient advised lifestyle modifications. Regular monitoring required.',
    followUpRequired: true,
    followUpDate: '2024-01-18',
    duration: 30
  },
  {
    id: 'consultation6',
    patientId: 'patient6',
    patientName: 'Kavita Mehta',
    patientPhone: '+91 98765 43215',
    patientEmail: 'kavita.mehta@email.com',
    patientAddress: 'Village F, Nabha',
    patientAge: 42,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-10',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Back pain', 'Muscle stiffness'],
    diagnosis: 'Muscle strain',
    prescription: 'Pain reliever - 1 tablet twice daily\nHot compress application\nRest and avoid heavy lifting',
    notes: 'Patient advised proper posture and gentle stretching exercises.',
    followUpRequired: false,
    followUpDate: null,
    duration: 20
  },
  {
    id: 'consultation7',
    patientId: 'patient7',
    patientName: 'Vikram Singh',
    patientPhone: '+91 98765 43216',
    patientEmail: 'vikram.singh@email.com',
    patientAddress: 'Village G, Nabha',
    patientAge: 50,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-09',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Chest discomfort', 'Fatigue', 'Shortness of breath'],
    diagnosis: 'Mild cardiac symptoms',
    prescription: 'ECG recommended\nStress test advised\nLifestyle modifications\nRegular monitoring',
    notes: 'Patient referred for further cardiac evaluation. Advised immediate follow-up if symptoms worsen.',
    followUpRequired: true,
    followUpDate: '2024-01-16',
    duration: 40
  },
  {
    id: 'consultation8',
    patientId: 'patient8',
    patientName: 'Meera Patel',
    patientPhone: '+91 98765 43217',
    patientEmail: 'meera.patel@email.com',
    patientAddress: 'Village H, Nabha',
    patientAge: 35,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-08',
    consultationType: 'video',
    status: 'ongoing',
    symptoms: ['Headache', 'Nausea', 'Dizziness'],
    diagnosis: 'Migraine',
    prescription: 'Migraine medication - 1 tablet as needed\nAvoid triggers (stress, certain foods)\nAdequate sleep and hydration',
    notes: 'Patient educated about migraine triggers and management strategies.',
    followUpRequired: true,
    followUpDate: '2024-01-15',
    duration: 28
  },
  {
    id: 'consultation9',
    patientId: 'patient9',
    patientName: 'Ramesh Kumar',
    patientPhone: '+91 98765 43218',
    patientEmail: 'ramesh.kumar@email.com',
    patientAddress: 'Village I, Nabha',
    patientAge: 60,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-07',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Cough', 'Chest congestion', 'Fever'],
    diagnosis: 'Bronchitis',
    prescription: 'Antibiotic - 1 tablet twice daily for 5 days\nCough syrup - 2 teaspoons twice daily\nSteam inhalation',
    notes: 'Patient advised to complete full course of antibiotics and avoid smoking.',
    followUpRequired: true,
    followUpDate: '2024-01-14',
    duration: 32
  },
  {
    id: 'consultation10',
    patientId: 'patient10',
    patientName: 'Sushila Devi',
    patientPhone: '+91 98765 43219',
    patientEmail: 'sushila.devi@email.com',
    patientAddress: 'Village J, Nabha',
    patientAge: 48,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-06',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Joint pain', 'Swelling', 'Morning stiffness'],
    diagnosis: 'Rheumatoid Arthritis',
    prescription: 'Anti-inflammatory medication - 1 tablet twice daily\nPain relief gel - Apply as needed\nPhysical therapy recommended',
    notes: 'Patient referred to rheumatologist for specialized care. Long-term management plan discussed.',
    followUpRequired: true,
    followUpDate: '2024-01-20',
    duration: 45
  },
  {
    id: 'consultation11',
    patientId: 'patient11',
    patientName: 'Arjun Singh',
    patientPhone: '+91 98765 43220',
    patientEmail: 'arjun.singh@email.com',
    patientAddress: 'Village K, Nabha',
    patientAge: 25,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-05',
    consultationType: 'missed_call',
    status: 'pending',
    symptoms: ['Skin rash', 'Itching', 'Redness'],
    diagnosis: 'Allergic dermatitis',
    prescription: 'Antihistamine - 1 tablet daily\nTopical steroid cream - Apply twice daily\nAvoid known allergens',
    notes: 'Patient advised to identify and avoid potential allergens. Patch testing recommended.',
    followUpRequired: false,
    followUpDate: null,
    duration: 15
  },
  {
    id: 'consultation12',
    patientId: 'patient12',
    patientName: 'Geeta Sharma',
    patientPhone: '+91 98765 43221',
    patientEmail: 'geeta.sharma@email.com',
    patientAddress: 'Village L, Nabha',
    patientAge: 52,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-04',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Weight loss', 'Fatigue', 'Increased thirst'],
    diagnosis: 'Type 2 Diabetes',
    prescription: 'Metformin - 500mg twice daily\nBlood glucose monitoring\nDietary counseling\nRegular exercise',
    notes: 'Patient referred to endocrinologist. Diabetes education and lifestyle modifications discussed.',
    followUpRequired: true,
    followUpDate: '2024-01-11',
    duration: 50
  },
  {
    id: 'consultation13',
    patientId: 'patient13',
    patientName: 'Ravi Kumar',
    patientPhone: '+91 98765 43222',
    patientEmail: 'ravi.kumar@email.com',
    patientAddress: 'Village M, Nabha',
    patientAge: 33,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-20',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Cough', 'Sore throat', 'Fever'],
    diagnosis: 'Upper respiratory infection',
    prescription: 'Antibiotic - 1 tablet twice daily for 7 days\nThroat lozenges - As needed\nGargle with warm salt water',
    notes: 'Patient advised to complete full course of antibiotics and rest adequately.',
    followUpRequired: false,
    followUpDate: null,
    duration: 25
  },
  {
    id: 'consultation14',
    patientId: 'patient14',
    patientName: 'Pooja Gupta',
    patientPhone: '+91 98765 43223',
    patientEmail: 'pooja.gupta@email.com',
    patientAddress: 'Village N, Nabha',
    patientAge: 29,
    patientGender: 'Female',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-19',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Anxiety', 'Insomnia', 'Palpitations'],
    diagnosis: 'Stress-related anxiety',
    prescription: 'Anti-anxiety medication - 1 tablet daily\nBreathing exercises\nStress management techniques',
    notes: 'Patient referred to counselor for stress management. Lifestyle modifications discussed.',
    followUpRequired: true,
    followUpDate: '2024-01-26',
    duration: 35
  },
  {
    id: 'consultation15',
    patientId: 'patient15',
    patientName: 'Manoj Singh',
    patientPhone: '+91 98765 43224',
    patientEmail: 'manoj.singh@email.com',
    patientAddress: 'Village O, Nabha',
    patientAge: 41,
    patientGender: 'Male',
    doctorName: 'Dr. Smith',
    doctorSpecialization: 'General Medicine',
    consultationDate: '2024-01-18',
    consultationType: 'video',
    status: 'completed',
    symptoms: ['Eye pain', 'Blurred vision', 'Headache'],
    diagnosis: 'Eye strain',
    prescription: 'Eye drops - 2 drops twice daily\nRest eyes every 20 minutes\nProper lighting while reading',
    notes: 'Patient advised to reduce screen time and use proper lighting. Eye examination recommended.',
    followUpRequired: true,
    followUpDate: '2024-01-25',
    duration: 20
  }
];

// (Removed) Demo patient records and related types

function DoctorMedicalRecords() {
  const { user, token } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ConsultationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed demoRecords state

  // Fetch medical records from API
  const fetchMedicalRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/doctor/medical-records', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }

      const data = await response.json();
      
      if (data.success) {
        setConsultations(data.records);
        setFilteredConsultations(data.records);
      } else {
        throw new Error(data.error || 'Failed to fetch medical records');
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch medical records');
      // Fallback to mock data for demo
      setConsultations(mockDoctorConsultations);
      setFilteredConsultations(mockDoctorConsultations);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter consultations based on search term
  useEffect(() => {
    const filtered = consultations.filter(consultation =>
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.symptoms.some((symptom: string) => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredConsultations(filtered);
  }, [searchTerm, consultations]);

  // Fetch data on component mount
  useEffect(() => {
    fetchMedicalRecords();
  }, [token]);

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEditRecord = (consultation: ConsultationRecord) => {
    setEditingRecord({ ...consultation });
    setIsEditModalOpen(true);
  };

  // Removed demo change/save handlers

  const handleSaveRecord = async () => {
    if (!editingRecord) return;

    try {
      const response = await fetch('/api/doctor/medical-records', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: editingRecord.id,
          diagnosis: editingRecord.diagnosis,
          prescription: editingRecord.prescription,
          notes: editingRecord.notes,
          followUpRequired: editingRecord.followUpRequired,
          followUpDate: editingRecord.followUpDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update medical record');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === editingRecord.id ? editingRecord : consultation
          )
        );
        setIsEditModalOpen(false);
        setEditingRecord(null);
      } else {
        throw new Error(data.error || 'Failed to update medical record');
      }
    } catch (err) {
      console.error('Error updating medical record:', err);
      alert(err instanceof Error ? err.message : 'Failed to update medical record');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Ongoing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConsultationTypeBadge = (type: string) => {
    switch (type) {
      case 'video':
        return <Badge variant="outline" className="text-blue-600">Video Call</Badge>;
      case 'audio':
        return <Badge variant="outline" className="text-green-600">Audio Call</Badge>;
      case 'missed_call':
        return <Badge variant="outline" className="text-orange-600">Missed Call</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToDashboardButton userRole="Doctor" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Medical Records</h1>
                <p className="text-gray-600 mt-1">Patients consulted by Dr. {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center">
                <Stethoscope className="w-3 h-3 mr-1" />
                Doctor
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className={`mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Search Patient Records
              </CardTitle>
              <CardDescription>
                Search by patient name, diagnosis, or symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients by name, diagnosis, or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Summary */}
        <div className={`mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredConsultations.length}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredConsultations.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredConsultations.filter(c => c.followUpRequired).length}
                  </div>
                  <div className="text-sm text-gray-600">Follow-ups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredConsultations.filter(c => c.consultationType === 'video').length}
                  </div>
                  <div className="text-sm text-gray-600">Video Calls</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800">
                    {error}. Using demo data for demonstration purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className={`mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading medical records...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Medical Records List */}
        {!isLoading && (
          <div className={`space-y-6 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {filteredConsultations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-600">No patient records match your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredConsultations.map((consultation, index) => (
              <Card 
                key={consultation.id}
                className={`transition-all duration-300 hover:shadow-lg ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{consultation.patientName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(consultation.consultationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(consultation.status)}
                      {getConsultationTypeBadge(consultation.consultationType)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Patient Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {consultation.patientPhone}
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {consultation.patientEmail}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {consultation.patientAddress}
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {consultation.symptoms.map((symptom: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-orange-600">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Diagnosis & Prescription */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Diagnosis:</h4>
                      <p className="text-gray-700">{consultation.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Prescription:</h4>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{consultation.prescription}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-700 text-sm">{consultation.notes}</p>
                  </div>

                  {/* Follow-up Info */}
                  {consultation.followUpRequired && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Follow-up required on {consultation.followUpDate ? new Date(consultation.followUpDate).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRecord(consultation)}
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          </div>
        )}

        {/* Removed demo patient editable section */}
      </main>

      {/* Edit Record Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-blue-600" />
              Edit Medical Record
            </DialogTitle>
            <DialogDescription>
              Update the medical record for {editingRecord?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          {editingRecord && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                <Input
                  value={editingRecord.diagnosis}
                  onChange={(e) => setEditingRecord({...editingRecord, diagnosis: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Prescription</label>
                <Textarea
                  value={editingRecord.prescription}
                  onChange={(e) => setEditingRecord({...editingRecord, prescription: e.target.value})}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  value={editingRecord.notes}
                  onChange={(e) => setEditingRecord({...editingRecord, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followUp"
                  checked={editingRecord.followUpRequired}
                  onChange={(e) => setEditingRecord({...editingRecord, followUpRequired: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="followUp" className="text-sm font-medium text-gray-700">
                  Follow-up required
                </label>
              </div>
              
              {editingRecord.followUpRequired && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
                  <Input
                    type="date"
                    value={editingRecord.followUpDate || ''}
                    onChange={(e) => setEditingRecord({...editingRecord, followUpDate: e.target.value})}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSaveRecord}>
              <Save className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(DoctorMedicalRecords, ['Doctor']);
