import mongoose, { Document, Schema } from 'mongoose';

/**
 * Chat Message Interface
 * Defines the structure of a chat message document
 */
export interface IChatMessage extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  role: 'user' | 'assistant';
  message: string;
  language: 'english' | 'hindi' | 'punjabi';
  detectedLanguage?: string;
  doctorSuggestion?: {
    name: string;
    category: string;
    reason: string;
  };
  isError?: boolean;
  metadata?: {
    responseTime?: number;
    model?: string;
    tokens?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat Message Schema
 * MongoDB schema for storing chat messages
 */
const ChatMessageSchema = new Schema<IChatMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  language: {
    type: String,
    enum: ['english', 'hindi', 'punjabi'],
    required: true,
    default: 'english'
  },
  detectedLanguage: {
    type: String,
    required: false
  },
  doctorSuggestion: {
    name: {
      type: String,
      required: false
    },
    category: {
      type: String,
      required: false
    },
    reason: {
      type: String,
      required: false
    }
  },
  isError: {
    type: Boolean,
    default: false
  },
  metadata: {
    responseTime: {
      type: Number,
      required: false
    },
    model: {
      type: String,
      required: false,
      default: 'gemini-1.5-flash'
    },
    tokens: {
      type: Number,
      required: false
    }
  }
}, {
  timestamps: true,
  collection: 'chat_messages'
});

// Indexes for better query performance
ChatMessageSchema.index({ userId: 1, sessionId: 1, createdAt: -1 });
ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });
ChatMessageSchema.index({ userId: 1, createdAt: -1 });

// Create the model
const ChatMessage: mongoose.Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
