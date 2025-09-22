import mongoose, { Document, Schema } from 'mongoose';

/**
 * Consultation Interface
 * Defines the structure of a consultation document
 */
export interface IConsultation extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId; // Optional, can be assigned later
  consultationType: 'video' | 'missed_call';
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  symptoms?: string[];
  diagnosis?: string;
  prescription?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Consultation Schema
 * MongoDB schema for storing consultation records
 */
const ConsultationSchema = new Schema<IConsultation>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  consultationType: {
    type: String,
    enum: ['video', 'missed_call'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: false
  },
  duration: {
    type: Number,
    required: false,
    min: 0
  },
  notes: {
    type: String,
    required: false,
    maxlength: 1000
  },
  symptoms: [{
    type: String,
    required: false
  }],
  diagnosis: {
    type: String,
    required: false,
    maxlength: 500
  },
  prescription: {
    type: String,
    required: false,
    maxlength: 1000
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'consultations'
});

// Indexes for better query performance
ConsultationSchema.index({ patientId: 1, status: 1 });
ConsultationSchema.index({ doctorId: 1, status: 1 });
ConsultationSchema.index({ consultationType: 1, status: 1 });
ConsultationSchema.index({ startTime: -1 });

// Virtual for calculating duration
ConsultationSchema.virtual('calculatedDuration').get(function() {
  if (this.endTime && this.startTime) {
    return Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)); // in minutes
  }
  return null;
});

// Pre-save middleware to calculate duration
ConsultationSchema.pre('save', function(next) {
  if (this.endTime && this.startTime && !this.duration) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  next();
});

// Static method to find consultations by patient
ConsultationSchema.statics.findByPatient = function(patientId: string) {
  return this.find({ patientId }).sort({ startTime: -1 });
};

// Static method to find consultations by doctor
ConsultationSchema.statics.findByDoctor = function(doctorId: string) {
  return this.find({ doctorId }).sort({ startTime: -1 });
};

// Static method to find pending consultations
ConsultationSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ startTime: 1 });
};

// Static method to find ongoing consultations
ConsultationSchema.statics.findOngoing = function() {
  return this.find({ status: 'ongoing' }).sort({ startTime: -1 });
};

// Export the model
export default mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);


