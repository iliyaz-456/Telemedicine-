'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Star, Clock, MapPin, Search, Filter, Calendar, Phone, Mail } from 'lucide-react';

// Mock doctor data - in a real app, this would come from an API
const mockDoctors = {
  'general-physician': [
    {
      id: 1,
      name: 'Dr. Rahul tiwari',
      specialization: 'General Physician',
      experience: 8,
      rating: 4.9,
      patients: 1250,
      nextAvailable: 'Today, 2:00 PM',
      consultationFee: 99,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD Internal Medicine',
      hospital: 'Apollo Hospital, Chandigarh',
      image: '/placeholder-doctor.jpg'
    },
    {
      id: 2,
      name: 'Dr. Mrunal thakur',
      specialization: 'General Physician',
      experience: 12,
      rating: 4.8,
      patients: 2100,
      nextAvailable: 'Tomorrow, 10:00 AM',
      consultationFee: 99,
      languages: ['Hindi', 'Punjabi', 'English'],
      education: 'MBBS, MD General Medicine',
      hospital: 'Fortis Hospital, Mohali',
      image: '/placeholder-doctor.jpg'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialization: 'General Physician',
      experience: 6,
      rating: 4.7,
      patients: 890,
      nextAvailable: 'Today, 4:30 PM',
      consultationFee: 149,
      languages: ['English', 'Hindi'],
      education: 'MBBS, MD Family Medicine',
      hospital: 'Max Hospital, Ludhiana',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'cardiologist': [
    {
      id: 4,
      name: 'Dr. Amit Patel',
      specialization: 'Cardiologist',
      experience: 15,
      rating: 4.9,
      patients: 3200,
      nextAvailable: 'Tomorrow, 11:00 AM',
      consultationFee: 149,
      languages: ['English', 'Hindi', 'Gujarati'],
      education: 'MBBS, MD, DM Cardiology',
      hospital: 'Apollo Hospital, Chandigarh',
      image: '/placeholder-doctor.jpg'
    },
    {
      id: 5,
      name: 'Dr. Neha Singh',
      specialization: 'Cardiologist',
      experience: 10,
      rating: 4.8,
      patients: 1800,
      nextAvailable: 'Today, 3:00 PM',
      consultationFee: 149,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD, DM Cardiology',
      hospital: 'Fortis Hospital, Mohali',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'dermatologist': [
    {
      id: 6,
      name: 'Dr. Anjali Mehta',
      specialization: 'Dermatologist',
      experience: 9,
      rating: 4.8,
      patients: 1500,
      nextAvailable: 'Today, 5:00 PM',
      consultationFee: 99,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD Dermatology',
      hospital: 'Max Hospital, Ludhiana',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'neurologist': [
    {
      id: 7,
      name: 'Dr. Vikram Singh',
      specialization: 'Neurologist',
      experience: 14,
      rating: 4.9,
      patients: 2200,
      nextAvailable: 'Tomorrow, 9:00 AM',
      consultationFee: 99,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD, DM Neurology',
      hospital: 'Apollo Hospital, Chandigarh',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'ophthalmologist': [
    {
      id: 8,
      name: 'Dr. Sunita Reddy',
      specialization: 'Ophthalmologist',
      experience: 11,
      rating: 4.7,
      patients: 1900,
      nextAvailable: 'Today, 6:00 PM',
      consultationFee: 149,
      languages: ['English', 'Hindi', 'Telugu'],
      education: 'MBBS, MS Ophthalmology',
      hospital: 'Fortis Hospital, Mohali',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'pediatrician': [
    {
      id: 9,
      name: 'Dr. Ravi Gupta',
      specialization: 'Pediatrician',
      experience: 13,
      rating: 4.9,
      patients: 2800,
      nextAvailable: 'Tomorrow, 2:00 PM',
      consultationFee: 149,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD Pediatrics',
      hospital: 'Max Hospital, Ludhiana',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'orthopedist': [
    {
      id: 10,
      name: 'Dr. Manish Agarwal',
      specialization: 'Orthopedist',
      experience: 16,
      rating: 4.8,
      patients: 2500,
      nextAvailable: 'Today, 7:00 PM',
      consultationFee: 99,
      languages: ['English', 'Hindi'],
      education: 'MBBS, MS Orthopedics',
      hospital: 'Apollo Hospital, Chandigarh',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'pulmonologist': [
    {
      id: 11,
      name: 'Dr. Kavita Joshi',
      specialization: 'Pulmonologist',
      experience: 12,
      rating: 4.8,
      patients: 1600,
      nextAvailable: 'Tomorrow, 1:00 PM',
      consultationFee: 149,
      languages: ['English', 'Hindi', 'Marathi'],
      education: 'MBBS, MD, DM Pulmonology',
      hospital: 'Fortis Hospital, Mohali',
      image: '/placeholder-doctor.jpg'
    }
  ],
  'nephrologist': [
    {
      id: 12,
      name: 'Dr. Suresh Kumar',
      specialization: 'Nephrologist',
      experience: 18,
      rating: 4.9,
      patients: 2100,
      nextAvailable: 'Today, 8:00 PM',
      consultationFee: 99,
      languages: ['English', 'Hindi', 'Punjabi'],
      education: 'MBBS, MD, DM Nephrology',
      hospital: 'Max Hospital, Ludhiana',
      image: '/placeholder-doctor.jpg'
    }
  ]
};

// Category display names
const categoryNames = {
  'general-physician': 'General Physician',
  'cardiologist': 'Cardiologist',
  'neurologist': 'Neurologist',
  'dermatologist': 'Dermatologist',
  'ophthalmologist': 'Ophthalmologist',
  'pediatrician': 'Pediatrician',
  'orthopedist': 'Orthopedist',
  'pulmonologist': 'Pulmonologist',
  'nephrologist': 'Nephrologist'
};

export default function DoctorCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load doctors for the category
  useEffect(() => {
    const categoryDoctors = mockDoctors[category as keyof typeof mockDoctors] || [];
    setDoctors(categoryDoctors);
    setFilteredDoctors(categoryDoctors);
    setIsLoaded(true);
  }, [category]);

  // Filter and sort doctors
  useEffect(() => {
    let filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'fee':
          return a.consultationFee - b.consultationFee;
        case 'availability':
          return a.nextAvailable.localeCompare(b.nextAvailable);
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, sortBy]);

  const handleBookAppointment = (doctorId: number) => {
    // In a real app, this would navigate to a booking form or modal
    alert(`Booking appointment with doctor ID: ${doctorId}. This would open a booking form in a real application.`);
  };

  if (!categoryNames[category as keyof typeof categoryNames]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The requested doctor category does not exist.</p>
          <Button asChild>
            <Link href="/book">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/book" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryNames[category as keyof typeof categoryNames]}s
              </h1>
              <p className="text-gray-600 mt-1">
                Choose from {filteredDoctors.length} available {categoryNames[category as keyof typeof categoryNames].toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search doctors by name or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                  <SelectItem value="fee">Lowest Fee</SelectItem>
                  <SelectItem value="availability">Earliest Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {filteredDoctors.map((doctor, index) => (
            <Card 
              key={doctor.id}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Doctor Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    
                    <div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {doctor.education}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{doctor.rating}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Doctor Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {doctor.hospital}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {doctor.experience} years experience • {doctor.patients} patients
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Next available: {doctor.nextAvailable}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((lang: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
                  </div>
                  
                  <Button 
                    onClick={() => handleBookAppointment(doctor.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new doctors.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSortBy('rating');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Back to Categories */}
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/book" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Categories
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}



