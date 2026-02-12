import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Shield, 
  Key,
  Mail,
  Phone,
  Smartphone,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Database,
  Zap,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Edit3,
  Camera,
  Link,
  ExternalLink,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    branch: user?.branch || ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    studyReminders: true,
    achievementAlerts: true,
    companyUpdates: false,
    communityActivity: true
  });

  const [preferences, setPreferences] = useState({
    codeEditor: {
      theme: 'dark',
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      minimap: true,
      lineNumbers: true
    },
    dashboard: {
      defaultTab: 'overview',
      showTips: true,
      compactMode: false,
      autoRefresh: true
    },
    privacy: {
      profileVisibility: 'public',
      showProgress: true,
      allowAnalytics: true,
      dataCollection: 'essential'
    },
    sound: {
      enabled: true,
      volume: 70,
      buttonSounds: true,
      notificationSounds: true
    }
  });

  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@college.edu',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'San Francisco, CA',
    college: user?.college || 'Stanford University',
    branch: user?.branch || 'Computer Science',
    graduationYear: user?.graduationYear || '2024',
    bio: user?.bio || 'Passionate developer preparing for tech interviews at top companies.',
    linkedIn: user?.linkedIn || 'https://linkedin.com/in/johndoe',
    github: user?.github || 'https://github.com/johndoe',
    portfolio: user?.portfolio || 'https://johndoe.dev'
  });

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data & Export', icon: Database }
  ];

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call - in production, save to Appwrite
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success(`Notification settings updated`);
  };

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  const renderProfileSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black">
              {profile.name.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black dark:text-white">{profile.name}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  isEditing
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                )}
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <p className="text-dark-600 dark:text-dark-300 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 text-sm font-bold rounded-xl">
                {profile.college}
              </span>
              <span className="px-3 py-1 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 text-sm font-bold rounded-xl">
                {profile.branch}
              </span>
              <span className="px-3 py-1 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 text-sm font-bold rounded-xl">
                Class of {profile.graduationYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8">
        <h3 className="text-xl font-black dark:text-white mb-6">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.name}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.email}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.phone}
                </p>
              )}
            </div>
          </div>

          {/* Academic & Professional */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <GraduationCap size={16} />
                College/University
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.college}
                  onChange={(e) => setProfile({...profile, college: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.college}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <Briefcase size={16} />
                Branch/Major
              </label>
              {isEditing ? (
                <select
                  value={profile.branch}
                  onChange={(e) => setProfile({...profile, branch: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.branch}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                <Calendar size={16} />
                Graduation Year
              </label>
              {isEditing ? (
                <select
                  value={profile.graduationYear}
                  onChange={(e) => setProfile({...profile, graduationYear: e.target.value})}
                  className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  {[2024, 2025, 2026, 2027, 2028].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              ) : (
                <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
                  {profile.graduationYear}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
            <Edit3 size={16} />
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={4}
              className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl font-medium dark:text-white">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-6">
          <h4 className="text-lg font-black dark:text-white mb-4">Social Links</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'linkedIn', label: 'LinkedIn', icon: Link },
              { key: 'github', label: 'GitHub', icon: Link },
              { key: 'portfolio', label: 'Portfolio', icon: Globe }
            ].map((social) => (
              <div key={social.key}>
                <label className="flex items-center gap-2 text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                  <social.icon size={16} />
                  {social.label}
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile[social.key]}
                    onChange={(e) => setProfile({...profile, [social.key]: e.target.value})}
                    className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder={`Your ${social.label} URL`}
                  />
                ) : (
                  <div className="p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                    {profile[social.key] ? (
                      <a 
                        href={profile[social.key]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-2"
                      >
                        {profile[social.key]}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-dark-400 font-medium">Not set</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-4"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 rounded-xl font-bold hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderAppearanceSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Theme Selection */}
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8">
        <h3 className="text-xl font-black dark:text-white mb-6">Theme Preferences</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
            { key: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
            { key: 'system', label: 'System', icon: Monitor, desc: 'Follow system preference' }
          ].map((themeOption) => (
            <button
              key={themeOption.key}
              onClick={() => setTheme(themeOption.key)}
              className={cn(
                "p-6 rounded-2xl border-2 transition-all text-left",
                theme === themeOption.key
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600"
              )}
            >
              <themeOption.icon 
                size={24} 
                className={cn(
                  "mb-3",
                  theme === themeOption.key ? "text-primary-600" : "text-dark-600 dark:text-dark-300"
                )} 
              />
              <h4 className={cn(
                "font-bold mb-1",
                theme === themeOption.key ? "text-primary-900 dark:text-primary-100" : "dark:text-white"
              )}>
                {themeOption.label}
              </h4>
              <p className={cn(
                "text-sm",
                theme === themeOption.key ? "text-primary-700 dark:text-primary-300" : "text-dark-500"
              )}>
                {themeOption.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Appearance */}
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8">
        <h3 className="text-xl font-black dark:text-white mb-6">Code Editor</h3>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                Editor Theme
              </label>
              <select
                value={preferences.codeEditor.theme}
                onChange={(e) => handlePreferenceChange('codeEditor', 'theme', e.target.value)}
                className="w-full p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl font-medium dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark-600 dark:text-dark-300 mb-2">
                Font Size
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={preferences.codeEditor.fontSize}
                onChange={(e) => handlePreferenceChange('codeEditor', 'fontSize', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-dark-500 mt-1">
                <span>10px</span>
                <span>{preferences.codeEditor.fontSize}px</span>
                <span>24px</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { key: 'wordWrap', label: 'Word Wrap' },
              { key: 'minimap', label: 'Mini Map' },
              { key: 'lineNumbers', label: 'Line Numbers' }
            ].map((option) => (
              <label key={option.key} className="flex items-center gap-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.codeEditor[option.key]}
                  onChange={(e) => handlePreferenceChange('codeEditor', option.key, e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="font-bold text-sm dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8">
        <h3 className="text-xl font-black dark:text-white mb-6">Notification Preferences</h3>
        
        <div className="space-y-6">
          {[
            { key: 'studyReminders', label: 'Study Reminders', desc: 'Get reminded to practice daily' },
            { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Celebrate your milestones' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of your progress' },
            { key: 'companyUpdates', label: 'Company Updates', desc: 'New opportunities and deadlines' },
            { key: 'communityActivity', label: 'Community Activity', desc: 'Discussion and peer updates' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
              <div>
                <h4 className="font-bold dark:text-white">{notification.label}</h4>
                <p className="text-sm text-dark-600 dark:text-dark-300">{notification.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[notification.key]}
                  onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-dark-200 dark:border-dark-700">
          <h4 className="font-bold dark:text-white mb-4">Delivery Methods</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'email', label: 'Email', icon: Mail },
              { key: 'push', label: 'Push Notifications', icon: Smartphone },
              { key: 'sms', label: 'SMS', icon: Phone }
            ].map((method) => (
              <label key={method.key} className="flex items-center gap-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[method.key]}
                  onChange={(e) => handleNotificationChange(method.key, e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <method.icon size={20} className="text-dark-600 dark:text-dark-300" />
                <span className="font-bold text-sm dark:text-white">{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'preferences':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8"
          >
            <h3 className="text-xl font-black dark:text-white mb-6">General Preferences</h3>
            <p className="text-dark-600 dark:text-dark-300">Preferences panel coming soon...</p>
          </motion.div>
        );
      case 'privacy':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8"
          >
            <h3 className="text-xl font-black dark:text-white mb-6">Privacy & Security</h3>
            <p className="text-dark-600 dark:text-dark-300">Privacy settings coming soon...</p>
          </motion.div>
        );
      case 'data':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-8"
          >
            <h3 className="text-xl font-black dark:text-white mb-6">Data Management</h3>
            <p className="text-dark-600 dark:text-dark-300">Data export and management options coming soon...</p>
          </motion.div>
        );
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header */}
          <section className="mb-8">
            <h1 className="text-4xl font-black dark:text-white mb-2">Settings</h1>
            <p className="text-dark-600 dark:text-dark-300 font-medium">
              Customize your PlacementGPT experience
            </p>
          </section>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-100 dark:border-dark-800 p-4 sticky top-6">
                <nav className="space-y-2">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all",
                        activeSection === section.id
                          ? "bg-primary-500 text-white shadow-lg"
                          : "text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800"
                      )}
                    >
                      <section.icon size={20} />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <SectionContent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}