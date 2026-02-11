import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { PROBLEM_TOPICS, DIFFICULTY_LEVELS } from '../utils/constants';
import { motion } from 'framer-motion';
import { BookOpen, Zap } from 'lucide-react';

const SAMPLE_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: 48, company: 'Google', solved: true },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: 34, company: 'Amazon', solved: false },
  { id: 3, title: 'Longest Substring', difficulty: 'Medium', acceptance: 32, company: 'Facebook', solved: false },
  { id: 4, title: 'Median of Two Arrays', difficulty: 'Hard', acceptance: 29, company: 'Google', solved: false },
];

export default function Problems() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const filtered = SAMPLE_PROBLEMS.filter(p => {
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
                  {filtered.map((problem, idx) => (
                    <motion.tr
                      key={problem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigate(`/problem/problem-${problem.id}`)}
                      className="border-b border-dark-200 dark:border-dark-700 hover:bg-dark-100 dark:hover:bg-dark-800 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{problem.solved ? '✓' : '○'}</span>
                          <span className="font-medium text-dark-900 dark:text-white">{problem.title}</span>
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
                        {problem.acceptance}%
                      </td>
                      <td className="px-6 py-4 text-dark-600 dark:text-dark-400">
                        {problem.company}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
