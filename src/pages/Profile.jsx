import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Github, Linkedin, Mail, Trophy, Code, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function Profile() {
  const { username } = useParams();
  
  const profile = {
    name: 'Rahul Sharma',
    username: 'rahul_dev',
    bio: 'Final year CS student at IIT Delhi. Passionate about algorithms and problem solving.',
    location: 'New Delhi, India',
    joinedDate: 'January 2024',
    github: 'github.com/rahuldev',
    linkedin: 'linkedin.com/in/rahuldev',
    email: 'rahul@example.com',
    stats: {
      solved: 156,
      easy: 78,
      medium: 58,
      hard: 20,
      rank: 1247,
      streak: 12
    },
    recentActivity: [
      { problem: 'Two Sum', difficulty: 'Easy', date: '2 hours ago', status: 'solved' },
      { problem: 'Binary Tree Inorder', difficulty: 'Medium', date: '5 hours ago', status: 'solved' },
      { problem: 'Merge K Sorted Lists', difficulty: 'Hard', date: '1 day ago', status: 'attempted' }
    ],
    badges: [
      { name: '50 Day Streak', icon: '🔥', earned: true },
      { name: '100 Problems', icon: '💯', earned: true },
      { name: 'Hard Conqueror', icon: '👑', earned: false }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <div className="px-8 pb-8">
                <div className="flex items-end justify-between -mt-16">
                  <div className="flex items-end gap-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white text-5xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <div className="pb-4">
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                      <p className="text-slate-600 dark:text-slate-400">@{profile.username}</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mb-4">
                    Follow
                  </button>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mt-4 mb-6">{profile.bio}</p>

                <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {profile.joinedDate}
                  </div>
                  <a href={`https://${profile.github}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a href={`https://${profile.linkedin}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Column - Stats */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Stats</h2>
                  <div className="space-y-4">
                    <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="text-3xl font-bold text-blue-500">{profile.stats.solved}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Solved</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950">
                        <div className="text-2xl font-bold text-green-600">{profile.stats.easy}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Easy</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-orange-50 dark:bg-orange-950">
                        <div className="text-2xl font-bold text-orange-600">{profile.stats.medium}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Medium</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950">
                        <div className="text-2xl font-bold text-red-600">{profile.stats.hard}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Hard</div>
                      </div>
                    </div>
                    <div className="flex justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Global Rank</span>
                      <span className="font-bold text-slate-900 dark:text-white">#{profile.stats.rank}</span>
                    </div>
                    <div className="flex justify-between p-4 rounded-xl bg-orange-50 dark:bg-orange-950">
                      <span className="text-slate-600 dark:text-slate-400">Current Streak</span>
                      <span className="font-bold text-orange-600">{profile.stats.streak} days 🔥</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Badges</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {profile.badges.map((badge, i) => (
                      <div key={i} className={`text-center p-4 rounded-xl ${badge.earned ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900 opacity-50'}`}>
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {profile.recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${activity.status === 'solved' ? 'bg-green-500' : 'bg-orange-500'}`} />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{activity.problem}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{activity.date}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-950 text-green-700' :
                          activity.difficulty === 'Medium' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700' :
                          'bg-red-100 dark:bg-red-950 text-red-700'
                        }`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
