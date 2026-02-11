import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { Mic, Send, Clock } from 'lucide-react';

export default function MockInterview() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Ready for a mock interview? Let\'s start with a warm-up question.' }
  ]);
  const [input, setInput] = useState('');
  const [interviewing, setInterviewing] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
            <h1 className="text-3xl font-bold mb-6 text-dark-900 dark:text-white">Mock Interview</h1>

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
                      {msg.content}
                    </div>
                  </motion.div>
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
