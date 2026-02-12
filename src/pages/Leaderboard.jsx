import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { databases, DATABASE_ID, COLLECTIONS } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';
import { Trophy, TrendingUp, Users, Award, Target, Zap, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [filter, setFilter] = useState('all'); // all, my-college, my-branch, my-batch
  const [timePeriod, setTimePeriod] = useState('weekly'); // weekly, monthly, all-time
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const userRowRef = useRef(null);

  const LIMIT = 20;

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);

      const currentOffset = isLoadMore ? offset : 0;
      
      // Build queries based on filters
      const queries = [
        Query.limit(LIMIT),
        Query.offset(currentOffset)
      ];

      // Add sort based on time period
      if (timePeriod === 'weekly') {
        queries.push(Query.orderDesc('weeklyXP'));
      } else {
        queries.push(Query.orderDesc('totalXP'));
      }

      // Add filter queries
      if (filter === 'my-college' && user?.prefs?.college) {
        queries.push(Query.equal('college', user.prefs.college));
      } else if (filter === 'my-branch' && user?.prefs?.branch) {
        queries.push(Query.equal('branch', user.prefs.branch));
      } else if (filter === 'my-batch' && user?.prefs?.graduationYear) {
        queries.push(Query.equal('graduationYear', user.prefs.graduationYear));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        queries
      );

      // Fetch user details for each progress entry
      const enrichedData = await Promise.all(
        response.documents.map(async (doc) => {
          try {
            const userDoc = await databases.getDocument(
              DATABASE_ID,
              'users',
              doc.userId
            );
            return {
              ...doc,
              userData: userDoc
            };
          } catch (error) {
            // If user not found, return with basic info
            return {
              ...doc,
              userData: { name: 'Unknown User', college: 'N/A' }
            };
          }
        })
      );

      if (isLoadMore) {
        setLeaderboardData(prev => [...prev, ...enrichedData]);
      } else {
        setLeaderboardData(enrichedData);
        
        // Find current user's rank
        const userIndex = enrichedData.findIndex(d => d.userId === user.$id);
        if (userIndex !== -1) {
          setCurrentUserRank(userIndex + 1);
          // Scroll to user after a delay
          setTimeout(() => {
            userRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        } else {
          // Fetch user's rank separately if not in top results
          fetchUserRank();
        }
      }

      setHasMore(response.documents.length === LIMIT);
      setOffset(currentOffset + LIMIT);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [filter, timePeriod, user, offset]);

  // Fetch current user's specific rank
  const fetchUserRank = async () => {
    try {
      const sortField = timePeriod === 'weekly' ? 'weeklyXP' : 'totalXP';
      
      // Get user's progress
      const userProgress = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [Query.equal('userId', user.$id)]
      );

      if (userProgress.documents.length === 0) return;

      const userXP = userProgress.documents[0][sortField];

      // Count how many users have more XP
      const higherRanked = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [
          Query.greaterThan(sortField, userXP),
          Query.limit(1000) // Limit for count
        ]
      );

      setCurrentUserRank(higherRanked.total + 1);
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };

  // Initial load
  useEffect(() => {
    setOffset(0);
    setLeaderboardData([]);
    fetchLeaderboard(false);
  }, [filter, timePeriod]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchLeaderboard(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchLeaderboard]);

  // Get medal for rank
  const getMedalIcon = (rank) => {
    if (rank === 1) return <div className="text-4xl">🥇</div>;
    if (rank === 2) return <div className="text-4xl">🥈</div>;
    if (rank === 3) return <div className="text-4xl">🥉</div>;
    return <span className="text-gray-500 font-semibold">#{rank}</span>;
  };

  // Get medal gradient background
  const getMedalBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600/30';
    return 'bg-dark-800/50 border-dark-700';
  };

  // Calculate XP to next rank
  const getXPToNextRank = () => {
    if (!currentUserRank || currentUserRank === 1 || leaderboardData.length === 0) return null;
    
    const currentUser = leaderboardData.find(d => d.userId === user.$id);
    const nextRankUser = leaderboardData[currentUserRank - 2];
    
    if (!currentUser || !nextRankUser) return null;
    
    const sortField = timePeriod === 'weekly' ? 'weeklyXP' : 'totalXP';
    return nextRankUser[sortField] - currentUser[sortField];
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Global Leaderboard
                  </h1>
                  <p className="text-gray-400">See where you stand among top engineering talent</p>
                </div>

                {/* Time Period Tabs */}
                <div className="flex gap-1 bg-dark-800 p-1 rounded-lg border border-dark-700">
                  {[
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'all-time', label: 'All-Time' }
                  ].map(period => (
                    <button
                      key={period.value}
                      onClick={() => setTimePeriod(period.value)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                        timePeriod === period.value
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-dark-700'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Global', icon: Users },
                  { value: 'my-college', label: 'My College', icon: Award },
                  { value: 'my-branch', label: 'My Branch', icon: Target },
                  { value: 'my-batch', label: 'My Batch', icon: Zap }
                ].map(filterOption => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === filterOption.value
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-dark-700'
                    }`}
                  >
                    <filterOption.icon className="w-4 h-4" />
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Leaderboard */}
              <div className="lg:col-span-2">
                <div className="card overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-dark-700 bg-dark-800/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-5 md:col-span-4">Student</div>
                    <div className="col-span-3 hidden md:block">College</div>
                    <div className="col-span-3 md:col-span-2 text-center">XP</div>
                    <div className="col-span-3 md:col-span-2 text-right">Accuracy</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-dark-700 max-h-[700px] overflow-y-auto">
                    {loading && leaderboardData.length === 0 ? (
                      // Loading skeletons
                      Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                          <div className="col-span-1 flex justify-center">
                            <div className="w-8 h-8 bg-dark-700 rounded"></div>
                          </div>
                          <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-700 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-dark-700 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-dark-700 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="col-span-3 hidden md:block">
                            <div className="h-4 bg-dark-700 rounded w-full"></div>
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <div className="h-4 bg-dark-700 rounded w-full"></div>
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <div className="h-4 bg-dark-700 rounded w-full"></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <AnimatePresence>
                        {leaderboardData.map((entry, idx) => {
                          const rank = idx + 1;
                          const isCurrentUser = entry.userId === user.$id;
                          const xpValue = timePeriod === 'weekly' ? entry.weeklyXP : entry.totalXP;

                          return (
                            <motion.div
                              key={entry.$id}
                              ref={isCurrentUser ? userRowRef : null}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer hover:bg-dark-700/30 transition-colors ${
                                isCurrentUser 
                                  ? `${getMedalBg(rank)} animate-pulse-slow border-l-4`
                                  : ''
                              }`}
                            >
                              {/* Rank */}
                              <div className="col-span-1 flex items-center justify-center">
                                {getMedalIcon(rank)}
                              </div>

                              {/* Student Info */}
                              <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center text-white font-bold">
                                      {entry.userData?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                  </div>
                                  {isCurrentUser && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full border-2 border-dark-900 flex items-center justify-center">
                                      <Trophy className="w-2 h-2 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">
                                    {entry.userData?.name || 'Unknown'}
                                    {isCurrentUser && (
                                      <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                                        YOU
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    @{entry.userData?.email?.split('@')[0] || 'user'}
                                  </p>
                                </div>
                              </div>

                              {/* College */}
                              <div className="col-span-3 hidden md:flex items-center">
                                <p className="text-sm text-gray-400 truncate">
                                  {entry.userData?.college || user?.prefs?.college || 'N/A'}
                                </p>
                              </div>

                              {/* XP */}
                              <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-1">
                                  <Zap className="w-4 h-4 text-yellow-500" />
                                  <span className="font-bold text-white">
                                    {xpValue?.toLocaleString() || 0}
                                  </span>
                                </div>
                              </div>

                              {/* Accuracy */}
                              <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                      className="h-full bg-gradient-to-r from-green-600 to-green-400"
                                      style={{ width: `${entry.accuracy || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-semibold text-green-400">
                                    {entry.accuracy || 0}%
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}

                    {/* Infinite Scroll Trigger */}
                    {hasMore && !loading && (
                      <div ref={observerTarget} className="h-20 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    )}

                    {/* No more data */}
                    {!hasMore && leaderboardData.length > 0 && (
                      <div className="py-8 text-center text-gray-500 text-sm">
                        You've reached the end of the leaderboard
                      </div>
                    )}

                    {/* Empty state */}
                    {!loading && leaderboardData.length === 0 && (
                      <div className="py-20 text-center">
                        <Medal className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No data available for this filter</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                {/* Your Stats Card */}
                {currentUserRank && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">Your Stats</h3>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold text-white">#{currentUserRank}</span>
                          <span className="text-sm text-gray-400">Global Rank</span>
                        </div>
                        {currentUserRank > 1 && currentUserRank <= 100 && (
                          <p className="text-xs text-gray-500">
                            {currentUserRank <= 10 ? '🔥 Top 10!' : currentUserRank <= 50 ? '⭐ Top 50!' : '📈 Top 100!'}
                          </p>
                        )}
                      </div>

                      {getXPToNextRank() && (
                        <div>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-gray-400">To Next Rank</span>
                            <span className="text-primary-400 font-semibold">
                              +{getXPToNextRank()} XP needed
                            </span>
                          </div>
                          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((leaderboardData.find(d => d.userId === user.$id)?.[timePeriod === 'weekly' ? 'weeklyXP' : 'totalXP'] || 0) /
                                    (leaderboardData[currentUserRank - 2]?.[timePeriod === 'weekly' ? 'weeklyXP' : 'totalXP'] || 1)) *
                                    100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {userRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}}
                        className="w-full btn-secondary text-sm"
                      >
                        View My Position
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Live Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-white">Live Activity</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      <span className="text-primary-400 font-semibold">
                        {leaderboardData.length}+
                      </span>{' '}
                      students are currently competing
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Updated in real-time</span>
                    </div>
                  </div>
                </motion.div>

                {/* Tip Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-6 bg-gradient-to-br from-primary-900/20 to-purple-900/20 border-primary-500/20"
                >
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <span>💡</span> Pro Tip
                  </h3>
                  <p className="text-sm text-gray-300">
                    Solve 2 problems daily to maintain your streak and climb the leaderboard faster!
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
