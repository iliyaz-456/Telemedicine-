import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../backend/utils/mongodb';
import User from '../../../../backend/models/User';
import { AuthUtils } from '../../../../backend/utils/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('🔥 Signup API called');
    
    // Parse request body
    const body = await req.json();
    console.log('📦 Request body:', { ...body, password: '[HIDDEN]' });
    
    const { name, email, password, role, phone, address, ...roleSpecificData } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!AuthUtils.validateEmail(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = AuthUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log('❌ Password validation failed:', passwordValidation.errors);
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Validate role
    if (!['Patient', 'Doctor', 'Worker'].includes(role)) {
      console.log('❌ Invalid role:', role);
      return NextResponse.json(
        { error: 'Invalid role. Must be Patient, Doctor, or Worker' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Prepare user data based on role
    const userData: any = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      address,
    };

    // Add role-specific fields
    if (role === 'Patient') {
      userData.age = roleSpecificData.age;
      userData.gender = roleSpecificData.gender;
      userData.medicalHistory = roleSpecificData.medicalHistory || [];
    } else if (role === 'Doctor') {
      userData.specialization = roleSpecificData.specialization;
      userData.licenseNumber = roleSpecificData.licenseNumber;
      userData.experience = roleSpecificData.experience;
    } else if (role === 'Worker') {
      userData.workerId = roleSpecificData.workerId;
      userData.location = roleSpecificData.location;
    }

    // Create new user
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = AuthUtils.generateToken({
      userId: savedUser._id.toString(),
      email: savedUser.email,
      role: savedUser.role,
    });

    // Return success response (excluding password)
    const userResponse = savedUser.toJSON();
    
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userResponse,
        token,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('🚨 Signup API Error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    if (error instanceof Error) {
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        console.error('❌ Mongoose Validation Error:', error.message);
        return NextResponse.json(
          { error: 'Validation failed', details: error.message },
          { status: 400 }
        );
      }
      
      // Handle MongoDB connection errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
        console.error('❌ Database Connection Error:', error.message);
        return NextResponse.json(
          { error: 'Database connection failed', details: 'Please check MongoDB configuration' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}