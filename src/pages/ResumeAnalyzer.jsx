import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeResume } from '../services/gemini';
import toast from 'react-hot-toast';

// Set worker path for PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

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
    // Validate file
    if (!uploadedFile) return;
    
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(uploadedFile.type)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    
    if (uploadedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setFile(uploadedFile);
    setUploaded(true);
    setAnalyzing(true);
    
    try {
      let text = '';
      
      // Extract text based on file type
      if (uploadedFile.type === 'application/pdf') {
        text = await extractPdfText(uploadedFile);
      } else {
        // For DOC/DOCX, use simple text reader (or integrate mammoth.js for better extraction)
        text = await readFileAsText(uploadedFile);
      }
      
      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract enough text from the file');
      }
      
      // Validate if content looks like a resume
      const lowerText = text.toLowerCase();
      const resumeKeywords = ['experience', 'education', 'skills', 'work', 'project', 'university', 'college', 'intern', 'job', 'position'];
      const keywordMatches = resumeKeywords.filter(keyword => lowerText.includes(keyword)).length;
      
      if (keywordMatches < 2) {
        toast.error('⚠️ This doesn\'t appear to be a resume. Please upload your actual resume.');
        throw new Error('File content does not match resume format');
      }
      
      // Analyze with Gemini
      const result = await analyzeResume(text);
      
      if (!result || !result.atsScore) {
        throw new Error('Invalid analysis result from AI');
      }
      
      setAnalysisResult(result);
      setAnalyzed(true);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = error.message || 'Unknown error';
      toast.error(`Analysis failed: ${errorMsg}. Using sample data.`);
      // Use mock data as fallback
      setAnalysisResult({
        score: 7.2,
        atsScore: 92,
        relevanceScore: 65,
        brevityScore: 8,
        missingKeywords: ['React', 'Docker', 'AWS', 'System Design'],
        suggestions: [
          {
            original: 'Worked on web development projects',
            improved: 'Developed and deployed 5+ full-stack web applications using React and Node.js, serving 10,000+ users',
            scoreImpact: '+8 points'
          },
          {
            original: 'Did internship at tech company',
            improved: 'Software Engineering Intern at Amazon - Optimized database queries reducing latency by 40%',
            scoreImpact: '+12 points'
          }
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

  const extractPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
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
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
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
                    {analysisResult && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={handleRemove}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <span className="text-center">
                            <div className="text-4xl font-bold text-primary-600">
                              {analysisResult?.score || 7.2}/10
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Overall Score</p>
                          </span>
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
                            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Improvements
                            </h3>
                            <div className="space-y-4">
                              {Array.isArray(analysisResult.suggestions) && analysisResult.suggestions.map((suggestion, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border ${
                                  typeof suggestion === 'string'
                                    ? 'border-dark-200 dark:border-dark-700'
                                    : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                                }`}>
                                  {typeof suggestion === 'string' ? (
                                    <p className="text-sm text-dark-600 dark:text-dark-400">• {suggestion}</p>
                                  ) : (
                                    <>
                                      <p className="text-sm line-through text-dark-500 mb-2">{suggestion.original}</p>
                                      <p className="text-sm text-green-600 dark:text-green-400 mb-2">✓ {suggestion.improved}</p>
                                      {suggestion.scoreImpact && (
                                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">
                                          {suggestion.scoreImpact}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Keywords */}
                        {analysisResult?.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              Missing Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.missingKeywords.map((keyword, idx) => (
                                <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strengths */}
                        {analysisResult?.strengths && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3">Strengths</h3>
                            <ul className="space-y-2">
                              {analysisResult.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-dark-600 dark:text-dark-400 flex gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
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
