import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Home, BookOpen, Users, Mic2, FileText, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const isActive = (path) => location.pathname === path;
  const isActiveSection = (paths) => paths.some(p => location.pathname.startsWith(p));

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard'
    },
    {
      label: 'AI Tutor',
      icon: BookOpen,
      path: '/problems'
    },
    {
      label: 'Problem Set',
      icon: BookOpen,
      path: '/problems'
    },
    {
      label: 'Mock Interviews',
      icon: Mic2,
      path: '/mock-interview'
    },
    {
      label: 'Resume Builder',
      icon: FileText,
      path: '/resume-analyzer'
    }
  ];

  const analyticsItems = [
    {
      label: 'Performance',
      icon: BarChart3,
      path: '/analytics'
    },
    {
      label: 'Activity Log',
      icon: BookOpen,
      path: '/activity'
    }
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:hidden z-30 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 250 : 80 }}
        className="fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 overflow-y-auto z-20 md:relative md:top-0 md:h-screen transition-all duration-300"
      >
        <div className="p-4">
          {/* Logo */}
          {isOpen && (
            <div className="mb-6">
              <h2 className="font-bold text-lg text-gradient">PlacementGPT</h2>
              <p className="text-xs text-dark-600 dark:text-dark-400">Master Your Placement</p>
            </div>
          )}

          {/* Main Menu */}
          <div className="space-y-2 mb-8">
            <p className={cn("text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider px-3 mb-3", !isOpen && "hidden")}>
              Main
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!isOpen ? item.label : ''}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-semibold'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* Analytics */}
          <div className="space-y-2">
            <p className={cn("text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider px-3 mb-3", !isOpen && "hidden")}>
              Analytics
            </p>
            {analyticsItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!isOpen ? item.label : ''}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-semibold'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-200 dark:border-dark-700">
          <div className="space-y-2">
            <Link
              to="/settings"
              title={!isOpen ? 'Settings' : ''}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                isActive('/settings')
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
              )}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>Settings</span>}
            </Link>
            <button
              onClick={signOut}
              title={!isOpen ? 'Logout' : ''}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-10"
        />
      )}
    </>
  );
}
