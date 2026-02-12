import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [period, setPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  const leaders = [
    { rank: 1, name: 'Priya Patel', username: 'priya_codes', solved: 234, xp: 12500, streak: 45, avatar: 'P', college: 'IIT Bombay' },
    { rank: 2, name: 'Rahul Sharma', username: 'rahul_dev', solved: 198, xp: 11200, streak: 32, avatar: 'R', college: 'IIT Delhi' },
    { rank: 3, name: 'Aditya Kumar', username: 'aditya_k', solved: 176, xp: 10800, streak: 28, avatar: 'A', college: 'BITS Pilani' },
    { rank: 4, name: 'Neha Singh', username: 'neha_tech', solved: 165, xp: 9500, streak: 21, avatar: 'N', college: 'NIT Trichy' },
    { rank: 5, name: 'Arjun Verma', username: 'arjun_v', solved: 152, xp: 8900, streak: 19, avatar: 'A', college: 'IIIT Hyderabad' },
    { rank: 6, name: 'Sneha Reddy', username: 'sneha_r', solved: 143, xp: 8400, streak: 15, avatar: 'S', college: 'VIT Vellore' },
    { rank: 7, name: 'Vikram Gupta', username: 'vikram_g', solved: 138, xp: 8100, streak: 14, avatar: 'V', college: 'DTU' },
    { rank: 8, name: 'Anjali Mehta', username: 'anjali_m', solved: 129, xp: 7800, streak: 12, avatar: 'A', college: 'Manipal' },
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500';
    if (rank === 2) return 'from-slate-400 to-slate-600';
    if (rank === 3) return 'from-orange-600 to-orange-800';
    return 'from-blue-500 to-cyan-500';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Award className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Leaderboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Compete with thousands of students nationwide</p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                {['week', 'month', 'all-time'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      period === p
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white w-full sm:w-64"
                />
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center pt-12"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-2xl font-bold mb-3 border-4 border-white dark:border-slate-900 shadow-xl">
                  {leaders[1].avatar}
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white">{leaders[1].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{leaders[1].xp.toLocaleString()} XP</div>
                </div>
                <div className="mt-4 bg-gradient-to-br from-slate-400 to-slate-600 text-white px-6 py-8 rounded-t-2xl w-full text-center">
                  <div className="text-4xl font-bold mb-1">2</div>
                  <Medal className="w-8 h-8 mx-auto" />
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-3 border-4 border-white dark:border-slate-900 shadow-xl">
                  {leaders[0].avatar}
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white text-lg">{leaders[0].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{leaders[0].xp.toLocaleString()} XP</div>
                </div>
                <div className="mt-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white px-6 py-12 rounded-t-2xl w-full text-center">
                  <div className="text-5xl font-bold mb-2">1</div>
                  <Trophy className="w-10 h-10 mx-auto" />
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center pt-16"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white text-2xl font-bold mb-3 border-4 border-white dark:border-slate-900 shadow-xl">
                  {leaders[2].avatar}
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 dark:text-white">{leaders[2].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{leaders[2].xp.toLocaleString()} XP</div>
                </div>
                <div className="mt-4 bg-gradient-to-br from-orange-600 to-orange-800 text-white px-6 py-6 rounded-t-2xl w-full text-center">
                  <div className="text-4xl font-bold mb-1">3</div>
                  <Medal className="w-8 h-8 mx-auto" />
                </div>
              </motion.div>
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">College</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Solved</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">XP</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {leaders.map((leader, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(leader.rank)}
                            <span className="font-bold text-slate-900 dark:text-white">#{leader.rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/profile/${leader.username}`} className="flex items-center gap-3 hover:text-blue-500 transition-colors">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(leader.rank)} flex items-center justify-center text-white font-bold`}>
                              {leader.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{leader.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">@{leader.username}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{leader.college}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{leader.solved}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900 dark:text-white">{leader.xp.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-orange-600">{leader.streak}</span>
                            <span className="text-orange-600">🔥</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
