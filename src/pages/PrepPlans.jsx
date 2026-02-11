import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { TOP_COMPANIES } from '../utils/constants';
import { motion } from 'framer-motion';

export default function PrepPlans() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = TOP_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-dark-900 dark:text-white">
              Targeted Prep Paths
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mb-8">
              Personalized preparation roadmaps for your target companies
            </p>

            {/* Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Find company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full max-w-md"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {['All', 'Visits Campus', 'High Package', 'Startups'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-white border border-dark-200 dark:border-dark-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {filtered.map((company, idx) => (
                <motion.div
                  key={company.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/prep-plan/${company.slug}`)}
                  className="card p-6 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4" />
                  <h3 className="font-bold text-lg text-dark-900 dark:text-white mb-2">
                    {company.name}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                    {company.avgPackage} • {company.role}
                  </p>
                  <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full mb-2">
                    <div className="h-full w-1/3 bg-primary-500 rounded-full" />
                  </div>
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    33% Complete
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
