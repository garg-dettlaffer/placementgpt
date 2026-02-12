import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Mic, Send, RefreshCcw } from 'lucide-react';
import { gemini } from '../services/gemini';
import toast from 'react-hot-toast';

export default function MockInterview() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Ready for a mock interview? Click "Start Interview" to begin.' }
  ]);
  const [input, setInput] = useState('');
  const [interviewing, setInterviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [company, setCompany] = useState('Google');

  const startInterview = async () => {
    setLoading(true);
    try {
      // Clear any existing session first
      gemini.clearChat();
      
      const systemPrompt = `You are conducting a ${interviewType} interview for ${company}. 
${interviewType === 'dsa' ? 'Ask coding questions and evaluate solutions. Start with medium difficulty problems.' : ''}
${interviewType === 'system_design' ? 'Ask system design questions and guide through architecture. Start with a common scenario.' : ''}
${interviewType === 'behavioral' ? 'Ask behavioral questions using STAR method. Focus on leadership, teamwork, and problem-solving.' : ''}

Keep responses concise and professional. Provide constructive feedback. Ask follow-up questions based on the candidate's answers.`;

      await gemini.startChat(systemPrompt);
      setInterviewing(true);
      
      // Get first question from AI
      const firstQuestion = await gemini.sendMessage("Start the interview with an appropriate opening question for this role.");
      setMessages([{ role: 'ai', content: firstQuestion }]);
      toast.success('Interview started!');
    } catch (error) {
      console.error('Start interview error:', error);
      toast.error('Failed to start interview. Please try again.');
      setMessages([{ role: 'ai', content: 'Failed to start interview. Please check your API key and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    gemini.clearChat();
    setInterviewing(false);
    setMessages([{ role: 'ai', content: 'Interview reset. Click "Start Interview" when you\'re ready to begin again.' }]);
    toast.success('Interview reset');
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !interviewing) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get AI response using stateful chat
      const aiResponse = await gemini.sendMessage(input);
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Interview error:', error);
      toast.error('Failed to get response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I apologize, but I encountered an error. Could you please repeat that?' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Mock Interview</h1>
              <div className="flex gap-3">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="input-field"
                  disabled={interviewing}
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="dsa">DSA</option>
                  <option value="system_design">System Design</option>
                </select>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                  disabled={interviewing}
                >
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Meta">Meta</option>
                </select>
                {!interviewing ? (
                  <button 
                    onClick={startInterview}
                    disabled={loading}
                    className="btn-primary whitespace-nowrap disabled:opacity-50"
                  >
                    Start Interview
                  </button>
                ) : (
                  <button 
                    onClick={resetInterview}
                    className="btn-secondary whitespace-nowrap"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="card flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl px-4 py-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-xl px-4 py-3 rounded-lg bg-dark-100 dark:bg-dark-700">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-dark-200 dark:border-dark-700 p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading && interviewing && input.trim()) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={interviewing ? "Type your answer..." : "Start interview to begin"}
                    disabled={!interviewing || loading}
                    className="input-field flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus={interviewing}
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim() || !interviewing}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary px-6" disabled={!interviewing}>
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
