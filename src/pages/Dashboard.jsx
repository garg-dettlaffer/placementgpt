import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, Award, Clock, TrendingUp, Calendar, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

const StatsCard = ({ icon: Icon, label, value, trend, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="card p-6 cursor-pointer"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-dark-600 dark:text-dark-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-dark-900 dark:text-white mt-2">{value}</p>
        {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ {trend}</p>}
      </div>
      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user progress
    setTimeout(() => {
      setProgress({
        solvedProblems: 47,
        totalProblems: 500,
        accuracy: 78,
        studyTimeThisMonth: 152,
        streak: 12,
        totalXP: 4250
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                You're on track for your dream placement. Let's keep the momentum going!
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={Target}
                label="Problems Solved"
                value={`${progress?.solvedProblems}/${progress?.totalProblems}`}
                trend="3 this week"
                onClick={() => navigate('/problems')}
              />
              <StatsCard
                icon={TrendingUp}
                label="Accuracy"
                value={`${progress?.accuracy}%`}
                trend="↑ 5%"
                onClick={() => navigate('/analytics')}
              />
              <StatsCard
                icon={Clock}
                label="Study Time"
                value={`${progress?.studyTimeThisMonth}h`}
                trend="This month"
                onClick={() => navigate('/analytics')}
              />
              <StatsCard
                icon={Zap}
                label="Total XP"
                value={progress?.totalXP.toLocaleString()}
                trend="2,500 XP earned"
                onClick={() => navigate('/analytics')}
              />
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Streak Widget */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                    🔥 Streak: {progress?.streak} Days
                  </h2>
                  <div className="grid grid-cols-7 gap-3 mb-6">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={day} className="text-center">
                        <p className="text-xs text-dark-500 dark:text-dark-400 mb-2">{day}</p>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                          idx < 5 ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
                          idx === 5 ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' :
                          'bg-dark-200 dark:bg-dark-700 text-dark-500 dark:text-dark-400'
                        }`}>
                          {idx < 5 ? '✓' : idx === 5 ? 'T' : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Keep your streak alive! Practice at least 1 problem daily.
                  </p>
                </motion.div>

                {/* Recommended Problems */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                    Recommended for You
                  </h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Two Sum', difficulty: 'Easy', acceptance: 48.3, company: 'Google' },
                      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: 34.2, company: 'Amazon' }
                    ].map((problem, idx) => (
                      <div key={idx} className="p-4 border border-dark-200 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-dark-900 dark:text-white">{problem.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-dark-600 dark:text-dark-400">
                              <span className={`px-2 py-1 rounded ${
                                problem.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                                'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                              }`}>
                                {problem.difficulty}
                              </span>
                              <span>{problem.acceptance}% Acceptance</span>
                              <span>Asked in {problem.company}</span>
                            </div>
                          </div>
                          <span className="text-primary-600 dark:text-primary-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Readiness Score */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-8 text-center"
                >
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-6">
                    Placement Readiness
                  </h2>
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={`${(78 / 100) * 339.3} 339.3`}
                          transform="rotate(-90 60 60)"
                        />
                        <text x="60" y="65" textAnchor="middle" className="text-3xl font-bold fill-dark-900 dark:fill-white">
                          78%
                        </text>
                      </svg>
                    </div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">Ready to apply</p>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-8"
                >
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/problems')}
                      className="w-full btn-primary text-left"
                    >
                      Practice Problems
                    </button>
                    <button
                      onClick={() => navigate('/mock-interview')}
                      className="w-full btn-secondary"
                    >
                      Start Mock Interview
                    </button>
                    <button
                      onClick={() => navigate('/resume-analyzer')}
                      className="w-full btn-secondary"
                    >
                      Analyze Resume
                    </button>
                  </div>
                </motion.div>

                {/* Leaderboard */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card p-8"
                >
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                    🏆 Weekly Leaders
                  </h2>
                  <div className="space-y-3">
                    {[
                      { rank: 1, name: 'Rahul S.', xp: 2500, badge: '👑' },
                      { rank: 2, name: 'Priya P.', xp: 2200, badge: '⭐' },
                      { rank: 3, name: 'Aditya K.', xp: 1950, badge: '🥉' }
                    ].map((leader) => (
                      <div key={leader.rank} className="flex items-center gap-3">
                        <span className="text-lg">{leader.badge}</span>
                        <span className="text-sm font-medium flex-1">{leader.name}</span>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          {leader.xp.toLocaleString()} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
