'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BackToDashboardButton } from '@/components/ui/back-button';
import { 
  ArrowLeft, 
  Search, 
  Pill, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Phone,
  Mail
} from 'lucide-react';

// Mock medicine data - in a real app, this would come from an API
const mockMedicines = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    manufacturer: 'Sun Pharma',
    dosage: '500mg',
    form: 'Tablet',
    category: 'Pain Relief',
    description: 'Used for fever and pain relief',
    price: 25,
    stock: 150
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    manufacturer: 'Cipla',
    dosage: '250mg',
    form: 'Capsule',
    category: 'Antibiotic',
    description: 'Antibiotic for bacterial infections',
    price: 45,
    stock: 80
  },
  {
    id: 3,
    name: 'Metformin 500mg',
    genericName: 'Metformin',
    manufacturer: 'Dr. Reddy\'s',
    dosage: '500mg',
    form: 'Tablet',
    category: 'Diabetes',
    description: 'Used to control blood sugar levels',
    price: 35,
    stock: 0
  },
  {
    id: 4,
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    manufacturer: 'Lupin',
    dosage: '10mg',
    form: 'Tablet',
    category: 'Blood Pressure',
    description: 'ACE inhibitor for hypertension',
    price: 55,
    stock: 25
  },
  {
    id: 5,
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    manufacturer: 'Zydus',
    dosage: '20mg',
    form: 'Capsule',
    category: 'Digestive',
    description: 'Proton pump inhibitor for acid reflux',
    price: 40,
    stock: 60
  }
];

// Mock pharmacy data - Nabha city and nearby areas
const mockPharmacies = [
  {
    id: 1,
    name: 'Apollo Pharmacy',
    address: '123 Railway Road, Nabha',
    phone: '+91-9876543210',
    email: 'apollo@pharmacy.com',
    distance: '0.5 km',
    rating: 4.5,
    medicines: [1, 2, 4, 5] // Medicine IDs available
  },
  {
    id: 2,
    name: 'MedPlus Pharmacy',
    address: '456 Main Bazaar, Nabha',
    phone: '+91-9876543211',
    email: 'medplus@pharmacy.com',
    distance: '1.2 km',
    rating: 4.3,
    medicines: [1, 3, 5] // Medicine IDs available
  },
  {
    id: 3,
    name: 'Wellness Pharmacy',
    address: '789 Patiala Road, Nabha',
    phone: '+91-9876543212',
    email: 'wellness@pharmacy.com',
    distance: '2.1 km',
    rating: 4.7,
    medicines: [2, 4] // Medicine IDs available
  },
  {
    id: 4,
    name: 'City Medical Store',
    address: '321 Gurdwara Road, Nabha',
    phone: '+91-9876543213',
    email: 'citymedical@pharmacy.com',
    distance: '1.8 km',
    rating: 4.2,
    medicines: [1, 2] // Medicine IDs available
  },
  {
    id: 5,
    name: 'Health Plus Pharmacy',
    address: '654 Patran Road, Nabha',
    phone: '+91-9876543214',
    email: 'healthplus@pharmacy.com',
    distance: '2.5 km',
    rating: 4.4,
    medicines: [3, 4, 5] // Medicine IDs available
  },
  {
    id: 6,
    name: 'Nabha Medical Center',
    address: '987 Bhadson Road, Nabha',
    phone: '+91-9876543215',
    email: 'nabhamedical@pharmacy.com',
    distance: '3.2 km',
    rating: 4.6,
    medicines: [1, 2, 3, 4, 5] // Medicine IDs available
  },
  {
    id: 7,
    name: 'Rural Health Pharmacy',
    address: '147 Patiala-Nabha Highway, Near Nabha',
    phone: '+91-9876543216',
    email: 'ruralhealth@pharmacy.com',
    distance: '4.1 km',
    rating: 4.1,
    medicines: [2, 3] // Medicine IDs available
  },
  {
    id: 8,
    name: 'Community Medical Store',
    address: '258 Rajpura Road, Near Nabha',
    phone: '+91-9876543217',
    email: 'community@pharmacy.com',
    distance: '5.3 km',
    rating: 4.3,
    medicines: [1, 4, 5] // Medicine IDs available
  }
];

// Mock medicine requests - in a real app, this would be stored in a database
let medicineRequests: any[] = [];

function MedicineTrackerPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [filteredMedicines, setFilteredMedicines] = useState(mockMedicines);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [requestNotes, setRequestNotes] = useState('');

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter medicines based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMedicines(mockMedicines);
    } else {
      const filtered = mockMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm]);

  // Handle medicine search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle medicine selection
  const handleMedicineSelect = (medicine: any) => {
    setSelectedMedicine(medicine);
    setShowRequestForm(true);
  };

  // Handle medicine request submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMedicine || !user) return;

    const request = {
      id: Date.now(),
      patientId: user._id,
      patientName: user.name,
      patientPhone: user.phone || 'Not provided',
      patientEmail: user.email,
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      quantity: requestQuantity,
      notes: requestNotes,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ashaWorkerNotes: '',
      isOutOfStock: isOutOfStock(selectedMedicine.stock),
      reason: isOutOfStock(selectedMedicine.stock) ? 'Out of Stock' : 'Not Available at Pharmacies'
    };

    try {
      // In a real app, this would be sent to an API endpoint
      // For now, we'll store it in localStorage to simulate sending to ASHA worker
      const existingRequests = JSON.parse(localStorage.getItem('medicineRequests') || '[]');
      existingRequests.push(request);
      localStorage.setItem('medicineRequests', JSON.stringify(existingRequests));
      
      // Also add to the global requests array for immediate display
      medicineRequests.push(request);
      
      // Show success message
      alert(`Medicine request submitted successfully! ASHA worker will contact you soon about ${selectedMedicine.name}.`);
      
      // Reset form
      setShowRequestForm(false);
      setSelectedMedicine(null);
      setRequestQuantity(1);
      setRequestNotes('');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Get availability status for a medicine
  const getAvailabilityStatus = (medicineId: number) => {
    const availablePharmacies = mockPharmacies.filter(pharmacy =>
      pharmacy.medicines.includes(medicineId)
    );
    return {
      isAvailable: availablePharmacies.length > 0,
      pharmacyCount: availablePharmacies.length,
      pharmacies: availablePharmacies
    };
  };

  // Get stock status badge
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive" className="flex items-center"><XCircle className="w-3 h-3 mr-1" />Out of Stock</Badge>;
    } else if (stock < 20) {
      return <Badge variant="secondary" className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center"><CheckCircle className="w-3 h-3 mr-1" />In Stock</Badge>;
    }
  };

  // Check if medicine is out of stock
  const isOutOfStock = (stock: number) => stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <BackToDashboardButton userRole={user?.role || 'Patient'} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medicine Tracker</h1>
              <p className="text-gray-600 mt-1">Search medicines and check availability at nearby pharmacies</p>
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
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Search className="w-5 h-5 mr-2 text-green-600" />
                Search Medicines
              </CardTitle>
              <CardDescription>
                Find medicines by name, generic name, or category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search for medicines (e.g., Paracetamol, Amoxicillin, Diabetes)"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 text-lg py-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medicine Results */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {filteredMedicines.map((medicine, index) => {
            const availability = getAvailabilityStatus(medicine.id);
            return (
              <Card 
                key={medicine.id} 
                className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{medicine.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {medicine.genericName} • {medicine.manufacturer}
                        </CardDescription>
                      </div>
                    </div>
                    {getStockBadge(medicine.stock)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <p className="text-gray-900">{medicine.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Form:</span>
                      <p className="text-gray-900">{medicine.form}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Price:</span>
                      <p className="text-gray-900">₹{medicine.price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Stock:</span>
                      <p className="text-gray-900">{medicine.stock} units</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{medicine.description}</p>
                  
                  {/* Availability Status */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Availability:</span>
                      <Badge variant={
                        isOutOfStock(medicine.stock) ? "destructive" : 
                        availability.isAvailable ? "default" : "destructive"
                      }>
                        {isOutOfStock(medicine.stock) ? 'Out of Stock' : 
                         availability.isAvailable ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isOutOfStock(medicine.stock) 
                        ? 'Out of stock - Request through ASHA worker'
                        : `Available at ${availability.pharmacyCount} pharmacy${availability.pharmacyCount > 1 ? 'ies' : ''} in Nabha`
                      }
                    </p>
                    {isOutOfStock(medicine.stock) && (
                      <p className="text-xs text-blue-600 mt-1">
                        💡 ASHA worker will help arrange this medicine for you
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {isOutOfStock(medicine.stock) ? (
                      <Button 
                        onClick={() => handleMedicineSelect(medicine)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Request Medicine
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        Available at Pharmacies
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Check if any medicines are out of stock */}
        {filteredMedicines.some(medicine => isOutOfStock(medicine.stock)) && (
          <div className={`mb-8 transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                  Out of Stock Medicines
                </CardTitle>
                <CardDescription>
                  The following medicines are out of stock. You can request them through ASHA workers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredMedicines
                    .filter(medicine => isOutOfStock(medicine.stock))
                    .map(medicine => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div>
                            <span className="font-medium text-gray-900">{medicine.name}</span>
                            <span className="text-sm text-gray-600 ml-2">({medicine.genericName})</span>
                          </div>
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleMedicineSelect(medicine)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Request
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Nearby Pharmacies */}
        <div className={`mb-8 transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Pharmacies in Nabha & Nearby Areas
              </CardTitle>
              <CardDescription>
                Check medicine availability at local pharmacies in Nabha city and surrounding areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {mockPharmacies.map((pharmacy, index) => (
                  <Card key={pharmacy.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">{pharmacy.name}</h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-600">{pharmacy.rating}</span>
                          <span className="text-yellow-500 text-sm">★</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span>{pharmacy.distance} away</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{pharmacy.phone}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Available Medicines:</p>
                        <div className="flex flex-wrap gap-1">
                          {pharmacy.medicines.map(medicineId => {
                            const medicine = mockMedicines.find(m => m.id === medicineId);
                            return (
                              <Badge key={medicineId} variant="outline" className="text-xs">
                                {medicine?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Medicine Request Modal */}
      {showRequestForm && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Medicine</CardTitle>
              <CardDescription>
                Request {selectedMedicine.name} from ASHA worker
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRequestSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <textarea
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Any specific requirements or notes..."
                  />
                </div>
              </CardContent>
              <div className="flex space-x-2 p-6 pt-0">
                <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

// Export the component with authentication wrapper
export default withAuth(MedicineTrackerPage, ['Patient']);
