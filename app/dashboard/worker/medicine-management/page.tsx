'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Pill, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Phone,
  Mail,
  Filter,
  RefreshCw,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';

// Mock medicine requests data - in a real app, this would come from an API
const mockMedicineRequests = [
  {
    id: 1,
    patientId: 'patient1',
    patientName: 'John Doe',
    patientPhone: '+91-9876543210',
    patientEmail: 'john@example.com',
    medicineId: 1,
    medicineName: 'Paracetamol 500mg',
    quantity: 2,
    notes: 'Need for fever relief',
    status: 'Pending',
    requestedAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    ashaWorkerNotes: ''
  },
  {
    id: 2,
    patientId: 'patient2',
    patientName: 'Jane Smith',
    patientPhone: '+91-9876543211',
    patientEmail: 'jane@example.com',
    medicineId: 2,
    medicineName: 'Amoxicillin 250mg',
    quantity: 1,
    notes: 'Prescribed by Dr. Johnson',
    status: 'Requested from pharmacy',
    requestedAt: '2024-02-14T14:20:00Z',
    updatedAt: '2024-02-15T09:15:00Z',
    ashaWorkerNotes: 'Contacted Apollo Pharmacy, waiting for confirmation'
  },
  {
    id: 3,
    patientId: 'patient3',
    patientName: 'Mike Johnson',
    patientPhone: '+91-9876543212',
    patientEmail: 'mike@example.com',
    medicineId: 3,
    medicineName: 'Metformin 500mg',
    quantity: 3,
    notes: 'Monthly supply needed',
    status: 'In transit',
    requestedAt: '2024-02-13T16:45:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
    ashaWorkerNotes: 'Medicine dispatched from MedPlus Pharmacy, ETA 2 hours'
  },
  {
    id: 4,
    patientId: 'patient4',
    patientName: 'Sarah Wilson',
    patientPhone: '+91-9876543213',
    patientEmail: 'sarah@example.com',
    medicineId: 4,
    medicineName: 'Lisinopril 10mg',
    quantity: 1,
    notes: 'Urgent requirement',
    status: 'Available',
    requestedAt: '2024-02-12T08:15:00Z',
    updatedAt: '2024-02-15T13:20:00Z',
    ashaWorkerNotes: 'Medicine ready for pickup at Wellness Pharmacy'
  },
  {
    id: 5,
    patientId: 'patient5',
    patientName: 'David Brown',
    patientPhone: '+91-9876543214',
    patientEmail: 'david@example.com',
    medicineId: 5,
    medicineName: 'Omeprazole 20mg',
    quantity: 2,
    notes: 'For acid reflux',
    status: 'Not available',
    requestedAt: '2024-02-11T12:30:00Z',
    updatedAt: '2024-02-15T10:45:00Z',
    ashaWorkerNotes: 'Checked all nearby pharmacies, medicine not available. Suggested alternative: Pantoprazole'
  }
];

// Simplified status options for ASHA workers
const statusOptions = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Available', label: 'Available', color: 'bg-green-100 text-green-800' },
  { value: 'Not available', label: 'Not Available', color: 'bg-red-100 text-red-800' }
];

function MedicineManagementPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockMedicineRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockMedicineRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [workerNotes, setWorkerNotes] = useState('');

  // Load requests from localStorage on component mount
  useEffect(() => {
    const loadRequests = () => {
      try {
        const storedRequests = localStorage.getItem('medicineRequests');
        if (storedRequests) {
          const parsedRequests = JSON.parse(storedRequests);
          // Filter to only show out-of-stock requests
          const outOfStockRequests = parsedRequests.filter(request => request.isOutOfStock === true);
          setRequests(outOfStockRequests);
          setFilteredRequests(outOfStockRequests);
        } else {
          // If no stored requests, show empty array
          setRequests([]);
          setFilteredRequests([]);
        }
      } catch (error) {
        console.error('Error loading requests from localStorage:', error);
        setRequests([]);
        setFilteredRequests([]);
      }
    };

    loadRequests();
    
    // Set up interval to check for new requests
    const interval = setInterval(loadRequests, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter requests based on search term and status
  useEffect(() => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(request =>
        request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  // Handle status update
  const handleStatusUpdate = (requestId: number, newStatus: string, notes: string) => {
    // Get all requests from localStorage
    const allStoredRequests = JSON.parse(localStorage.getItem('medicineRequests') || '[]');
    
    // Update the specific request
    const updatedAllRequests = allStoredRequests.map((request: any) =>
      request.id === requestId
        ? {
            ...request,
            status: newStatus,
            ashaWorkerNotes: notes,
            updatedAt: new Date().toISOString()
          }
        : request
    );
    
    // Update localStorage with all requests
    try {
      localStorage.setItem('medicineRequests', JSON.stringify(updatedAllRequests));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    // Update local state with only out-of-stock requests
    const outOfStockRequests = updatedAllRequests.filter((request: any) => request.isOutOfStock === true);
    setRequests(outOfStockRequests);
    
    setShowUpdateModal(false);
    setSelectedRequest(null);
    setNewStatus('');
    setWorkerNotes('');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return <Badge variant="secondary">{status}</Badge>;
    
    return (
      <Badge className={`${statusOption.color} hover:${statusOption.color} flex items-center`}>
        {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'Available' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'Not available' && <XCircle className="w-3 h-3 mr-1" />}
        {statusOption.label}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get request priority based on status and age
  const getRequestPriority = (request: any) => {
    const daysSinceRequest = Math.floor(
      (new Date().getTime() - new Date(request.requestedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (request.status === 'Pending' && daysSinceRequest > 1) return 'high';
    if (request.status === 'Requested from pharmacy' && daysSinceRequest > 2) return 'high';
    if (request.status === 'In transit' && daysSinceRequest > 3) return 'medium';
    return 'low';
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
                <h1 className="text-3xl font-bold text-gray-900">Out-of-Stock Medicine Requests</h1>
                <p className="text-gray-600 mt-1">Manage patient requests for out-of-stock medicines</p>
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
        {/* Search and Filter Section */}
        <div className={`mb-8 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filter & Search Out-of-Stock Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by patient name, medicine, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {statusOptions.map((option, index) => {
            const count = requests.filter(req => req.status === option.value).length;
            return (
              <Card key={option.value} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{option.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center`}>
                      {option.value === 'Pending' && <Clock className="w-4 h-4" />}
                      {option.value === 'Available' && <CheckCircle className="w-4 h-4" />}
                      {option.value === 'Not available' && <XCircle className="w-4 h-4" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Medicine Requests List */}
        <div className={`transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-600" />
                  Out-of-Stock Medicine Requests ({filteredRequests.length})
                </span>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.map((request, index) => {
                  const priority = getRequestPriority(request);
                  return (
                    <Card 
                      key={request.id} 
                      className={`hover:shadow-md transition-all duration-300 ${
                        priority === 'high' ? 'border-l-4 border-red-500' : 
                        priority === 'medium' ? 'border-l-4 border-yellow-500' : 
                        'border-l-4 border-gray-200'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.patientName}</h4>
                            <p className="text-sm text-gray-600">{request.medicineName}</p>
                            {request.isOutOfStock && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(request.status)}
                            {priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Quantity</p>
                            <p className="text-gray-900">{request.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Requested</p>
                            <p className="text-gray-900">{formatDate(request.requestedAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Last Updated</p>
                            <p className="text-gray-900">{formatDate(request.updatedAt)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Contact</p>
                            <div className="flex space-x-2">
                              <a href={`tel:${request.patientPhone}`} className="text-blue-600 hover:text-blue-800">
                                <Phone className="w-4 h-4" />
                              </a>
                              <a href={`mailto:${request.patientEmail}`} className="text-blue-600 hover:text-blue-800">
                                <Mail className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">Patient Notes:</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{request.notes}</p>
                          </div>
                        )}

                        {request.ashaWorkerNotes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">Your Notes:</p>
                            <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{request.ashaWorkerNotes}</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => {
                              setSelectedRequest(request);
                              setNewStatus(request.status);
                              setWorkerNotes(request.ashaWorkerNotes);
                              setShowUpdateModal(true);
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Update Status
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Patient
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <Pill className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Update Status Modal */}
      {showUpdateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Update Request Status</CardTitle>
              <CardDescription>
                Update status for {selectedRequest.medicineName} request from {selectedRequest.patientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={workerNotes}
                  onChange={(e) => setWorkerNotes(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Add notes about the status update..."
                />
              </div>
            </CardContent>
            <div className="flex space-x-2 p-6 pt-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowUpdateModal(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleStatusUpdate(selectedRequest.id, newStatus, workerNotes)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Update Status
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Export the component with authentication wrapper
export default withAuth(MedicineManagementPage, ['Worker']);
