import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/appwrite';

export function useCompanies(initialFilters = {}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getCompanies(filters);
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getCompany = useCallback(async (slug) => {
    try {
      return await db.getCompany(slug);
    } catch (err) {
      throw new Error(`Failed to fetch company: ${err.message}`);
    }
  }, []);

  return {
    companies,
    loading,
    error,
    filters,
    updateFilters,
    getCompany,
    refetch: fetchCompanies
  };
}
