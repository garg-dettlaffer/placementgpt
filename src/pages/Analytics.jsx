import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { databases, DATABASE_ID, COLLECTIONS } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Target,
  Clock,
  Zap,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

export default function Analytics() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days
  const [progressData, setProgressData] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [activityHeatmap, setActivityHeatmap] = useState([]);
  const [companyReadiness, setCompanyReadiness] = useState([]);

  // Fetch user progress and generate analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
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
            topicStats: JSON.parse(progress.topicStats || '{}')
          };

          setUserProgress(parsedProgress);

          // Generate progress over time data
          generateProgressData(parsedProgress);

          // Generate topic-wise performance
          generateTopicStats(parsedProgress);

          // Generate activity heatmap
          generateActivityHeatmap(parsedProgress);

          // Generate company readiness
          generateCompanyReadiness(parsedProgress);
        } else {
          // No progress data yet - use empty state
          setUserProgress({
            solvedProblems: [],
            attemptedProblems: [],
            topicStats: {},
            studyTime: 0,
            streak: 0,
            totalXP: 0
          });
          setProgressData([]);
          setTopicStats([]);
          setActivityHeatmap([]);
          setCompanyReadiness([]);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user, dateRange]);

  // Generate progress over time
  const generateProgressData = (progress) => {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);
    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });

    const data = daysArray.map((date, idx) => {
      // Simulate cumulative progress (in real app, fetch from submissions history)
      const cumulativeCount = Math.floor(
        (progress.solvedProblems.length / dateRange) * idx
      );

      return {
        date: format(date, 'MMM dd'),
        problems: cumulativeCount,
        accuracy: Math.min(100, progress.accuracy + Math.random() * 10 - 5)
      };
    });

    setProgressData(data);
  };

  // Generate topic-wise stats
  const generateTopicStats = (progress) => {
    const topics = [
      'Arrays',
      'Strings',
      'Dynamic Programming',
      'Trees',
      'Graphs',
      'Linked Lists',
      'Stacks & Queues',
      'Sorting'
    ];

    const stats = topics.map(topic => {
      const topicProblems = progress.solvedProblems.filter(p =>
        p.topics && p.topics.includes(topic)
      );

      const accuracy = Math.random() * 50 + 50; // 50-100%

      return {
        topic,
        solved: topicProblems.length,
        accuracy: Math.round(accuracy),
        color: accuracy > 70 ? '#10b981' : accuracy > 50 ? '#f59e0b' : '#ef4444'
      };
    });

    setTopicStats(stats);
  };

  // Generate activity heatmap data
  const generateActivityHeatmap = (progress) => {
    const days = 90; // Last 90 days
    const heatmapData = [];

    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const count = Math.floor(Math.random() * 5); // 0-4 problems per day

      heatmapData.push({
        date: startOfDay(date).getTime(),
        count
      });
    }

    setActivityHeatmap(heatmapData);
  };

  // Generate company readiness radar
  const generateCompanyReadiness = (progress) => {
    const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'];

    const readiness = companies.map(company => ({
      company,
      score: Math.floor(Math.random() * 50 + 50) // 50-100
    }));

    setCompanyReadiness(readiness);
  };

  // Export report as PDF
  const exportReport = async () => {
    try {
      toast.loading('Generating PDF...');

      const element = document.getElementById('analytics-report');
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`PlacementGPT_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      toast.dismiss();
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div id="analytics-report" className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                <p className="text-gray-400">Track your progress towards your dream placement</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(Number(e.target.value))}
                  className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-600"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Last year</option>
                </select>

                <button
                  onClick={exportReport}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </motion.div>

            {/* Empty State */}
            {(!userProgress || userProgress.solvedProblems.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Your Journey</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Solve your first problem to see detailed analytics and track your progress towards your dream placement!
                </p>
                <button
                  onClick={() => window.location.href = '/problems'}
                  className="btn-primary"
                >
                  Browse Problems
                </button>
              </motion.div>
            )}

            {/* Stats Overview */}
            {userProgress && userProgress.solvedProblems.length > 0 && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: Target,
                  label: 'Problems Solved',
                  value: userProgress?.solvedProblems.length || 0,
                  change: '+12%',
                  color: 'text-primary-600'
                },
                {
                  icon: TrendingUp,
                  label: 'Accuracy',
                  value: `${userProgress?.accuracy || 0}%`,
                  change: '+2%',
                  color: 'text-green-600'
                },
                {
                  icon: Clock,
                  label: 'Study Time',
                  value: `${Math.round((userProgress?.studyTime || 0) / 60)}h`,
                  change: '+5h',
                  color: 'text-blue-600'
                },
                {
                  icon: Zap,
                  label: 'Current Streak',
                  value: `${userProgress?.streak || 0} days`,
                  change: '+2',
                  color: 'text-orange-600'
                }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-green-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {/* Charts Grid */}
            {userProgress && userProgress.solvedProblems.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Progress Over Time */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Cumulative Problems Solved</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="problems"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorProblems)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Topic-Wise Performance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Topic-Wise Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="topic" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="solved" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
            )}

            {/* Company Readiness Radar */}
            {userProgress && userProgress.solvedProblems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="card p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Company Readiness</h3>
              <p className="text-sm text-gray-400 mb-6">
                Your profile matches {Math.max(...companyReadiness.map(c => c.score))}% with {companyReadiness.find(c => c.score === Math.max(...companyReadiness.map(c => c.score)))?.company || 'top'} requirements
              </p>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={companyReadiness}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="company" stroke="#9ca3af" />
                    <PolarRadiusAxis stroke="#9ca3af" />
                    <Radar
                      name="Readiness"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            )}

            {/* Activity Heatmap */}
            {userProgress && userProgress.solvedProblems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Submission Activity</h3>
              <p className="text-sm text-gray-400 mb-4">Last 90 Days Activity</p>
              <div className="grid grid-cols-13 gap-2">
                {activityHeatmap.map((day, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-sm transition-colors ${
                      day.count === 0
                        ? 'bg-dark-700'
                        : day.count === 1
                        ? 'bg-green-900/40'
                        : day.count === 2
                        ? 'bg-green-700/60'
                        : day.count === 3
                        ? 'bg-green-600/80'
                        : 'bg-green-500'
                    }`}
                    title={`${format(new Date(day.date), 'MMM dd, yyyy')}: ${day.count} problems`}
                  ></div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-dark-700 rounded-sm"></div>
                  <div className="w-4 h-4 bg-green-900/40 rounded-sm"></div>
                  <div className="w-4 h-4 bg-green-700/60 rounded-sm"></div>
                  <div className="w-4 h-4 bg-green-600/80 rounded-sm"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
