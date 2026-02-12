import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Award, Clock, Target } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { progress, user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');

  const solvedByDifficulty = [
    { name: 'Easy', value: 12, color: '#10b981' },
    { name: 'Medium', value: 8, color: '#f59e0b' },
    { name: 'Hard', value: 3, color: '#ef4444' }
  ];

  const weeklyProgress = [
    { day: 'Mon', problems: 3 },
    { day: 'Tue', problems: 5 },
    { day: 'Wed', problems: 2 },
    { day: 'Thu', problems: 7 },
    { day: 'Fri', problems: 4 },
    { day: 'Sat', problems: 6 },
    { day: 'Sun', problems: 3 }
  ];

  const topicBreakdown = [
    { topic: 'Arrays', solved: 15, total: 50 },
    { topic: 'Strings', solved: 12, total: 40 },
    { topic: 'Trees', solved: 8, total: 35 },
    { topic: 'Graphs', solved: 5, total: 30 },
    { topic: 'DP', solved: 3, total: 25 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">Track your progress and identify improvement areas</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Solved', value: progress?.solvedProblems?.length || 0, icon: Target, color: 'blue' },
                { label: 'Accuracy', value: `${progress?.accuracy || 0}%`, icon: TrendingUp, color: 'green' },
                { label: 'Study Hours', value: Math.round((progress?.studyTime || 0) / 60), icon: Clock, color: 'orange' },
                { label: 'Current Streak', value: `${progress?.streak || 0} days`, icon: Award, color: 'purple' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-10 h-10 text-${stat.color}-500`} />
                    <span className={`text-3xl font-bold text-${stat.color}-500`}>{stat.value}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              
              {/* Weekly Activity */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Weekly Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="problems" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Difficulty Distribution */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">By Difficulty</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={solvedByDifficulty} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                      {solvedByDifficulty.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {solvedByDifficulty.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Topic Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Progress by Topic</h2>
              <div className="space-y-4">
                {topicBreakdown.map((topic) => (
                  <div key={topic.topic}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{topic.topic}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{topic.solved}/{topic.total}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${(topic.solved / topic.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
