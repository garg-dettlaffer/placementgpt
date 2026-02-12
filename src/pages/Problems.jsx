import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { PROBLEM_TOPICS, DIFFICULTY_LEVELS } from '../utils/constants';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Loader, AlertCircle } from 'lucide-react';
import { leetcode } from '../services/leetcode';
import toast from 'react-hot-toast';

export default function Problems() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real problems from LeetCode
  useEffect(() => {
    fetchProblems();
  }, []);

  async function fetchProblems() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from LeetCode API
      const lcProblems = await leetcode.fetchProblems(100, 0);
      
      // Transform to our format
      const transformed = lcProblems
        .filter(p => !p.paidOnly) // Filter out premium problems
        .map(p => leetcode.transformProblem(p));
      
      setProblems(transformed);
      toast.success(`Loaded ${transformed.length} problems from LeetCode`);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError(error.message);
      toast.error('Failed to load problems from LeetCode. Using fallback data.');
      
      // Fallback to sample data if fetch fails
      setProblems([
        { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: 48, companies: ['Google', 'Amazon'], slug: 'two-sum', tags: ['Array', 'Hash Table'], isPremium: false },
        { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: 34, companies: ['Amazon'], slug: 'add-two-numbers', tags: ['Linked List', 'Math'], isPremium: false },
        { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: 32, companies: ['Facebook'], slug: 'longest-substring-without-repeating-characters', tags: ['String', 'Sliding Window'], isPremium: false },
        { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: 29, companies: ['Google'], slug: 'median-of-two-sorted-arrays', tags: ['Array', 'Binary Search'], isPremium: false },
        { id: 7, title: 'Reverse Integer', difficulty: 'Medium', acceptance: 26, companies: ['Microsoft'], slug: 'reverse-integer', tags: ['Math'], isPremium: false },
        { id: 13, title: 'Roman to Integer', difficulty: 'Easy', acceptance: 55, companies: ['Amazon'], slug: 'roman-to-integer', tags: ['Math', 'String'], isPremium: false },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-900 dark:text-white">
              Problem Library
            </h1>

            {/* Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-3">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedDifficulty === level
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-900 dark:text-white mb-3">
                  Topic
                </label>
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="input-field">
                  <option value="All">All Topics</option>
                  {PROBLEM_TOPICS.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problems Table */}
            <div className="card overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader className="w-8 h-8 animate-spin text-primary-500" />
                  <span className="ml-3 text-dark-600 dark:text-dark-400">Loading problems from LeetCode...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
                  <p className="text-dark-600 dark:text-dark-400 mb-2">Failed to load LeetCode problems</p>
                  <button onClick={fetchProblems} className="btn-primary">Retry</button>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">Difficulty</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">Acceptance</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map((problem, idx) => (
                      <motion.tr
                        key={problem.slug || `problem-${problem.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => navigate(`/code/${problem.slug || `problem-${problem.id}`}`)}
                        className="border-b border-dark-200 dark:border-dark-700 hover:bg-dark-100 dark:hover:bg-dark-800 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{problem.status === 'ac' ? '✓' : '○'}</span>
                            <span className="font-medium text-dark-900 dark:text-white">{problem.title}</span>
                            {problem.isPremium && (
                              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs rounded">Premium</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            problem.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                            problem.difficulty === 'Medium' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                            'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-dark-600 dark:text-dark-400">
                          {Math.round(problem.acceptance)}%
                        </td>
                        <td className="px-6 py-4 text-dark-600 dark:text-dark-400">
                          {Array.isArray(problem.companies) && problem.companies.length > 0
                            ? problem.companies.join(', ')
                            : 'N/A'}
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-dark-600 dark:text-dark-400">
                          No problems found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
