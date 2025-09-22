import { useState, useCallback } from 'react';

/**
 * Custom hook for managing patient queue functionality
 * Handles API calls, state management, and queue operations
 */
export const useQueue = (doctorId) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch patients from the queue
   */
  const fetchPatients = useCallback(async () => {
    if (!doctorId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/queue?doctorId=${doctorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch patients');
      }

      if (data.success) {
        setPatients(data.patients || []);
      } else {
        throw new Error(data.error || 'Failed to fetch patients');
      }
    } catch (err) {
      console.error('Queue fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  /**
   * Add a new patient to the queue
   */
  const addPatient = useCallback(async (patientData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...patientData,
          doctorId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add patient');
      }

      if (data.success) {
        setPatients(prev => [...prev, data.patient]);
        return data.patient;
      } else {
        throw new Error(data.error || 'Failed to add patient');
      }
    } catch (err) {
      console.error('Add patient error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  /**
   * Update patient status or information
   */
  const updatePatient = useCallback(async (patientId, updates) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/queue', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId,
          ...updates
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update patient');
      }

      if (data.success) {
        setPatients(prev => 
          prev.map(patient => 
            patient.patientId === patientId ? data.patient : patient
          )
        );
        return data.patient;
      } else {
        throw new Error(data.error || 'Failed to update patient');
      }
    } catch (err) {
      console.error('Update patient error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  /**
   * Remove patient from queue
   */
  const removePatient = useCallback(async (patientId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/queue?patientId=${patientId}&doctorId=${doctorId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove patient');
      }

      if (data.success) {
        setPatients(prev => prev.filter(patient => patient.patientId !== patientId));
        return data.patient;
      } else {
        throw new Error(data.error || 'Failed to remove patient');
      }
    } catch (err) {
      console.error('Remove patient error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [doctorId]);

  /**
   * Update patient status
   */
  const updatePatientStatus = useCallback(async (patientId, status) => {
    return updatePatient(patientId, { status });
  }, [updatePatient]);

  /**
   * Get queue statistics
   */
  const getQueueStats = useCallback(() => {
    const total = patients.length;
    const ready = patients.filter(p => p.status === 'Ready').length;
    const waiting = patients.filter(p => p.status === 'Waiting').length;
    const inConsultation = patients.filter(p => p.status === 'In Consultation').length;

    return {
      total,
      ready,
      waiting,
      inConsultation
    };
  }, [patients]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    patients,
    isLoading,
    error,
    fetchPatients,
    addPatient,
    updatePatient,
    removePatient,
    updatePatientStatus,
    getQueueStats,
    clearError
  };
};
