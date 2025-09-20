import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Patient' | 'Doctor' | 'Worker';
  phone?: string;
  address?: string;
  // Patient specific fields
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  medicalHistory?: string[];
  // Doctor specific fields
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  // Worker specific fields
  workerId?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['Patient', 'Doctor', 'Worker'],
      required: [true, 'Role is required'],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Patient specific fields
    age: {
      type: Number,
      min: [0, 'Age must be positive'],
      max: [120, 'Age must be realistic'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    medicalHistory: [{
      type: String,
    }],
    // Doctor specific fields
    specialization: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, 'Experience must be positive'],
    },
    // Worker specific fields
    workerId: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for email for faster queries
UserSchema.index({ email: 1 });

// Create index for role-based queries
UserSchema.index({ role: 1 });

// Prevent password from being returned in queries by default
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;