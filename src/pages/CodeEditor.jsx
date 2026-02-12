import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Send, Loader, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { piston } from '../services/piston';
import toast from 'react-hot-toast';

const STARTER_CODE = {
  python: 'def solution():\n    pass',
  javascript: 'function solution() {\n    \n}',
  java: 'class Solution {\n    public void solve() {\n        \n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}'
};

export default function CodeEditor() {
  const { slug } = useParams();
  const [code, setCode] = useState(STARTER_CODE.python);
  const [language, setLanguage] = useState('Python 3');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const problem = {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' }
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', output: '[0,1]' },
      { input: '[3,2,4]\n6', output: '[1,2]' }
    ]
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    try {
      const result = await piston.execute(language, code);
      setOutput(result.run?.stdout || result.run?.stderr || 'No output');
      if (result.run?.code === 0) {
        toast.success('Code executed successfully');
      } else {
        toast.error('Runtime error');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error('Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setRunning(true);
    try {
      const result = await piston.execute(language, code, '', problem.testCases);
      if (result.testResults) {
        setTestResults(result.testResults);
        const allPassed = result.testResults.every(t => t.passed);
        if (allPassed) {
          toast.success('All test cases passed!');
        } else {
          toast.error('Some test cases failed');
        }
      }
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex gap-4 p-4 overflow-hidden">
          
          {/* Left - Problem */}
          <div className="w-1/2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                problem.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-950 text-green-700' :
                problem.difficulty === 'Medium' ? 'bg-orange-100 dark:bg-orange-950 text-orange-700' :
                'bg-red-100 dark:bg-red-950 text-red-700'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300">{problem.description}</p>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
                    <div className="space-y-2 font-mono text-sm">
                      <div><span className="text-slate-500">Input:</span> <span className="text-slate-900 dark:text-white">{ex.input}</span></div>
                      <div><span className="text-slate-500">Output:</span> <span className="text-blue-600 dark:text-blue-400">{ex.output}</span></div>
                      {ex.explanation && <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">{ex.explanation}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Editor */}
          <div className="w-1/2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Python 3</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
              </select>

              <div className="flex gap-2">
                <button onClick={handleRun} disabled={running} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2">
                  {running ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run
                </button>
                <button onClick={handleSubmit} disabled={running} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-slate-950 text-green-400 border-0 focus:outline-none resize-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />

            <div className="h-40 border-t border-slate-200 dark:border-slate-800 overflow-y-auto">
              {testResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {testResults.map((test, i) => (
                    <div key={i} className={`p-3 rounded-lg ${test.passed ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {test.passed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                        <span className="font-semibold text-sm">Test Case {i + 1}</span>
                      </div>
                      {!test.passed && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          <div>Expected: {test.expectedOutput}</div>
                          <div>Got: {test.actualOutput}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">OUTPUT</div>
                  <pre className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">{output || 'Run code to see output...'}</pre>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
