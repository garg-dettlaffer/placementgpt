import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Search, Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getInitials } from '../../utils/helpers';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (isAuthPage) {
    return null; // Don't show navbar on auth pages
  }

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg" />
            <span className="hidden sm:inline">PlacementGPT</span>
          </Link>

          {/* Search Bar */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="input-field pl-10"
                  onFocus={() => navigate('/problems')}
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user && (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors md:flex hidden">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow"
                  >
                    {getInitials(user.name)}
                  </button>

                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-dark-200 dark:border-dark-700 py-2"
                    >
                      <div className="px-4 py-3 border-b border-dark-200 dark:border-dark-700">
                        <p className="font-semibold text-dark-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-dark-600 dark:text-dark-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 flex items-center gap-2 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-dark-200 dark:border-dark-700 pb-4"
          >
            {user && (
              <div className="space-y-2 mt-4">
                <Link to="/problems" className="block px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded transition-colors">
                  Problems
                </Link>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded transition-colors">
                  Dashboard
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
