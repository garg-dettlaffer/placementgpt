import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-900 dark:text-white">
              Your Analytics
            </h1>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Target, label: 'Problems Solved', value: '47', change: '+3' },
                { icon: TrendingUp, label: 'Accuracy', value: '78%', change: '+5%' },
                { icon: Clock, label: 'Study Time', value: '152h', change: '+12h' },
                { icon: Target, label: 'Current Streak', value: '12 days', change: '+2' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-dark-600 dark:text-dark-400 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-dark-900 dark:text-white mt-2">{stat.value}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                  Progress Over Time
                </h2>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[20, 35, 40, 38, 45, 47].map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg hover:shadow-lg transition-shadow"
                      style={{ height: `${(height / 50) * 250}px` }}
                      title={`${height} problems`}
                    />
                  ))}
                </div>
                <p className="text-xs text-dark-600 dark:text-dark-400 text-center mt-4">
                  Last 6 weeks
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                  Topic Accuracy
                </h2>
                <div className="space-y-4">
                  {[
                    { topic: 'Arrays', accuracy: 85 },
                    { topic: 'Strings', accuracy: 72 },
                    { topic: 'Trees', accuracy: 68 },
                    { topic: 'DP', accuracy: 55 }
                  ].map((item) => (
                    <div key={item.topic}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-dark-900 dark:text-white">
                          {item.topic}
                        </span>
                        <span className="text-sm font-bold text-primary-600">
                          {item.accuracy}%
                        </span>
                      </div>
                      <div className="h-3 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
