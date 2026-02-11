import { createContext, useState, useEffect } from 'react';
import { auth as authService, db } from '../services/pocketbase';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        await loadUserProgress(currentUser.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProgress(userId) {
    const { progress: userProgress } = await db.getProgress(userId);
    if (userProgress) {
      setProgress(userProgress);
    }
  }

  async function signUp(email, password, name, college, branch, graduationYear) {
    setLoading(true);
    try {
      const { user: newUser, error } = await authService.signUp(
        email, password, name, college, branch, graduationYear
      );
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      setUser(newUser);
      setIsAuthenticated(true);
      await loadUserProgress(newUser.id);
      toast.success('Account created successfully!');
      return { success: true, user: newUser };
    } catch (error) {
      toast.error('Signup failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    setLoading(true);
    try {
      const { user: authUser, error } = await authService.signIn(email, password);
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      setUser(authUser);
      setIsAuthenticated(true);
      await loadUserProgress(authUser.id);
      toast.success('Welcome back!');
      return { success: true, user: authUser };
    } catch (error) {
      toast.error('Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    authService.signOut();
    setUser(null);
    setProgress(null);
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
  }

  async function updateProfile(data) {
    if (!user) return { success: false };
    try {
      const { user: updated, error } = await authService.updateProfile(user.id, data);
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      setUser(updated);
      toast.success('Profile updated!');
      return { success: true, user: updated };
    } catch (error) {
      toast.error('Update failed');
      return { success: false, error: error.message };
    }
  }

  async function updateProgress(data) {
    if (!user) return { success: false };
    try {
      const { progress: updated, error } = await db.updateProgress(user.id, data);
      if (error) throw new Error(error);
      setProgress(updated);
      return { success: true, progress: updated };
    } catch (error) {
      console.error('Progress update error:', error);
      return { success: false, error: error.message };
    }
  }

  const value = {
    user,
    progress,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateProgress,
    refreshProgress: () => user && loadUserProgress(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
