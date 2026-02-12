import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { databases, DATABASE_ID, COLLECTIONS, account } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Link as LinkIcon,
  Settings,
  Share2,
  UserPlus,
  UserMinus,
  Trophy,
  Code,
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Copy,
  X
} from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity'); // activity, problems, achievements, submissions
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  // Tab-specific states
  const [activities, setActivities] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Fetch profile user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get user by username (stored in prefs or separate collection)
        const users = await databases.listDocuments(
          DATABASE_ID,
          'users',
          [Query.equal('username', username)]
        );

        if (users.documents.length === 0) {
          toast.error('User not found');
          navigate('/dashboard');
          return;
        }

        const user = users.documents[0];
        setProfileUser(user);

        // Fetch user's progress
        const progressDocs = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROGRESS,
          [Query.equal('userId', user.$id)]
        );

        if (progressDocs.documents.length > 0) {
          const progress = progressDocs.documents[0];
          setUserProgress(progress);
          
          // Parse solved problems
          const solved = JSON.parse(progress.solvedProblems || '[]');
          setSolvedProblems(solved);
        }

        // Check if current user follows this profile
        if (currentUser && currentUser.$id !== user.$id) {
          checkFollowStatus(user.$id);
        }

        // Fetch followers/following count
        fetchFollowCounts(user.$id);

      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, currentUser, navigate]);

  // Check follow status
  const checkFollowStatus = async (profileUserId) => {
    try {
      const follows = await databases.listDocuments(
        DATABASE_ID,
        'followers',
        [
          Query.equal('followerId', currentUser.$id),
          Query.equal('followingId', profileUserId)
        ]
      );
      setIsFollowing(follows.documents.length > 0);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  // Fetch follow counts
  const fetchFollowCounts = async (userId) => {
    try {
      const followers = await databases.listDocuments(
        DATABASE_ID,
        'followers',
        [Query.equal('followingId', userId)]
      );
      
      const following = await databases.listDocuments(
        DATABASE_ID,
        'followers',
        [Query.equal('followerId', userId)]
      );

      setFollowersCount(followers.total);
      setFollowingCount(following.total);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
      setFollowersCount(0);
      setFollowingCount(0);
    }
  };

  // Toggle follow
  const toggleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const follows = await databases.listDocuments(
          DATABASE_ID,
          'followers',
          [
            Query.equal('followerId', currentUser.$id),
            Query.equal('followingId', profileUser.$id)
          ]
        );

        if (follows.documents.length > 0) {
          await databases.deleteDocument(
            DATABASE_ID,
            'followers',
            follows.documents[0].$id
          );
        }

        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success('Unfollowed successfully');
      } else {
        // Follow
        await databases.createDocument(
          DATABASE_ID,
          'followers',
          'unique()',
          {
            followerId: currentUser.$id,
            followingId: profileUser.$id,
            createdAt: new Date().toISOString()
          }
        );

        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success('Followed successfully');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  // Copy profile link
  const copyProfileLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast.success('Profile link copied!');
  };

  // Download QR code
  const downloadQR = () => {
    const canvas = document.getElementById('profile-qr');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${username}-profile-qr.png`;
    link.href = url;
    link.click();
  };

  // Filter solved problems
  const filteredProblems = solvedProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const isOwnProfile = currentUser?.$id === profileUser?.$id;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-dark-900 bg-gradient-to-tr from-primary-500 to-purple-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center text-white text-4xl font-bold">
                    {profileUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-dark-900"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-dark-800/60 backdrop-blur-xl rounded-xl p-6 border border-dark-700">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {profileUser?.name || 'Unknown User'}
                    </h1>
                    <p className="text-gray-400 text-sm mb-4">@{username}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      {profileUser?.college && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{profileUser.college}</span>
                        </div>
                      )}
                      {profileUser?.graduationYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Class of {profileUser.graduationYear}</span>
                        </div>
                      )}
                      {profileUser?.branch && (
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          <span>{profileUser.branch}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mt-4">
                      <div>
                        <span className="text-2xl font-bold text-white">{solvedProblems.length}</span>
                        <span className="text-sm text-gray-400 ml-2">Problems</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-white">{followersCount}</span>
                        <span className="text-sm text-gray-400 ml-2">Followers</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-white">{followingCount}</span>
                        <span className="text-sm text-gray-400 ml-2">Following</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isOwnProfile ? (
                      <button
                        onClick={() => navigate('/settings')}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={toggleFollow}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isFollowing
                            ? 'bg-dark-700 text-white hover:bg-dark-600'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="btn-secondary p-3"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-700 mb-8">
            <div className="flex gap-8">
              {[
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'problems', label: 'Solved Problems', icon: CheckCircle },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'submissions', label: 'Submissions', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-12"
              >
                <div className="text-center py-20 text-gray-400">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Activity feed coming soon</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'problems' && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-12"
              >
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                    />
                  </div>
                  
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Problems Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/code/${problem.slug}`)}
                        className="card p-4 hover:border-primary-600 cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white">{problem.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            problem.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{problem.description?.substring(0, 100)}...</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-20 text-gray-400">
                      <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No problems found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-12"
              >
                <div className="text-center py-20 text-gray-400">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Achievements will be displayed here</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-12"
              >
                <div className="text-center py-20 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Submission history coming soon</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 rounded-xl p-6 max-w-md w-full border border-dark-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Share Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    id="profile-qr"
                    value={window.location.href}
                    size={200}
                    level="H"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={copyProfileLink}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                <button
                  onClick={downloadQR}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
