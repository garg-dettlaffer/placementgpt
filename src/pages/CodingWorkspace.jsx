import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Code, Play, Send, Lightbulb } from 'lucide-react';

export default function CodingWorkspace() {
  const { slug } = useParams();
  const [code, setCode] = useState('def solution():\n    pass');
  const [language, setLanguage] = useState('Python 3');
  const [activeTab, setActiveTab] = useState('description');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    // Mock code execution
    setOutput('Output will appear here');
  };

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-80px)]">
            {/* Left Panel - Problem */}
            <div className="flex flex-col bg-white dark:bg-dark-800 rounded-lg overflow-hidden">
              <div className="border-b border-dark-200 dark:border-dark-700 p-4 flex gap-2">
                {['description', 'editorial', 'submissions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeTab === tab
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'description' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">
                      {slug?.replace(/-/g, ' ').title()}
                    </h2>
                    <div className="space-y-4 text-dark-700 dark:text-dark-300">
                      <p>Problem description will load here...</p>
                      <div>
                        <h3 className="font-bold mb-2">Example:</h3>
                        <pre className="bg-dark-100 dark:bg-dark-700 p-3 rounded overflow-x-auto">
                          Input: []
Output: []
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'editorial' && (
                  <p className="text-dark-600 dark:text-dark-400">Unlock with Pro to view editorial</p>
                )}
                {activeTab === 'submissions' && (
                  <p className="text-dark-600 dark:text-dark-400">Your submissions will appear here</p>
                )}
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="flex flex-col bg-white dark:bg-dark-800 rounded-lg overflow-hidden">
              <div className="border-b border-dark-200 dark:border-dark-700 p-4 flex items-center justify-between">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field w-40 text-sm">
                  <option>Python 3</option>
                  <option>Java</option>
                  <option>C++</option>
                  <option>JavaScript</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={handleRun} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    <Play className="w-4 h-4" />
                    Run
                  </button>
                  <button className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                    Submit
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-4 font-mono text-sm bg-dark-900 dark:bg-dark-950 text-white border-0 focus:outline-none"
                  style={{ borderRadius: 0 }}
                />
                <div className="border-t border-dark-200 dark:border-dark-700 p-4 bg-dark-50 dark:bg-dark-800 max-h-40 overflow-y-auto">
                  <p className="text-xs font-semibold text-dark-600 dark:text-dark-400 mb-2">OUTPUT</p>
                  <pre className="text-sm text-dark-700 dark:text-dark-300 font-mono">{output || 'Run code to see output'}</pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
