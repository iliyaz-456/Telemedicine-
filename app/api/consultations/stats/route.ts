import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/backend/utils/mongodb';
import Consultation from '@/backend/models/Consultation';

/**
 * GET /api/consultations/stats
 * Get consultation statistics
 * 
 * Response:
 * - 200: Statistics retrieved successfully
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
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

    // Get recent consultations
    const recentConsultations = await Consultation.find()
      .sort({ startTime: -1 })
      .limit(10)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .select('consultationType status startTime patientId doctorId');

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
      },
      recentConsultations
    });

  } catch (error) {
    console.error('❌ Error fetching consultation stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


