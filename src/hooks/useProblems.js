import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/pocketbase';

export function useProblems(initialFilters = {}) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getProblems(filters);
      setProblems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getProblem = useCallback(async (slug) => {
    try {
      return await db.getProblem(slug);
    } catch (err) {
      throw new Error(`Failed to fetch problem: ${err.message}`);
    }
  }, []);

  return {
    problems,
    loading,
    error,
    filters,
    updateFilters,
    getProblem,
    refetch: fetchProblems
  };
}
