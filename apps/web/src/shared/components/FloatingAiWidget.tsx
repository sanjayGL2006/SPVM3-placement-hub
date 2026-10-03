import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, CornerDownLeft } from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export const FloatingAiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your AI Placement Assistant. How can I help you analyze stats, eligibility, or student profiles today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    const userQuery = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "I have indexed current placement metrics. Let me know if you'd like department breakdowns, top packages, or mock test prep!";
      const q = userQuery.toLowerCase();

      // Check permission isolation for HOD
      if (user?.role === 'hod' && user.department === 'Computer Applications' && (q.includes('bba') || q.includes('hotel'))) {
        aiReply = `⚠️ Security Notice: As HOD of Computer Applications, you do not have permission to access other department private dossiers. However, BCA placement rate currently stands at 68.4% with 45 students placed!`;
      } else if (q.includes('highest') || q.includes('package')) {
        aiReply = `The highest package this season is ₹24.0 LPA at Google, followed by ₹21.0 LPA at Goldman Sachs. Average CTC across placed students is ₹7.4 LPA.`;
      } else if (q.includes('placed') || q.includes('stats')) {
        aiReply = `Currently, 780 out of 1,250 registered students are placed (62.4% placement rate). 120 students are actively undergoing Round 2 & 3 technical interviews.`;
      } else if (q.includes('deloitte')) {
        aiReply = `Deloitte's ongoing drive has 32 shortlisted students for Technical Interview round with a package of ₹8.5 LPA.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 p-3.5 rounded-full btn-gradient-primary shadow-xl hover:scale-105 transition-transform flex items-center gap-2 group ring-4 ring-indigo-500/20"
          title="Open AI Placement Assistant"
        >
          <Bot className="w-6 h-6 text-white animate-bounce-subtle" />
          <span className="hidden group-hover:inline text-xs font-bold pr-1 text-white">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Box */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-40 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col h-[460px] animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-white/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">AI Placement Assistant</h4>
                <p className="text-[10px] text-white/80">Active Context Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/ai/chatbot');
                }}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg font-medium"
              >
                Expand
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-stone-50/50 dark:bg-stone-900/30">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex flex-col max-w-[85%] rounded-2xl p-3 leading-relaxed',
                  m.sender === 'user'
                    ? 'ml-auto bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-br-none'
                    : 'mr-auto bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200 rounded-bl-none'
                )}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-medium p-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1C1C] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs px-3.5 py-2 rounded-full border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-full btn-gradient-primary text-white disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
