import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function PrepPlanDetails() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-900 dark:text-white">
              {slug?.toUpperCase()} Preparation Plan
            </h1>
            
            <div className="card p-8">
              <div className="flex gap-4 mb-8 border-b border-dark-200 dark:border-dark-700">
                {['roadmap', 'questions', 'tips', 'resources'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                        : 'text-dark-600 dark:text-dark-400'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="min-h-96">
                {activeTab === 'roadmap' && (
                  <div className="space-y-4">
                    <p className="text-dark-600 dark:text-dark-400">
                      Week-by-week preparation roadmap loading...
                    </p>
                  </div>
                )}
                {activeTab === 'questions' && (
                  <div className="space-y-4">
                    <p className="text-dark-600 dark:text-dark-400">
                      Past interview questions loading...
                    </p>
                  </div>
                )}
                {activeTab === 'tips' && (
                  <div className="space-y-4">
                    <p className="text-dark-600 dark:text-dark-400">
                      Interview tips and strategies loading...
                    </p>
                  </div>
                )}
                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <p className="text-dark-600 dark:text-dark-400">
                      Curated resources loading...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
