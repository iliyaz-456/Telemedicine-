/**
 * Video Call Utilities
 * 
 * This file contains utility functions for video call functionality
 * including room ID generation, user management, and call state management.
 */

/**
 * Generate a unique room/session ID for video calls
 * Format: room-{timestamp}-{randomString}
 * 
 * @returns {string} Unique room ID
 */
export function generateRoomId(): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 8);
  return `room-${timestamp}-${randomString}`;
}

/**
 * Generate a user-friendly room code for sharing
 * Format: 6-character alphanumeric code
 * 
 * @returns {string} Room code for easy sharing
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate if a room ID is in the correct format
 * 
 * @param roomId - Room ID to validate
 * @returns {boolean} True if valid format
 */
export function isValidRoomId(roomId: string): boolean {
  const roomIdPattern = /^room-[a-z0-9]+-[a-z0-9]+$/;
  return roomIdPattern.test(roomId);
}

/**
 * Extract timestamp from room ID
 * 
 * @param roomId - Room ID to extract timestamp from
 * @returns {number|null} Timestamp or null if invalid
 */
export function getRoomTimestamp(roomId: string): number | null {
  if (!isValidRoomId(roomId)) return null;
  
  const parts = roomId.split('-');
  if (parts.length !== 3) return null;
  
  const timestamp = parseInt(parts[1], 36);
  return isNaN(timestamp) ? null : timestamp;
}

/**
 * Check if a room is still valid (not expired)
 * Rooms expire after 24 hours
 * 
 * @param roomId - Room ID to check
 * @returns {boolean} True if room is still valid
 */
export function isRoomValid(roomId: string): boolean {
  const timestamp = getRoomTimestamp(roomId);
  if (!timestamp) return false;
  
  const now = Date.now();
  const roomAge = now - timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return roomAge < maxAge;
}

/**
 * Get room age in human-readable format
 * 
 * @param roomId - Room ID to get age for
 * @returns {string} Human-readable age (e.g., "2 hours ago")
 */
export function getRoomAge(roomId: string): string {
  const timestamp = getRoomTimestamp(roomId);
  if (!timestamp) return 'Invalid room';
  
  const now = Date.now();
  const age = now - timestamp;
  
  const minutes = Math.floor(age / (1000 * 60));
  const hours = Math.floor(age / (1000 * 60 * 60));
  const days = Math.floor(age / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Generate a call session ID for tracking
 * Format: session-{timestamp}-{randomString}
 * 
 * @returns {string} Unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 10);
  return `session-${timestamp}-${randomString}`;
}

/**
 * Call state management types
 */
export interface CallState {
  roomId: string;
  sessionId: string;
  isActive: boolean;
  startTime: number;
  participants: string[];
  doctorId?: string;
  patientId?: string;
}

/**
 * Create initial call state
 * 
 * @param doctorId - Doctor's user ID
 * @param patientId - Patient's user ID (optional)
 * @returns {CallState} Initial call state
 */
export function createCallState(doctorId: string, patientId?: string): CallState {
  return {
    roomId: generateRoomId(),
    sessionId: generateSessionId(),
    isActive: true,
    startTime: Date.now(),
    participants: [doctorId],
    doctorId,
    patientId
  };
}

/**
 * Add participant to call state
 * 
 * @param callState - Current call state
 * @param participantId - Participant ID to add
 * @returns {CallState} Updated call state
 */
export function addParticipant(callState: CallState, participantId: string): CallState {
  if (callState.participants.includes(participantId)) {
    return callState; // Already exists
  }
  
  return {
    ...callState,
    participants: [...callState.participants, participantId]
  };
}

/**
 * Remove participant from call state
 * 
 * @param callState - Current call state
 * @param participantId - Participant ID to remove
 * @returns {CallState} Updated call state
 */
export function removeParticipant(callState: CallState, participantId: string): CallState {
  return {
    ...callState,
    participants: callState.participants.filter(id => id !== participantId)
  };
}

/**
 * End call and update state
 * 
 * @param callState - Current call state
 * @returns {CallState} Updated call state
 */
export function endCall(callState: CallState): CallState {
  return {
    ...callState,
    isActive: false,
    participants: []
  };
}

/**
 * Get call duration in human-readable format
 * 
 * @param callState - Call state to get duration for
 * @returns {string} Human-readable duration
 */
export function getCallDuration(callState: CallState): string {
  if (!callState.isActive) return 'Call ended';
  
  const now = Date.now();
  const duration = now - callState.startTime;
  
  const minutes = Math.floor(duration / (1000 * 60));
  const hours = Math.floor(duration / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}


