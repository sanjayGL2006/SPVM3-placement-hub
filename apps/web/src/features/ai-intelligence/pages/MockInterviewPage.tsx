import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import {
  Video,
  Mic,
  MicOff,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    category: 'Technical Architecture',
    question: 'How would you architect a real-time notification service that scales to 500k concurrent university students during campus drive announcements?',
    sampleAnswer: 'I would use a distributed pub/sub architecture like Redis Pub/Sub or Apache Kafka, with a fleet of Node.js WebSocket gateway workers managed behind an NGINX load balancer. Ephemeral notification state can be cached in Redis with persistence to PostgreSQL.',
    tips: ['Mention WebSockets vs SSE', 'Discuss database connection pooling', 'Address message deduplication'],
  },
  {
    id: 2,
    category: 'Behavioral & Leadership',
    question: 'Tell me about a time when you had a disagreement with a team member during a hackathon or capstone project. How did you resolve it?',
    sampleAnswer: 'In our placement portal project, we disagreed on state management architecture. I created a quick prototype benchmark comparing Zustand and Redux Toolkit, showing lower boilerplate and faster render times. We aligned objectively based on empirical performance.',
    tips: ['Use STAR method (Situation, Task, Action, Result)', 'Focus on collaborative resolution and mutual respect'],
  },
  {
    id: 3,
    category: 'HR & Culture Fit',
    question: 'Why do you want to join our engineering team, and where do you see your technical trajectory in the next 3 years?',
    sampleAnswer: 'I admire your engineering culture and focus on high-reliability distributed systems. Over the next 3 years, I aim to master cloud infrastructure, lead core feature initiatives, and mentor junior engineers while contributing to open-source.',
    tips: ['Demonstrate research on company tech stack', 'Show long-term commitment and growth mindset'],
  },
];

export const MockInterviewPage = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currQ = INTERVIEW_QUESTIONS[currentIdx];

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Microphone listening... Speak clearly.');
      setTimeout(() => {
        setUserResponse(
          'I would approach this by isolating the ingress WebSocket connections into stateless Node.js gateway nodes with Redis pub/sub messaging channels.'
        );
      }, 2000);
    } else {
      setIsRecording(false);
      toast('Audio recording stopped.');
    }
  };

  const handleEvaluateAI = () => {
    toast.loading('AI is scoring your response on technical accuracy & clarity...');
    setTimeout(() => {
      toast.dismiss();
      setFeedback(
        'Excellent clarity! Score: 92/100. Strengths: Correct identification of stateless WebSocket gateways and Redis pub/sub. Improvement: Mention rate-limiting or backpressure handling for peak load spikes.'
      );
      toast.success('AI Evaluation Ready!');
    }, 1000);
  };

  const handleNext = () => {
    if (currentIdx < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setUserResponse('');
      setShowAnswer(false);
      setFeedback(null);
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
          <Video className="w-3.5 h-3.5" />
          Simulated Recruiter AI Coach
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
          AI Mock Interview & Communication Grader
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Practice standard technical and behavioral questions with instant speech & answer feedback.
        </p>
      </div>

      {/* Main Question Card */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <Badge variant="primary" size="sm">
            {currQ.category}
          </Badge>
          <span className="text-xs font-bold text-stone-400">
            Question {currentIdx + 1} of {INTERVIEW_QUESTIONS.length}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-50 leading-relaxed">
          "{currQ.question}"
        </h3>

        {/* Response Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Your Spoken / Typed Response
            </span>
            <button
              onClick={handleToggleMic}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              {isRecording ? 'Listening...' : 'Voice Record'}
            </button>
          </div>

          <textarea
            rows={4}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your structured answer, or click 'Voice Record' to speak..."
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => setShowAnswer(!showAnswer)}
            leftIcon={<Lightbulb className="w-3.5 h-3.5 text-amber-500" />}
          >
            {showAnswer ? 'Hide Sample Answer' : 'Show Ideal Recruiter Answer'}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              pill
              disabled={!userResponse.trim()}
              onClick={handleEvaluateAI}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Grade with AI
            </Button>

            {currentIdx < INTERVIEW_QUESTIONS.length - 1 && (
              <Button
                variant="secondary"
                size="sm"
                pill
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            )}
          </div>
        </div>

        {/* AI Feedback Box */}
        {feedback && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1 text-xs animate-slide-up">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI Coach Assessment & Grading
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Sample Answer Box */}
        {showAnswer && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2 text-xs animate-slide-up">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Ideal Answer Architecture
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {currQ.sampleAnswer}
            </p>
            <div className="pt-2 border-t border-amber-200/50">
              <span className="font-bold text-amber-900 dark:text-amber-300">Key Tips: </span>
              <span className="text-stone-600 dark:text-stone-400">{currQ.tips.join(' · ')}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
