import { NextRequest, NextResponse } from 'next/server';
import { generateRoomId, generateRoomCode } from '@/lib/video-utils';

// Types for queue management
interface Patient {
  id: string;
  name: string;
  patientId: string;
  status: 'Ready' | 'Waiting' | 'In Consultation';
  appointmentTime: string;
  phone: string;
  email: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  meetingId?: string;
  meetingCode?: string;
  doctorId?: string;
  createdAt: string;
  updatedAt: string;
}

interface QueueResponse {
  success: boolean;
  patients?: Patient[];
  patient?: Patient;
  error?: string;
}

// Demo patient queue data (in a real app, this would come from MongoDB)
const demoPatients: Patient[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    patientId: 'PAT001',
    status: 'Ready',
    appointmentTime: '10:00 AM',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    reason: 'Routine Checkup',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Priya Sharma',
    patientId: 'PAT002',
    status: 'Waiting',
    appointmentTime: '10:30 AM',
    phone: '+91 98765 43211',
    email: 'priya.sharma@email.com',
    reason: 'Follow-up Consultation',
    priority: 'High',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Amit Patel',
    patientId: 'PAT003',
    status: 'Waiting',
    appointmentTime: '11:00 AM',
    phone: '+91 98765 43212',
    email: 'amit.patel@email.com',
    reason: 'Chest Pain',
    priority: 'High',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Sunita Devi',
    patientId: 'PAT004',
    status: 'Waiting',
    appointmentTime: '11:30 AM',
    phone: '+91 98765 43213',
    email: 'sunita.devi@email.com',
    reason: 'General Consultation',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vikram Singh',
    patientId: 'PAT005',
    status: 'Waiting',
    appointmentTime: '12:00 PM',
    phone: '+91 98765 43214',
    email: 'vikram.singh@email.com',
    reason: 'Blood Pressure Check',
    priority: 'Low',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Meera Joshi',
    patientId: 'PAT006',
    status: 'Waiting',
    appointmentTime: '12:30 PM',
    phone: '+91 98765 43215',
    email: 'meera.joshi@email.com',
    reason: 'Diabetes Management',
    priority: 'High',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Arjun Reddy',
    patientId: 'PAT007',
    status: 'Waiting',
    appointmentTime: '1:00 PM',
    phone: '+91 98765 43216',
    email: 'arjun.reddy@email.com',
    reason: 'Skin Rash',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Kavita Gupta',
    patientId: 'PAT008',
    status: 'Waiting',
    appointmentTime: '1:30 PM',
    phone: '+91 98765 43217',
    email: 'kavita.gupta@email.com',
    reason: 'Pregnancy Checkup',
    priority: 'High',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Rohit Malhotra',
    patientId: 'PAT009',
    status: 'Waiting',
    appointmentTime: '2:00 PM',
    phone: '+91 98765 43218',
    email: 'rohit.malhotra@email.com',
    reason: 'Back Pain',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Sneha Iyer',
    patientId: 'PAT010',
    status: 'Waiting',
    appointmentTime: '2:30 PM',
    phone: '+91 98765 43219',
    email: 'sneha.iyer@email.com',
    reason: 'Allergy Consultation',
    priority: 'Low',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Deepak Verma',
    patientId: 'PAT011',
    status: 'Waiting',
    appointmentTime: '3:00 PM',
    phone: '+91 98765 43220',
    email: 'deepak.verma@email.com',
    reason: 'Fever & Cold',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Anita Desai',
    patientId: 'PAT012',
    status: 'Waiting',
    appointmentTime: '3:30 PM',
    phone: '+91 98765 43221',
    email: 'anita.desai@email.com',
    reason: 'Heart Palpitations',
    priority: 'High',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Manoj Tiwari',
    patientId: 'PAT013',
    status: 'Waiting',
    appointmentTime: '4:00 PM',
    phone: '+91 98765 43222',
    email: 'manoj.tiwari@email.com',
    reason: 'Joint Pain',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Pooja Agarwal',
    patientId: 'PAT014',
    status: 'Waiting',
    appointmentTime: '4:30 PM',
    phone: '+91 98765 43223',
    email: 'pooja.agarwal@email.com',
    reason: 'Weight Loss Consultation',
    priority: 'Low',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '15',
    name: 'Ravi Nair',
    patientId: 'PAT015',
    status: 'Waiting',
    appointmentTime: '5:00 PM',
    phone: '+91 98765 43224',
    email: 'ravi.nair@email.com',
    reason: 'Sleep Disorder',
    priority: 'Medium',
    meetingId: generateRoomId(),
    meetingCode: generateRoomCode(),
    doctorId: 'doctor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// In-memory storage for demo (in production, use MongoDB)
let patientQueue: Patient[] = [...demoPatients];

/**
 * GET /api/queue
 * Get all patients in the queue for a specific doctor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, show mock data for any doctor
    // In production, this would filter by actual doctor ID
    const doctorPatients = patientQueue.map(patient => ({
      ...patient,
      doctorId: doctorId // Update the doctorId to match the logged-in doctor
    }));

    // Sort by priority and appointment time
    const sortedPatients = doctorPatients.sort((a, b) => {
      // Priority order: High > Medium > Low
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // If same priority, sort by appointment time
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

    const response: QueueResponse = {
      success: true,
      patients: sortedPatients
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Queue API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/queue
 * Add a new patient to the queue
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, patientId, appointmentTime, phone, email, reason, priority, doctorId } = body;

    // Validate required fields
    if (!name || !patientId || !appointmentTime || !doctorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if patient already exists - for demo purposes, check by patientId only
    // In production, this would also check doctorId
    const existingPatient = patientQueue.find(p => p.patientId === patientId);
    if (existingPatient) {
      return NextResponse.json(
        { success: false, error: 'Patient already in queue' },
        { status: 409 }
      );
    }

    // Create new patient
    const newPatient: Patient = {
      id: (patientQueue.length + 1).toString(),
      name,
      patientId,
      status: 'Waiting',
      appointmentTime,
      phone: phone || '',
      email: email || '',
      reason: reason || 'General Consultation',
      priority: priority || 'Medium',
      meetingId: generateRoomId(),
      meetingCode: generateRoomCode(),
      doctorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to queue
    patientQueue.push(newPatient);

    const response: QueueResponse = {
      success: true,
      patient: newPatient
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Queue API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/queue
 * Update patient status or information
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, status, doctorId } = body;

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID and Doctor ID are required' },
        { status: 400 }
      );
    }

    // Find patient in queue - for demo purposes, find by patientId only
    // In production, this would also check doctorId
    const patientIndex = patientQueue.findIndex(p => p.patientId === patientId);
    
    if (patientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Patient not found in queue' },
        { status: 404 }
      );
    }

    // Update patient
    const updatedPatient = {
      ...patientQueue[patientIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    patientQueue[patientIndex] = updatedPatient;

    const response: QueueResponse = {
      success: true,
      patient: updatedPatient
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Queue API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/queue
 * Remove patient from queue
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    if (!patientId || !doctorId) {
      return NextResponse.json(
        { success: false, error: 'Patient ID and Doctor ID are required' },
        { status: 400 }
      );
    }

    // Find and remove patient - for demo purposes, find by patientId only
    // In production, this would also check doctorId
    const patientIndex = patientQueue.findIndex(p => p.patientId === patientId);
    
    if (patientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Patient not found in queue' },
        { status: 404 }
      );
    }

    const removedPatient = patientQueue.splice(patientIndex, 1)[0];

    const response: QueueResponse = {
      success: true,
      patient: removedPatient
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Queue API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
