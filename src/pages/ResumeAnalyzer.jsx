import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeAnalyzer() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => setAnalyzed(true), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-900 dark:text-white">
              Resume Analyzer
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="card p-12">
                {!uploaded ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-dark-900 dark:text-white font-semibold mb-2">
                      Upload Your Resume
                    </p>
                    <p className="text-small text-dark-600 dark:text-dark-400 mb-6">
                      Drag and drop or click to upload PDF
                    </p>
                    <button
                      onClick={handleUpload}
                      className="btn-primary"
                    >
                      Choose File
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-dark-900 dark:text-white font-semibold">
                      resume.pdf
                    </p>
                    <p className="text-small text-green-600 dark:text-green-400 mb-4">
                      ✓ Uploaded successfully
                    </p>
                  </div>
                )}
              </div>

              {/* Analysis Result */}
              {analyzed && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                    AI Analysis Report
                  </h2>

                  {/* Score */}
                  <div className="text-center mb-8">
                    <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                      7.2/10
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 mt-2">Overall Score</p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-dark-900 dark:text-white">ATS Parsability</span>
                        <span className="text-sm font-bold text-primary-600">92%</span>
                      </div>
                      <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-green-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-dark-900 dark:text-white">Relevance</span>
                        <span className="text-sm font-bold text-orange-600">65%</span>
                      </div>
                      <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-orange-500" />
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary w-full">
                    Generate Optimized Resume
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
