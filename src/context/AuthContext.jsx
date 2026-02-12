import { createContext, useState, useEffect } from 'react';
import { auth as authService, db } from '../services/appwrite';
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
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        await loadUserProgress(currentUser.$id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProgress(userId) {
    try {
      const userProgress = await db.getProgress(userId);
      if (userProgress) {
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('Load progress error:', error);
    }
  }

  async function signUp(email, password, name, college, branch, graduationYear) {
    setLoading(true);
    try {
      const newUser = await authService.signUp(
        email, password, name, college, branch, graduationYear
      );
      setUser(newUser);
      setIsAuthenticated(true);
      await loadUserProgress(newUser.$id);
      toast.success('Account created successfully!');
      return { success: true, user: newUser };
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    setLoading(true);
    try {
      await authService.signIn(email, password);
      const authUser = await authService.getCurrentUser();
      setUser(authUser);
      setIsAuthenticated(true);
      await loadUserProgress(authUser.$id);
      toast.success('Welcome back!');
      return { success: true, user: authUser };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await authService.signOut();
      setUser(null);
      setProgress(null);
      setIsAuthenticated(false);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Sign out failed');
    }
  }

  async function updateProfile(data) {
    if (!user) return { success: false };
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      toast.success('Profile updated!');
      return { success: true, user: updated };
    } catch (error) {
      toast.error(error.message || 'Update failed');
      return { success: false, error: error.message };
    }
  }

  async function updateProgress(data) {
    if (!user) return { success: false };
    try {
      const updated = await db.updateProgress(user.$id, data);
      setProgress(updated);
      return { success: true, progress: updated };
    } catch (error) {
      toast.error('Progress update failed');
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
    refreshProgress: () => user && loadUserProgress(user.$id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
