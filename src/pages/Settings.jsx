import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Trash2, Save, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    github: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    achievementAlerts: true,
    interviewReminders: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              
              {/* Sidebar tabs */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                  
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                      </div>

                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        
                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <button type="button" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                              Change Avatar
                            </button>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">JPG, PNG or GIF. Max 2MB</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profile.name}
                              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={profile.phone}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={profile.location}
                              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                              placeholder="Bangalore, India"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              value={profile.linkedin}
                              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                              placeholder="linkedin.com/in/username"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              GitHub
                            </label>
                            <input
                              type="url"
                              value={profile.github}
                              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                              placeholder="github.com/username"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h2>
                        <p className="text-slate-600 dark:text-slate-400">Manage how you receive notifications</p>
                      </div>

                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <div>
                              <h3 className="font-medium text-slate-900 dark:text-white capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {key === 'emailNotifications' && 'Receive updates via email'}
                                {key === 'pushNotifications' && 'Browser push notifications'}
                                {key === 'weeklyReport' && 'Weekly progress summary'}
                                {key === 'achievementAlerts' && 'New achievement unlocks'}
                                {key === 'interviewReminders' && 'Mock interview reminders'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleNotificationToggle(key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                value ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Appearance</h2>
                        <p className="text-slate-600 dark:text-slate-400">Customize how PlacementGPT looks</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Theme</label>
                        <div className="grid grid-cols-3 gap-4">
                          {['light', 'dark', 'system'].map((t) => (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                theme === t
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className="text-4xl mb-2">
                                {t === 'light' && '☀️'}
                                {t === 'dark' && '🌙'}
                                {t === 'system' && '💻'}
                              </div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white capitalize">{t}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Security</h2>
                        <p className="text-slate-600 dark:text-slate-400">Manage your account security</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800">
                          <h3 className="font-medium text-slate-900 dark:text-white mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <input
                              type="password"
                              placeholder="Current password"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                            <input
                              type="password"
                              placeholder="New password"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                            <button className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                              Update Password
                            </button>
                          </div>
                        </div>

                        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
                          <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">Danger Zone</h3>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-4">Once you delete your account, there is no going back.</p>
                          <button className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
