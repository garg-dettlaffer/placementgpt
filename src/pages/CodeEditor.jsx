import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, Send, RotateCcw, Settings, ArrowLeft, Timer, CheckCircle } from 'lucide-react';
import { db, auth } from '../services/appwrite';
import { executeCode } from '../services/codeExecution';
import { leetcode } from '../services/leetcode';
import { Query } from 'appwrite';
import toast from 'react-hot-toast';

export default function CodeEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [startTime] = useState(Date.now());
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    loadProblem();
    loadSavedCode();
    
    // Auto-save code every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (code) {
        localStorage.setItem(`code_${slug}_${language}`, code);
      }
    }, 30000);
    
    // Track study time when component unmounts
    return () => {
      trackStudyTime();
      clearInterval(autoSaveInterval);
      // Save code on unmount
      if (code) {
        localStorage.setItem(`code_${slug}_${language}`, code);
      }
    };
  }, [slug, code, language]);

  function loadSavedCode() {
    const savedCode = localStorage.getItem(`code_${slug}_${language}`);
    if (savedCode) {
      setCode(savedCode);
      toast.success('Restored your previous code');
    }
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Custom keybinding: Cmd/Ctrl + Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });
    
    // Custom keybinding: Cmd/Ctrl + S to submit
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, (e) => {
      e?.preventDefault();
      handleSubmit();
    });
    
    // Custom keybinding: Cmd/Ctrl + / for comment toggle (already built-in)
    // Format document: Shift + Alt + F (already built-in)
  }

  async function trackStudyTime() {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // Convert to minutes
      if (timeSpent < 1) return; // Don't track if less than 1 minute
      
      const currentUser = await auth.getCurrentUser();
      const progressDocs = await db.listDocuments('progress', [
        Query.equal('userId', currentUser.$id)
      ]);
      
      if (progressDocs.documents.length > 0) {
        const progressDoc = progressDocs.documents[0];
        await db.updateDocument('progress', progressDoc.$id, {
          studyTime: (progressDoc.studyTime || 0) + timeSpent
        });
      }
    } catch (error) {
      console.error('Error tracking study time:', error);
    }
  }

  async function loadProblem() {
    try {
      setLoading(true);
      
      // Try fetching from Appwrite first
      try {
        const data = await db.getProblem(slug);
        setProblem(data);
        
        // Set starter code if available
        if (data.starterCode) {
          try {
            const starterCode = JSON.parse(data.starterCode);
            setCode(starterCode[language] || '');
          } catch {
            setCode('');
          }
        }
        return;
      } catch (appwriteError) {
        console.log('Problem not in Appwrite, fetching from LeetCode...');
        
        // If not in Appwrite, fetch from LeetCode
        const lcProblem = await leetcode.fetchProblemDetail(slug);
        
        if (lcProblem) {
          // Transform LeetCode problem to our format
          setProblem({
            title: lcProblem.title,
            difficulty: lcProblem.difficulty,
            description: lcProblem.content,
            acceptance: parseFloat(JSON.parse(lcProblem.stats || '{}').acRate || 0),
            tags: lcProblem.topicTags?.map(t => t.name) || []
          });
          
          // Set starter code from LeetCode
          const pythonSnippet = lcProblem.codeSnippets?.find(s => s.langSlug === 'python3');
          if (pythonSnippet) {
            setCode(pythonSnippet.code);
          }
          
          toast.success('Loaded problem from LeetCode');
        } else {
          throw new Error('Problem not found');
        }
      }
    } catch (error) {
      console.error('Error loading problem:', error);
      toast.error('Failed to load problem');
      
      // Fallback to sample problem
      setProblem({
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: JSON.stringify([
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
        ]),
        constraints: JSON.stringify(['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9']),
        acceptance: 48.5,
        tags: JSON.stringify(['Arrays', 'Hash Map'])
      });
      setCode(`def twoSum(nums, target):\n    # Your code here\n    pass`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun() {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setExecuting(true);
    setOutput('Running...');

    try {
      const result = await executeCode(language, code);
      
      if (result.run && result.run.stdout) {
        setOutput(result.run.stdout);
      } else if (result.run && result.run.stderr) {
        setOutput(`Error:\n${result.run.stderr}`);
      } else {
        setOutput('No output');
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  }

  async function handleSubmit() {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setExecuting(true);
    try {
      // Run code to check if it works
      const result = await executeCode(language, code);
      
      // Check if execution was successful (no errors)
      const isSuccess = result.run && !result.run.stderr;
      
      if (isSuccess) {
        // Update user progress in Appwrite
        const currentUser = await auth.getCurrentUser();
        const progressDocs = await db.listDocuments('progress', [
          Query.equal('userId', currentUser.$id)
        ]);
        
        if (progressDocs.documents.length > 0) {
          const progressDoc = progressDocs.documents[0];
          const solvedProblems = JSON.parse(progressDoc.solvedProblems || '[]');
          const attemptedProblems = JSON.parse(progressDoc.attemptedProblems || '[]');
          
          // Add to attempted if not already there
          if (!attemptedProblems.includes(slug)) {
            attemptedProblems.push(slug);
          }
          
          // Add to solved if not already there
          if (!solvedProblems.includes(slug)) {
            solvedProblems.push(slug);
            
            // Update progress document
            await db.updateDocument('progress', progressDoc.$id, {
              solvedProblems: JSON.stringify(solvedProblems),
              attemptedProblems: JSON.stringify(attemptedProblems),
              totalXP: (progressDoc.totalXP || 0) + 10,
              accuracy: Math.round((solvedProblems.length / attemptedProblems.length) * 100)
            });
            
            toast.success('🎉 Problem solved! +10 XP');
          } else {
            toast.success('✅ Code executed successfully!');
          }
        }
      } else {
        // Mark as attempted but not solved
        const currentUser = await auth.getCurrentUser();
        const progressDocs = await db.listDocuments('progress', [
          Query.equal('userId', currentUser.$id)
        ]);
        
        if (progressDocs.documents.length > 0) {
          const progressDoc = progressDocs.documents[0];
          const attemptedProblems = JSON.parse(progressDoc.attemptedProblems || '[]');
          
          if (!attemptedProblems.includes(slug)) {
            attemptedProblems.push(slug);
            const solvedProblems = JSON.parse(progressDoc.solvedProblems || '[]');
            
            await db.updateDocument('progress', progressDoc.$id, {
              attemptedProblems: JSON.stringify(attemptedProblems),
              accuracy: attemptedProblems.length > 0 
                ? Math.round((solvedProblems.length / attemptedProblems.length) * 100)
                : 0
            });
          }
        }
        
        toast.error('Code has errors. Keep trying!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setExecuting(false);
    }
  }

  function handleReset() {
    if (confirm('Reset code to starter template?')) {
      if (problem?.starterCode) {
        try {
          const starterCode = JSON.parse(problem.starterCode);
          setCode(starterCode[language] || '');
        } catch {
          setCode('');
        }
      }
    }
  }

  const languageOptions = [
    { value: 'python', label: 'Python 3' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-600 dark:text-dark-400">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      {/* Navbar */}
      <nav className="h-14 bg-white dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/problems')}
            className="text-dark-500 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">PlacementGPT</span>
            <div className="h-4 w-[1px] bg-dark-600"></div>
            <div className="flex items-center gap-2">
              <h1 className="font-medium text-sm">{problem?.title}</h1>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                problem?.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                problem?.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {problem?.difficulty}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-100 dark:bg-dark-700 rounded border border-dark-200 dark:border-dark-600">
            <Timer className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-mono font-medium">00:14:32</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-400 flex items-center justify-center text-white font-bold text-xs">
            JS
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-2/5 flex flex-col border-r border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900">
          {/* Tabs */}
          <div className="flex items-center px-2 border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-dark-500 hover:text-dark-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-dark-500 hover:text-dark-300'
              }`}
            >
              Submissions
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' && problem && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-dark-900 dark:text-white">
                  {problem.title}
                </h2>
                <p className="text-dark-600 dark:text-dark-300 mb-6 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>

                {/* Examples */}
                {problem.examples && (() => {
                  try {
                    const examples = JSON.parse(problem.examples);
                    return examples.map((example, idx) => (
                      <div key={idx} className="mb-6">
                        <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3">
                          Example {idx + 1}:
                        </h3>
                        <div className="bg-dark-50 dark:bg-dark-800 rounded-lg border-l-4 border-dark-300 dark:border-dark-600 p-4 font-mono text-sm">
                          <div className="mb-2">
                            <span className="text-dark-500">Input:</span>{' '}
                            <span className="text-dark-700 dark:text-dark-300">{example.input}</span>
                          </div>
                          <div className="mb-2">
                            <span className="text-dark-500">Output:</span>{' '}
                            <span className="text-dark-700 dark:text-dark-300">{example.output}</span>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="text-dark-500">Explanation:</span>{' '}
                              <span className="text-dark-700 dark:text-dark-300">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  } catch {
                    return null;
                  }
                })()}

                {/* Constraints */}
                {problem.constraints && (() => {
                  try {
                    const constraints = JSON.parse(problem.constraints);
                    return (
                      <div className="mb-8">
                        <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-3">
                          Constraints:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-dark-600 dark:text-dark-400 ml-1">
                          {constraints.map((constraint, idx) => (
                            <li key={idx}>{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}

                {/* Tags */}
                {problem.tags && (() => {
                  try {
                    const tags = JSON.parse(problem.tags);
                    return (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-dark-100 dark:bg-dark-700 rounded text-xs text-dark-500 border border-dark-200 dark:border-dark-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="flex-1 flex flex-col bg-dark-900">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-dark-700 bg-dark-800">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-dark-700 border border-dark-600 text-dark-200 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-primary-500"
              >
                {languageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="bg-dark-700 border border-dark-600 text-dark-200 text-xs rounded px-2 py-1.5 focus:outline-none"
                title="Font Size"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
              
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-dark-700 border border-dark-600 text-dark-200 text-xs rounded px-2 py-1.5 focus:outline-none"
                title="Theme"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
              
              <span className="text-xs text-dark-500 ml-2">⌘+Enter: Run • ⌘+S: Submit</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-1.5 text-dark-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-dark-400 hover:text-white rounded hover:bg-white/5 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                tabSize: 2,
                insertSpaces: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                quickSuggestions: true,
                snippetSuggestions: 'inline',
                bracketPairColorization: { enabled: true },
                guides: {
                  indentation: true,
                  bracketPairs: true
                },
                padding: { top: 10, bottom: 10 },
                lineNumbersMinChars: 3,
                glyphMargin: true,
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
              }}
            />
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Output Console */}
          <div className="h-48 border-t border-dark-700 flex flex-col bg-dark-800">
            <div className="flex items-center px-4 py-2 border-b border-dark-700 gap-4">
              <button className="text-xs font-medium text-white border-b-2 border-primary-500 pb-2 -mb-2.5">
                Output
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-dark-300">
              <pre className="whitespace-pre-wrap">{output || 'Run your code to see output here...'}</pre>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-4 py-3 bg-dark-900 border-t border-dark-700 flex items-center justify-between">
            <button className="text-dark-400 hover:text-white text-xs flex items-center gap-2 transition-colors">
              Console
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={executing}
                className="px-5 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 border border-dark-600 text-dark-300 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {executing ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
