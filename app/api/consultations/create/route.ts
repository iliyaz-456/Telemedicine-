import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/backend/utils/mongodb';
import Consultation from '@/backend/models/Consultation';
import { AuthUtils } from '@/backend/utils/auth';

/**
 * POST /api/consultations/create
 * Creates a new consultation record
 * 
 * Request Body:
 * - consultationType: 'video' | 'missed_call'
 * - symptoms?: string[]
 * - notes?: string
 * 
 * Response:
 * - 201: Consultation created successfully
 * - 400: Invalid request data
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Consultation creation API called');

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token
    const decoded = AuthUtils.verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('📦 Request body:', body);

    const { consultationType, symptoms, notes } = body;

    // Validate required fields
    if (!consultationType) {
      return NextResponse.json(
        { error: 'Consultation type is required' },
        { status: 400 }
      );
    }

    // Validate consultation type
    const validTypes = ['video', 'missed_call'];
    if (!validTypes.includes(consultationType)) {
      return NextResponse.json(
        { error: 'Invalid consultation type. Must be one of: video, missed_call' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected');

    // Create consultation record
    const consultationData = {
      patientId: decoded.userId,
      consultationType,
      status: 'pending' as const,
      startTime: new Date(),
      symptoms: symptoms || [],
      notes: notes || ''
    };

    console.log('📝 Creating consultation record:', consultationData);

    const consultation = new Consultation(consultationData);
    const savedConsultation = await consultation.save();

    console.log('✅ Consultation created successfully:', savedConsultation._id);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Consultation created successfully',
        consultation: {
          id: savedConsultation._id,
          consultationType: savedConsultation.consultationType,
          status: savedConsultation.status,
          startTime: savedConsultation.startTime,
          patientId: savedConsultation.patientId
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating consultation:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: 'Validation error: ' + error.message },
          { status: 400 }
        );
      }
      
      if (error.name === 'CastError') {
        return NextResponse.json(
          { error: 'Invalid data format' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/consultations/create
 * Get consultation statistics (for testing/debugging)
 */
export async function GET() {
  try {
    console.log('📊 Consultation stats API called');

    // Connect to database
    await connectToDatabase();

    // Get consultation statistics
    const totalConsultations = await Consultation.countDocuments();
    const pendingConsultations = await Consultation.countDocuments({ status: 'pending' });
    const ongoingConsultations = await Consultation.countDocuments({ status: 'ongoing' });
    const completedConsultations = await Consultation.countDocuments({ status: 'completed' });

    const videoConsultations = await Consultation.countDocuments({ consultationType: 'video' });
    const missedCallConsultations = await Consultation.countDocuments({ consultationType: 'missed_call' });

    return NextResponse.json({
      success: true,
      stats: {
        total: totalConsultations,
        byStatus: {
          pending: pendingConsultations,
          ongoing: ongoingConsultations,
          completed: completedConsultations
        },
        byType: {
          video: videoConsultations,
          missed_call: missedCallConsultations
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching consultation stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


