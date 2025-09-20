import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils, TokenPayload } from '../utils/auth';
import connectDB from '../utils/mongodb';
import User from '../models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export class AuthMiddleware {
  // Verify authentication token
  static async verifyAuth(req: NextRequest): Promise<{ isValid: boolean; user?: TokenPayload; error?: string }> {
    try {
      const authHeader = req.headers.get('authorization');
      const token = AuthUtils.extractTokenFromHeader(authHeader || '');

      if (!token) {
        return { isValid: false, error: 'No token provided' };
      }

      const decoded = AuthUtils.verifyToken(token);
      if (!decoded) {
        return { isValid: false, error: 'Invalid token' };
      }

      // Connect to database and verify user exists
      await connectDB();
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return { isValid: false, error: 'User not found' };
      }

      return { isValid: true, user: decoded };
    } catch (error) {
      return { isValid: false, error: 'Authentication failed' };
    }
  }

  // Check if user has required role
  static checkRole(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
  }

  // Middleware for protecting routes
  static async requireAuth(req: NextRequest, allowedRoles?: string[]): Promise<NextResponse | null> {
    const authResult = await AuthMiddleware.verifyAuth(req);

    if (!authResult.isValid || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    if (allowedRoles && !AuthMiddleware.checkRole(authResult.user.role, allowedRoles)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // Authentication successful
  }

  // Middleware for patient-only routes
  static async requirePatientRole(req: NextRequest): Promise<NextResponse | null> {
    return await AuthMiddleware.requireAuth(req, ['Patient']);
  }

  // Middleware for doctor-only routes
  static async requireDoctorRole(req: NextRequest): Promise<NextResponse | null> {
    return await AuthMiddleware.requireAuth(req, ['Doctor']);
  }

  // Middleware for worker-only routes
  static async requireWorkerRole(req: NextRequest): Promise<NextResponse | null> {
    return await AuthMiddleware.requireAuth(req, ['Worker']);
  }

  // Middleware for doctor and worker roles (healthcare providers)
  static async requireProviderRole(req: NextRequest): Promise<NextResponse | null> {
    return await AuthMiddleware.requireAuth(req, ['Doctor', 'Worker']);
  }
}

export default AuthMiddleware;