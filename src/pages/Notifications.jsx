import { motion } from 'framer-motion';
import { Bell, Award, Code, Users, CheckCircle, Trash2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'achievement', title: 'New Achievement Unlocked!', message: 'You earned "Week Warrior" for maintaining a 7-day streak', time: '2 hours ago', read: false, icon: Award, color: 'text-yellow-500' },
    { id: 2, type: 'problem', title: 'New Problem Available', message: 'Try "Binary Tree Maximum Path Sum" - Hard difficulty', time: '5 hours ago', read: false, icon: Code, color: 'text-blue-500' },
    { id: 3, type: 'social', title: 'New Follower', message: 'Priya Patel started following you', time: '1 day ago', read: true, icon: Users, color: 'text-green-500' },
    { id: 4, type: 'achievement', title: 'Milestone Reached', message: 'You\'ve solved 100 problems! Keep going!', time: '2 days ago', read: true, icon: Award, color: 'text-purple-500' },
    { id: 5, type: 'problem', title: 'Daily Challenge', message: 'Today\'s challenge: Longest Palindromic Substring', time: '3 days ago', read: true, icon: Code, color: 'text-cyan-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
                <p className="text-slate-600 dark:text-slate-400">Stay updated with your progress and activity</p>
              </div>
              <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 transition-all hover:shadow-md ${
                    notif.read ? 'border-slate-200 dark:border-slate-800' : 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${notif.read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-950'} flex items-center justify-center flex-shrink-0`}>
                      <notif.icon className={`w-6 h-6 ${notif.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{notif.title}</h3>
                        <button className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                        <span>{notif.time}</span>
                        {!notif.read && (
                          <button className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No notifications yet</h3>
                <p className="text-slate-500 dark:text-slate-500">We'll notify you when something important happens</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
