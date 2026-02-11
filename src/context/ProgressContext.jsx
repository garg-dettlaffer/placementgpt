import { createContext, useState, useCallback, useEffect } from 'react';
import { db } from '../services/pocketbase';

export const ProgressContext = createContext(null);

export function ProgressProvider({ children, userId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress on mount or when userId changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await db.getProgress(userId);
        setProgress(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const updateProgress = useCallback(async (updates) => {
    try {
      setLoading(true);
      if (!userId) throw new Error('No user ID');
      
      const updated = await db.updateProgress(userId, updates);
      setProgress(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addSolvedProblem = useCallback(async (problemId) => {
    if (!progress) return;
    
    const solved = progress.solvedProblems || [];
    if (!solved.includes(problemId)) {
      const newSolved = [...solved, problemId];
      await updateProgress({
        solvedProblems: newSolved
      });
    }
  }, [progress, updateProgress]);

  const addAttemptedProblem = useCallback(async (problemId) => {
    if (!progress) return;
    
    const attempted = progress.attemptedProblems || [];
    if (!attempted.includes(problemId)) {
      const newAttempted = [...attempted, problemId];
      await updateProgress({
        attemptedProblems: newAttempted
      });
    }
  }, [progress, updateProgress]);

  const value = {
    progress,
    loading,
    error,
    updateProgress,
    addSolvedProblem,
    addAttemptedProblem,
    solvedCount: progress?.solvedProblems?.length || 0,
    totalXP: progress?.totalXP || 0,
    streak: progress?.streak || 0
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
