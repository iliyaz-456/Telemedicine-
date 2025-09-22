import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/backend/utils/mongodb';
import Consultation from '@/backend/models/Consultation';
import { AuthUtils } from '@/backend/utils/auth';

/**
 * GET /api/doctor/medical-records
 * Get medical records for a specific doctor
 * 
 * Query Parameters:
 * - doctorId: ID of the doctor (optional, defaults to authenticated user)
 * - search: Search term for filtering records (optional)
 * - status: Filter by consultation status (optional)
 * - limit: Number of records to return (optional, default: 50)
 * - offset: Number of records to skip (optional, default: 0)
 * 
 * Response:
 * - 200: Records retrieved successfully
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📋 Doctor medical records API called');

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

    // Check if user is a doctor
    if (decoded.role !== 'Doctor') {
      return NextResponse.json(
        { error: 'Access denied. Only doctors can access medical records.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId') || decoded.userId;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected');

    // Build query filter
    const filter: any = { doctorId: doctorId };
    
    if (status) {
      filter.status = status;
    }

    // Get consultations for this doctor
    const consultations = await Consultation.find(filter)
      .populate('patientId', 'name email phone address age gender')
      .populate('doctorId', 'name email specialization')
      .sort({ startTime: -1 })
      .limit(limit)
      .skip(offset);

    // Filter by search term if provided
    let filteredConsultations = consultations;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredConsultations = consultations.filter(consultation => {
        const patient = consultation.patientId as any;
        return (
          patient?.name?.toLowerCase().includes(searchLower) ||
          consultation.diagnosis?.toLowerCase().includes(searchLower) ||
          consultation.symptoms?.some((symptom: string) => 
            symptom.toLowerCase().includes(searchLower)
          ) ||
          consultation.notes?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Get total count for pagination
    const totalCount = await Consultation.countDocuments(filter);

    // Format response data
    const formattedRecords = filteredConsultations.map(consultation => {
      const patient = consultation.patientId as any;
      const doctor = consultation.doctorId as any;
      
      return {
        id: consultation._id,
        patientId: patient?._id,
        patientName: patient?.name || 'Unknown Patient',
        patientEmail: patient?.email || '',
        patientPhone: patient?.phone || '',
        patientAddress: patient?.address || '',
        patientAge: patient?.age || null,
        patientGender: patient?.gender || null,
        doctorName: doctor?.name || 'Dr. Unknown',
        doctorSpecialization: doctor?.specialization || '',
        consultationDate: consultation.startTime,
        consultationType: consultation.consultationType,
        status: consultation.status,
        symptoms: consultation.symptoms || [],
        diagnosis: consultation.diagnosis || '',
        prescription: consultation.prescription || '',
        notes: consultation.notes || '',
        followUpRequired: consultation.followUpRequired || false,
        followUpDate: consultation.followUpDate || null,
        duration: consultation.duration || null,
        endTime: consultation.endTime || null
      };
    });

    console.log(`✅ Retrieved ${formattedRecords.length} medical records for doctor ${doctorId}`);

    return NextResponse.json({
      success: true,
      records: formattedRecords,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('❌ Error fetching doctor medical records:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/doctor/medical-records
 * Update a medical record (only if it belongs to the doctor)
 * 
 * Request Body:
 * - recordId: ID of the record to update
 * - diagnosis: Updated diagnosis
 * - prescription: Updated prescription
 * - notes: Updated notes
 * - followUpRequired: Whether follow-up is required
 * - followUpDate: Follow-up date if required
 * 
 * Response:
 * - 200: Record updated successfully
 * - 401: Unauthorized
 * - 403: Access denied (record doesn't belong to doctor)
 * - 404: Record not found
 * - 500: Server error
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('📝 Update medical record API called');

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

    // Check if user is a doctor
    if (decoded.role !== 'Doctor') {
      return NextResponse.json(
        { error: 'Access denied. Only doctors can update medical records.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { recordId, diagnosis, prescription, notes, followUpRequired, followUpDate } = body;

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the record and verify it belongs to this doctor
    const record = await Consultation.findById(recordId);
    if (!record) {
      return NextResponse.json(
        { error: 'Medical record not found' },
        { status: 404 }
      );
    }

    // Check if the record belongs to this doctor
    if (record.doctorId?.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied. You can only update your own medical records.' },
        { status: 403 }
      );
    }

    // Update the record
    const updateData: any = {};
    if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
    if (prescription !== undefined) updateData.prescription = prescription;
    if (notes !== undefined) updateData.notes = notes;
    if (followUpRequired !== undefined) updateData.followUpRequired = followUpRequired;
    if (followUpDate !== undefined) updateData.followUpDate = followUpDate;

    const updatedRecord = await Consultation.findByIdAndUpdate(
      recordId,
      updateData,
      { new: true }
    ).populate('patientId', 'name email phone address age gender')
     .populate('doctorId', 'name email specialization');

    console.log(`✅ Updated medical record ${recordId} for doctor ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Medical record updated successfully',
      record: {
        id: updatedRecord._id,
        patientId: (updatedRecord.patientId as any)?._id,
        patientName: (updatedRecord.patientId as any)?.name || 'Unknown Patient',
        patientEmail: (updatedRecord.patientId as any)?.email || '',
        patientPhone: (updatedRecord.patientId as any)?.phone || '',
        patientAddress: (updatedRecord.patientId as any)?.address || '',
        doctorName: (updatedRecord.doctorId as any)?.name || 'Dr. Unknown',
        consultationDate: updatedRecord.startTime,
        consultationType: updatedRecord.consultationType,
        status: updatedRecord.status,
        symptoms: updatedRecord.symptoms || [],
        diagnosis: updatedRecord.diagnosis || '',
        prescription: updatedRecord.prescription || '',
        notes: updatedRecord.notes || '',
        followUpRequired: updatedRecord.followUpRequired || false,
        followUpDate: updatedRecord.followUpDate || null
      }
    });

  } catch (error) {
    console.error('❌ Error updating medical record:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
