import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Upload, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeResume } from '../services/gemini';
import toast from 'react-hot-toast';

export default function ResumeAnalyzer() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    }
  });

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setUploaded(true);
    setAnalyzing(true);
    
    try {
      // Read file content
      const text = await readFileAsText(uploadedFile);
      
      // Analyze with Gemini
      const result = await analyzeResume(text);
      setAnalysisResult(result);
      setAnalyzed(true);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resume. Using sample analysis.');
      // Use mock data as fallback
      setAnalysisResult({
        score: 7.2,
        atsScore: 92,
        relevanceScore: 65,
        suggestions: [
          'Add more specific technical skills',
          'Quantify your achievements with metrics',
          'Include action verbs in bullet points'
        ],
        strengths: [
          'Clear formatting',
          'Good education section',
          'Relevant experience'
        ]
      });
      setAnalyzed(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleRemove = () => {
    setFile(null);
    setUploaded(false);
    setAnalyzed(false);
    setAnalysisResult(null);
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
                  <div 
                    {...getRootProps()} 
                    className={`text-center cursor-pointer border-2 border-dashed rounded-lg p-8 transition-colors ${
                      isDragActive 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                        : 'border-dark-300 dark:border-dark-700 hover:border-primary-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-dark-900 dark:text-white font-semibold mb-2">
                      {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                    </p>
                    <p className="text-small text-dark-600 dark:text-dark-400 mb-6">
                      Drag and drop or click to upload PDF, DOC, or DOCX
                    </p>
                    <button
                      type="button"
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
                      {file?.name}
                    </p>
                    <p className="text-small text-green-600 dark:text-green-400 mb-4">
                      ✓ Uploaded successfully
                    </p>
                    {analyzing && (
                      <p className="text-small text-primary-600 dark:text-primary-400">
                        Analyzing with AI...
                      </p>
                    )}
                    <button
                      onClick={handleRemove}
                      className="btn-secondary mt-4 flex items-center gap-2 mx-auto"
                    >
                      <X className="w-4 h-4" />
                      {analysisResult?.score || 7.2}/10
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 mt-2">Overall Score</p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-dark-900 dark:text-white">ATS Parsability</span>
                        <span className="text-sm font-bold text-primary-600">{analysisResult?.atsScore || 92}%</span>
                      </div>
                      <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${analysisResult?.atsScore || 92}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-dark-900 dark:text-white">Relevance</span>
                        <span className="text-sm font-bold text-orange-600">{analysisResult?.relevanceScore || 65}%</span>
                      </div>
                      <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${analysisResult?.relevanceScore || 65}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {analysisResult?.suggestions && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3">Top Suggestions</h3>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.slice(0, 3).map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-dark-600 dark:text-dark-400 flex gap-2">
                            <span className="text-primary-500">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}trics */}
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
