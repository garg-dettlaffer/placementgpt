import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { databases, DATABASE_ID, COLLECTIONS } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  RARITY_STYLES,
  checkAchievement,
  getAchievementProgress
} from '../utils/achievements';
import toast from 'react-hot-toast';
import {
  Trophy,
  Lock,
  Share2,
  Download,
  Sparkles,
  TrendingUp,
  Award,
  X,
  Copy
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Achievements() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUnlockModal, setShowUnlockModal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);

  // Fetch user progress and check achievements
  useEffect(() => {
    const fetchProgressAndAchievements = async () => {
      try {
        setLoading(true);

        // Fetch user progress
        const progressDocs = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROGRESS,
          [Query.equal('userId', user.$id)]
        );

        if (progressDocs.documents.length > 0) {
          const progress = progressDocs.documents[0];
          
          // Parse JSON fields
          const parsedProgress = {
            ...progress,
            solvedProblems: JSON.parse(progress.solvedProblems || '[]'),
            attemptedProblems: JSON.parse(progress.attemptedProblems || '[]'),
            topicStats: JSON.parse(progress.topicStats || '{}'),
            milestones: JSON.parse(progress.milestones || '[]')
          };

          setUserProgress(parsedProgress);

          // Check all achievements
          const unlocked = ACHIEVEMENTS.filter(achievement =>
            checkAchievement(achievement, parsedProgress)
          );

          setUnlockedAchievements(unlocked);

          // Check for newly unlocked achievements
          const storedUnlocked = JSON.parse(localStorage.getItem(`unlocked_${user.$id}`) || '[]');
          const newUnlocks = unlocked.filter(a => !storedUnlocked.includes(a.id));

          if (newUnlocks.length > 0) {
            // Show unlock animation for first new achievement
            setShowUnlockModal(newUnlocks[0]);
            setShowConfetti(true);
            
            // Update stored unlocked achievements
            localStorage.setItem(
              `unlocked_${user.$id}`,
              JSON.stringify(unlocked.map(a => a.id))
            );

            // Stop confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);

            // Auto-dismiss modal after 5 seconds
            setTimeout(() => setShowUnlockModal(null), 5000);
          }
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
        toast.error('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgressAndAchievements();
    }
  }, [user]);

  // Filter achievements
  const getFilteredAchievements = () => {
    let filtered = ACHIEVEMENTS;

    // Filter by lock status
    if (filter === 'unlocked') {
      filtered = filtered.filter(a => unlockedAchievements.find(ua => ua.id === a.id));
    } else if (filter === 'locked') {
      filtered = filtered.filter(a => !unlockedAchievements.find(ua => ua.id === a.id));
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }

    return filtered;
  };

  // Share achievement
  const shareAchievement = async (achievement) => {
    setShowShareModal(achievement);
  };

  // Generate achievement image
  const generateAchievementImage = async (achievement) => {
    const element = document.getElementById(`achievement-card-${achievement.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1a2e',
        scale: 2
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${achievement.name.replace(/\s+/g, '-')}-achievement.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Achievement image downloaded!');
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    }
  };

  // Copy share link
  const copyShareLink = (achievement) => {
    const link = `${window.location.origin}/achievements/${achievement.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied!');
  };

  const filteredAchievements = getFilteredAchievements();
  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Confetti */}
            {showConfetti && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
              />
            )}

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Achievement Library
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Your hall of fame on the journey to getting hired
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center px-6 py-3 bg-dark-800 rounded-lg border border-dark-700">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">
                      Rank
                    </span>
                    <span className="text-2xl font-bold text-white">#402</span>
                  </div>
                  <div className="text-center px-6 py-3 bg-dark-800 rounded-lg border border-primary-500/30 shadow-lg shadow-primary-500/20">
                    <span className="text-xs text-primary-400 uppercase tracking-wider font-semibold block mb-1">
                      Level
                    </span>
                    <span className="text-2xl font-bold text-white">12</span>
                  </div>
                </div>
              </div>

              {/* Global Progress */}
              <div className="card p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-3xl font-bold text-white">{unlockedCount}</span>
                    <span className="text-xl text-gray-500 font-medium"> / {totalCount} Unlocked</span>
                  </div>
                  <span className="text-primary-400 font-semibold">{progressPercentage}% Complete</span>
                </div>

                <div className="h-3 w-full bg-dark-700 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-purple-600 rounded-full shadow-lg shadow-primary-500/50"
                  />
                </div>

                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                    <span className="text-gray-400">Next: Premium Mock Test</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <div className="space-y-4 mb-8">
              {/* Lock Status Filters */}
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'all', label: 'All Badges' },
                  { value: 'unlocked', label: 'Unlocked' },
                  { value: 'locked', label: 'Locked' }
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                      filter === f.value
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-dark-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-gray-400 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === key
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievements Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="card p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-dark-700 rounded-xl"></div>
                      <div className="w-20 h-6 bg-dark-700 rounded"></div>
                    </div>
                    <div className="h-6 bg-dark-700 rounded mb-2"></div>
                    <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredAchievements.map((achievement) => {
                    const isUnlocked = unlockedAchievements.find(a => a.id === achievement.id);
                    const rarity = RARITY_STYLES[achievement.rarity];
                    const progress = userProgress ? getAchievementProgress(achievement, userProgress) : 0;

                    return (
                      <motion.div
                        key={achievement.id}
                        id={`achievement-card-${achievement.id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`card p-6 relative overflow-hidden group transition-all duration-300 ${
                          isUnlocked ? `${rarity.glow} hover:scale-105` : 'opacity-60 grayscale'
                        } border ${rarity.border} ${rarity.bg}`}
                      >
                        {/* Locked Badge */}
                        {!isUnlocked && (
                          <div className="absolute top-4 right-4">
                            <Lock className="w-5 h-5 text-gray-600" />
                          </div>
                        )}

                        {/* Icon */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-16 h-16 rounded-xl ${rarity.bg} border-2 ${rarity.border} flex items-center justify-center text-4xl`}>
                            {achievement.icon}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
                            {achievement.rarity}
                          </div>
                        </div>

                        {/* Info */}
                        <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

                        {/* Progress Bar (for in-progress achievements) */}
                        {!isUnlocked && progress > 0 && progress < 100 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* XP Reward */}
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-400">
                            {isUnlocked ? 'Earned' : 'Reward'}:{' '}
                            <span className="font-semibold text-yellow-500">
                              +{achievement.xpReward} XP
                            </span>
                          </span>
                        </div>

                        {/* Share Button (only for unlocked) */}
                        {isUnlocked && (
                          <button
                            onClick={() => shareAchievement(achievement)}
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-primary-600 rounded-lg hover:bg-primary-700"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && filteredAchievements.length === 0 && (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No achievements found with current filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUnlockModal(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ type: 'spring', duration: 0.7 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 max-w-md w-full border-2 border-primary-500 shadow-2xl shadow-primary-500/50"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-8xl mb-4"
                >
                  {showUnlockModal.icon}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Achievement Unlocked!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-primary-400 font-semibold mb-2"
                >
                  {showUnlockModal.name}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 mb-6"
                >
                  {showUnlockModal.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center gap-2 text-yellow-500"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg">+{showUnlockModal.xpReward} XP</span>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => setShowUnlockModal(null)}
                  className="mt-8 btn-primary w-full"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 rounded-xl p-6 max-w-md w-full border border-dark-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Share Achievement</h3>
                <button
                  onClick={() => setShowShareModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Achievement Preview */}
              <div className="bg-dark-900 rounded-lg p-6 mb-6 text-center">
                <div className="text-6xl mb-3">{showShareModal.icon}</div>
                <h4 className="text-lg font-bold text-white mb-1">{showShareModal.name}</h4>
                <p className="text-sm text-gray-400">{showShareModal.description}</p>
              </div>

              {/* Share Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => copyShareLink(showShareModal)}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Share Link
                </button>
                <button
                  onClick={() => generateAchievementImage(showShareModal)}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
