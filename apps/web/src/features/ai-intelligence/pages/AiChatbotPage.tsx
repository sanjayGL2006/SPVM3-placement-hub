import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useStudentStore } from '../../students/stores/studentStore';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { ChatMessage } from '../../../shared/types/ai.types';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldAlert,
  BarChart2,
  Table as TableIcon,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import toast from 'react-hot-toast';

export const AiChatbotPage = () => {
  const { user } = useAuthStore();
  const { students } = useStudentStore();
  const { companies } = useCompanyStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      content: `Hello ${user?.name || 'there'}! I am your AI Placement Intelligence assistant. I have full context of active placement drives, student profiles, ATS scores, and recruiter packages. Ask me anything!`,
      timestamp: 'Just now',
      suggestions: [
        'What is the highest package offered?',
        'Show BCA department placement rate',
        'Which companies are visiting next week?',
        'Compare BBA vs BCA statistics',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const text = queryText || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      let reply: ChatMessage;

      // Permission Boundary Simulation
      if (user?.role === 'hod' && user.department === 'Computer Applications' && (q.includes('bba') || q.includes('commerce') || q.includes('hotel'))) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: `⚠️ Access Boundary Notice: As Head of Department for Computer Applications, your security scope isolates other department student private records. However, I can provide overall BCA cohort intelligence or anonymized university benchmarks.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Show BCA top packages', 'BCA student eligibility list'],
        };
      } else if (q.includes('highest') || q.includes('package') || q.includes('ctc')) {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: `The highest CTC package this recruitment season is ₹24.0 LPA offered by Google (Associate Software Engineer), followed by Goldman Sachs at ₹21.0 LPA. The cohort average package is currently ₹7.4 LPA.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataCard: {
            type: 'kpi',
            title: 'Top Compensation Highlights',
            metrics: [
              { label: 'Highest Offer', value: '₹24.0 LPA', change: 'Google' },
              { label: 'Average Package', value: '₹7.4 LPA', change: '+14% YoY' },
              { label: 'Median Package', value: '₹6.8 LPA' },
            ],
          },
          suggestions: ['List all Dream tier companies', 'Show Deloitte shortlist'],
        };
      } else if (q.includes('rate') || q.includes('bca') || q.includes('stats')) {
        const bcaStudents = students.filter((s) => s.course === 'BCA');
        const bcaPlaced = bcaStudents.filter((s) => s.placement.status === 'Placed').length;
        const bcaRate = bcaStudents.length > 0 ? ((bcaPlaced / bcaStudents.length) * 100).toFixed(1) : '68.5';

        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: `Here is the current placement performance summary for the Computer Applications (BCA) department:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataCard: {
            type: 'table',
            title: 'BCA Placement Cohort Summary',
            tableData: {
              headers: ['Metric', 'Current Value', 'Status'],
              rows: [
                ['Total BCA Cohort', `${bcaStudents.length} Students`, 'Active'],
                ['Confirmed Placements', `${bcaPlaced} Placed`, 'Verified'],
                ['Placement Success Rate', `${bcaRate}%`, 'On Target'],
                ['Average BCA Package', '₹8.2 LPA', '+16% YoY'],
              ],
            },
          },
          suggestions: ['Which companies hired BCA students?', 'Show upcoming coding rounds'],
        };
      } else {
        reply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: `I have analyzed our campus placement databases. We currently have 40+ active hiring partners, 12 ongoing recruitment drives, and 780 placed students across all academic branches.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Highest package offered?', 'Show BCA stats', 'Upcoming drives schedule'],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
          <Bot className="w-3.5 h-3.5" />
          Natural Language Career & Placement Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
          AI Placement Operations Assistant
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Ask questions in natural language with strict RBAC permission boundary verification.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col h-[640px]">
        {/* Messages List Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50/40 dark:bg-stone-900/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 max-w-2xl',
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                  msg.sender === 'user'
                    ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm'
                )}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={cn(
                    'p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs',
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#252525] border border-stone-200/80 dark:border-stone-700/80 text-stone-800 dark:text-stone-100 rounded-tl-none'
                  )}
                >
                  <p>{msg.content}</p>

                  {/* Inline Data Card Render */}
                  {msg.dataCard && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 space-y-2">
                      <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {msg.dataCard.title}
                      </div>

                      {msg.dataCard.type === 'kpi' && msg.dataCard.metrics && (
                        <div className="grid grid-cols-3 gap-2 text-center pt-1">
                          {msg.dataCard.metrics.map((m, i) => (
                            <div key={i} className="p-2 rounded-xl bg-white dark:bg-stone-800 border">
                              <div className="text-[10px] text-stone-400 font-medium">{m.label}</div>
                              <div className="text-sm font-extrabold text-stone-900 dark:text-stone-50">
                                {m.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.dataCard.type === 'table' && msg.dataCard.tableData && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b text-stone-400 font-bold uppercase text-[10px]">
                                {msg.dataCard.tableData.headers.map((h, i) => (
                                  <th key={i} className="py-1 px-2">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200/50">
                              {msg.dataCard.tableData.rows.map((r, i) => (
                                <tr key={i}>
                                  {r.map((c, j) => (
                                    <td key={j} className="py-1.5 px-2 font-medium">{c}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggestions Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold p-2">
              <Bot className="w-4 h-4 animate-spin-once" />
              <span>AI is querying placement vector index...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1C1C] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about placed students, compensation stats, recruiter drives..."
            className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-5 py-3 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <Button
            variant="primary"
            size="md"
            pill
            disabled={!input.trim()}
            onClick={() => handleSend()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
