import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../backend/utils/mongodb';
import User from '../../../../backend/models/User';
import { AuthMiddleware } from '../../../../backend/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const authError = await AuthMiddleware.requireAuth(req);
    if (authError) return authError;

    // Get user info from token
    const authResult = await AuthMiddleware.verifyAuth(req);
    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user details
    const user = await User.findById(authResult.user.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user profile (password excluded by default)
    return NextResponse.json(
      {
        user: user.toJSON(),
        role: user.role,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}