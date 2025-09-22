'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BackToDashboardButton } from '@/components/ui/back-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  Users, 
  MessageSquare, 
  Send,
  Bell,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  MapPin,
  User,
  Phone
} from 'lucide-react';

// Mock data for disease updates from doctors
const mockDiseaseUpdates = [
  {
    id: 'update1',
    diseaseName: 'Malaria',
    casesDetected: 3,
    reportDate: '2024-02-15',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Infectious Diseases',
    severity: 'Medium',
    location: 'Village A',
    notes: 'Cases detected in the northern part of the village. Patients are responding well to treatment.',
    status: 'Active',
    priority: 'High',
    symptoms: ['Fever', 'Chills', 'Headache', 'Body aches'],
    precautions: ['Use mosquito nets', 'Apply repellent', 'Eliminate standing water', 'Wear long sleeves'],
    treatmentStatus: 'Under treatment',
    lastUpdated: '2024-02-15T10:30:00Z'
  },
  {
    id: 'update2',
    diseaseName: 'Dengue',
    casesDetected: 2,
    reportDate: '2024-02-14',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialty: 'Internal Medicine',
    severity: 'High',
    location: 'Village B',
    notes: 'Two confirmed cases with severe symptoms. Immediate vector control measures required.',
    status: 'Active',
    priority: 'Critical',
    symptoms: ['High fever', 'Severe headache', 'Joint pain', 'Rash'],
    precautions: ['Eliminate mosquito breeding sites', 'Use mosquito nets', 'Apply repellent', 'Seek immediate medical help if symptoms worsen'],
    treatmentStatus: 'Hospitalized',
    lastUpdated: '2024-02-14T15:45:00Z'
  },
  {
    id: 'update3',
    diseaseName: 'Chikungunya',
    casesDetected: 1,
    reportDate: '2024-02-13',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'General Medicine',
    severity: 'Low',
    location: 'Village C',
    notes: 'Single case with mild symptoms. Patient is recovering well.',
    status: 'Resolved',
    priority: 'Medium',
    symptoms: ['Fever', 'Joint pain', 'Muscle pain', 'Headache'],
    precautions: ['Use mosquito nets', 'Apply repellent', 'Rest and stay hydrated'],
    treatmentStatus: 'Recovered',
    lastUpdated: '2024-02-13T09:15:00Z'
  },
  {
    id: 'update4',
    diseaseName: 'Typhoid',
    casesDetected: 4,
    reportDate: '2024-02-12',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialty: 'Gastroenterology',
    severity: 'Medium',
    location: 'Village D',
    notes: 'Multiple cases linked to contaminated water source. Water treatment advised.',
    status: 'Active',
    priority: 'High',
    symptoms: ['High fever', 'Stomach pain', 'Headache', 'Loss of appetite'],
    precautions: ['Drink only boiled/treated water', 'Maintain hygiene', 'Avoid street food', 'Wash hands frequently'],
    treatmentStatus: 'Under treatment',
    lastUpdated: '2024-02-12T14:20:00Z'
  },
  {
    id: 'update5',
    diseaseName: 'Cholera',
    casesDetected: 1,
    reportDate: '2024-02-11',
    doctorName: 'Dr. Anita Patel',
    doctorSpecialty: 'Infectious Diseases',
    severity: 'High',
    location: 'Village E',
    notes: 'Single case with severe dehydration. Immediate rehydration therapy administered.',
    status: 'Resolved',
    priority: 'Critical',
    symptoms: ['Severe diarrhea', 'Vomiting', 'Dehydration', 'Muscle cramps'],
    precautions: ['Drink only safe water', 'Maintain hygiene', 'Cook food thoroughly', 'Avoid raw vegetables'],
    treatmentStatus: 'Recovered',
    lastUpdated: '2024-02-11T16:30:00Z'
  }
];

// Mock data for village contacts
const mockVillageContacts = [
  {
    id: 'contact1',
    villageName: 'Village A',
    contactPerson: 'Village Head - Ram Singh',
    phoneNumber: '+91-9876543210',
    whatsappNumber: '+91-9876543210',
    isActive: true
  },
  {
    id: 'contact2',
    villageName: 'Village B',
    contactPerson: 'Village Head - Sita Devi',
    phoneNumber: '+91-9876543211',
    whatsappNumber: '+91-9876543211',
    isActive: true
  },
  {
    id: 'contact3',
    villageName: 'Village C',
    contactPerson: 'Village Head - Gopal Yadav',
    phoneNumber: '+91-9876543212',
    whatsappNumber: '+91-9876543212',
    isActive: true
  },
  {
    id: 'contact4',
    villageName: 'Village D',
    contactPerson: 'Village Head - Meera Kumari',
    phoneNumber: '+91-9876543213',
    whatsappNumber: '+91-9876543213',
    isActive: true
  },
  {
    id: 'contact5',
    villageName: 'Village E',
    contactPerson: 'Village Head - Krishna Prasad',
    phoneNumber: '+91-9876543214',
    whatsappNumber: '+91-9876543214',
    isActive: true
  }
];

function DiseaseUpdatesPage() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState(mockDiseaseUpdates);
  const [filteredUpdates, setFilteredUpdates] = useState(mockDiseaseUpdates);
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  // Trigger animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter updates based on search term and filters
  useEffect(() => {
    let filtered = updates;

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(update =>
        update.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by disease type
    if (diseaseFilter !== 'all') {
      filtered = filtered.filter(update => update.diseaseName === diseaseFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(update => update.status === statusFilter);
    }

    setFilteredUpdates(filtered);
  }, [searchTerm, diseaseFilter, statusFilter, updates]);

  // Get unique disease names for filter
  const diseaseNames = [...new Set(updates.map(update => update.diseaseName))];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center"><Activity className="w-3 h-3 mr-1" />Active</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center"><Shield className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive" className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center"><Clock className="w-3 h-3 mr-1" />Medium</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">{severity}</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{severity}</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Handle notify village
  const handleNotifyVillage = (update: any) => {
    setSelectedUpdate(update);
    setNotificationMessage(`Alert: ${update.casesDetected} ${update.diseaseName} case${update.casesDetected > 1 ? 's' : ''} detected in ${update.location}. Please take necessary precautions.`);
    setShowNotificationModal(true);
  };

  // Send WhatsApp notification
  const sendWhatsAppNotification = () => {
    if (!selectedUpdate || !selectedVillage) return;

    const villageContact = mockVillageContacts.find(contact => contact.id === selectedVillage);
    if (!villageContact) return;

    const whatsappMessage = encodeURIComponent(notificationMessage);
    const whatsappUrl = `https://wa.me/${villageContact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowNotificationModal(false);
    setSelectedUpdate(null);
    setNotificationMessage('');
    setSelectedVillage('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToDashboardButton userRole="Worker" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Disease Updates</h1>
                <p className="text-gray-600 mt-1">Monitor disease outbreaks and notify villages</p>
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
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Disease Monitoring & Alerts
              </CardTitle>
              <CardDescription>
                Stay updated on disease outbreaks and notify affected villages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search diseases, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Disease Filter */}
                <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by disease" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diseases</SelectItem>
                    {diseaseNames.map(disease => (
                      <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setDiseaseFilter('all');
                    setStatusFilter('all');
                  }}
                  className="flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Updates</p>
                  <p className="text-2xl font-bold text-gray-900">{updates.length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-red-600">
                    {updates.filter(u => u.status === 'Active').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Priority</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {updates.filter(u => u.priority === 'Critical').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Search Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredUpdates.length}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disease Updates */}
        <div className={`transition-all duration-700 delay-400 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-red-600" />
                Disease Updates ({filteredUpdates.length})
              </CardTitle>
              <CardDescription>
                Latest disease outbreak reports from doctors in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUpdates.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No updates found</h3>
                  <p className="text-gray-600">
                    {searchTerm || diseaseFilter !== 'all' || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria.' 
                      : 'No disease updates available at the moment.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredUpdates.map((update, index) => (
                    <Card 
                      key={update.id} 
                      className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 ${
                        update.priority === 'Critical' ? 'border-red-500' :
                        update.priority === 'High' ? 'border-orange-500' :
                        'border-blue-500'
                      } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              update.priority === 'Critical' ? 'bg-red-100' :
                              update.priority === 'High' ? 'bg-orange-100' :
                              'bg-blue-100'
                            }`}>
                              <AlertTriangle className={`w-6 h-6 ${
                                update.priority === 'Critical' ? 'text-red-600' :
                                update.priority === 'High' ? 'text-orange-600' :
                                'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{update.diseaseName}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {update.location} • {update.casesDetected} case{update.casesDetected > 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            {getPriorityBadge(update.priority)}
                            {getStatusBadge(update.status)}
                            {getSeverityBadge(update.severity)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Doctor Information */}
                        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Reported by:</span>
                            <span className="text-sm text-gray-900">{update.doctorName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Date:</span>
                            <span className="text-sm text-gray-900">{formatDate(update.reportDate)}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Doctor's Notes:</h4>
                          <p className="text-gray-700">{update.notes}</p>
                        </div>

                        {/* Symptoms and Precautions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                            <div className="flex flex-wrap gap-1">
                              {update.symptoms.map((symptom: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">{symptom}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Precautions:</h4>
                            <div className="flex flex-wrap gap-1">
                              {update.precautions.map((precaution: string, idx: number) => (
                                <Badge key={idx} className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">{precaution}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Treatment Status */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Treatment Status:</span>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{update.treatmentStatus}</Badge>
                          </div>
                          <Button 
                            onClick={() => handleNotifyVillage(update)}
                            className="bg-green-600 hover:bg-green-700 flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Notify Village
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Notify Village
            </DialogTitle>
            <DialogDescription>
              Send a WhatsApp message to the village about the disease outbreak
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Disease Info */}
            {selectedUpdate && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{selectedUpdate.diseaseName} Alert</h4>
                <p className="text-sm text-gray-600">
                  {selectedUpdate.casesDetected} case{selectedUpdate.casesDetected > 1 ? 's' : ''} detected in {selectedUpdate.location}
                </p>
              </div>
            )}

            {/* Village Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Village:</label>
              <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose village to notify" />
                </SelectTrigger>
                <SelectContent>
                  {mockVillageContacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.villageName} - {contact.contactPerson}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message Editor */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Message:</label>
              <Textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNotificationModal(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendWhatsAppNotification}
              disabled={!selectedVillage || !notificationMessage.trim()}
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Send WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Export the component with authentication wrapper
export default withAuth(DiseaseUpdatesPage, ['Worker']);



