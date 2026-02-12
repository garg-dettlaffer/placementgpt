import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Mic, Send, Clock } from 'lucide-react';
import { conductInterview } from '../services/gemini';
import toast from 'react-hot-toast';

export default function MockInterview() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Ready for a mock interview? Let\'s start with a warm-up question.' }
  ]);
  const [input, setInput] = useState('');
  const [interviewing, setInterviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewType, setInterviewType] = useState('behavioral');
  const [company, setCompany] = useState('Google');

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Create conversation history for Gemini
      const conversationHistory = [...messages, userMessage];
      
      // Get AI response
      const aiResponse = await conductInterview(
        interviewType,
        company,
        conversationHistory
      );
      
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
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Mock Interview</h1>
              <div className="flex gap-3">
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="input-field"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="dsa">DSA</option>
                  <option value="system_design">System Design</option>
                </select>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field"
                >
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Meta">Meta</option>
                </select>
              </div>
            </  {loading && (
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
              div>

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
                      }`}!loading && handleSend()}
                    placeholder="Type your answer..."
                    disabled={loading}
                    className="input-field flex-1"
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-dark-200 dark:border-dark-700 p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your answer..."
                    className="input-field flex-1"
                  />
                  <button onClick={handleSend} className="btn-primary px-6">
                    <Send className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary px-6">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
