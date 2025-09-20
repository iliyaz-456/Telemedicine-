import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../backend/utils/mongodb';
import User from '../../../../backend/models/User';
import { AuthUtils } from '../../../../backend/utils/auth';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!AuthUtils.validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user by email (including password for authentication)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = AuthUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return success response (excluding password)
    const userResponse = user.toJSON();

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
        token,
        redirectUrl: getRedirectUrl(user.role),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine redirect URL based on user role
function getRedirectUrl(role: string): string {
  switch (role) {
    case 'Patient':
      return '/dashboard/patient';
    case 'Doctor':
      return '/dashboard/doctor';
    case 'Worker':
      return '/dashboard/worker';
    default:
      return '/dashboard';
  }
}