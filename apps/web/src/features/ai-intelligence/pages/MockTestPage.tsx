import { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MockQuestion, MockTestResult } from '../../../shared/types/ai.types';
import {
  Compass,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 1,
    category: 'Aptitude',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: ['65 seconds', '89 seconds', '100 seconds', '75 seconds'],
    correctAnswer: 1, // 89 seconds: Speed = 240/24 = 10 m/s. Total dist = 240+650 = 890m. Time = 890/10 = 89s.
    explanation: 'Speed of train = Length / Time = 240/24 = 10 m/s. Total distance to cross platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.',
  },
  {
    id: 2,
    category: 'Technical (CS)',
    question: 'In React 19, what is the primary benefit of the `use` hook when resolving promises?',
    options: [
      'It allows promises to be awaited directly inside render without useEffect or external state libraries',
      'It creates a new background Web Worker thread automatically',
      'It caches HTTP requests in localStorage forever',
      'It prevents any component re-rendering',
    ],
    correctAnswer: 0,
    explanation: 'React 19’s `use` hook allows you to read the value of a promise or context directly in render, suspending until resolution.',
  },
  {
    id: 3,
    category: 'Reasoning',
    question: 'Find the missing number in the sequence: 4, 9, 25, 49, 121, ?',
    options: ['144', '169', '196', '225'],
    correctAnswer: 1, // 13^2 = 169 (Squares of prime numbers: 2, 3, 5, 7, 11, 13)
    explanation: 'The sequence consists of squares of prime numbers: 2² (4), 3² (9), 5² (25), 7² (49), 11² (121), and next is 13² = 169.',
  },
  {
    id: 4,
    category: 'Technical (CS)',
    question: 'What is the average time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'Balanced BSTs maintain height O(log n), providing O(log n) worst and average case search time.',
  },
  {
    id: 5,
    category: 'Verbal Ability',
    question: 'Choose the word that is most nearly opposite in meaning to "CANDID":',
    options: ['Frank', 'Deceitful', 'Blunt', 'Honest'],
    correctAnswer: 1,
    explanation: 'CANDID means truthful and straightforward. The antonym is DECEITFUL.',
  },
];

export const MockTestPage = () => {
  const [testActive, setTestActive] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);

  useEffect(() => {
    let timer: any;
    if (testActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (testActive && timeLeft === 0) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const handleStartTest = () => {
    setTestActive(true);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setTimeLeft(300);
    setTestResult(null);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitTest = () => {
    setTestActive(false);

    let correctCount = 0;
    const answersBreakdown = MOCK_QUESTIONS.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { questionId: q.id, selected: selected ?? -1, isCorrect };
    });

    const scorePct = Math.round((correctCount / MOCK_QUESTIONS.length) * 100);

    // Trigger celebratory confetti if passed
    if (scorePct >= 60) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }

    setTestResult({
      totalQuestions: MOCK_QUESTIONS.length,
      attempted: Object.keys(selectedAnswers).length,
      correct: correctCount,
      scorePercentage: scorePct,
      timeSpentSeconds: 300 - timeLeft,
      categoryBreakdown: [
        { category: 'Aptitude & Math', correct: 1, total: 1 },
        { category: 'Technical (CS)', correct: correctCount >= 2 ? 2 : 1, total: 2 },
        { category: 'Reasoning & Logic', correct: 1, total: 1 },
        { category: 'Verbal Ability', correct: 1, total: 1 },
      ],
      answers: answersBreakdown,
    });

    toast.success(`Mock Test Completed! Score: ${scorePct}%`);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currQ = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Compass className="w-3.5 h-3.5" />
            Recruiter Aptitude & Coding Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            AI Placement Mock Assessment Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Practice timed cognitive, quantitative, and core technical questions with instant grading.
          </p>
        </div>

        {testActive && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-mono font-bold text-sm shadow-xs">
            <Clock className="w-4 h-4 animate-pulse text-amber-600" />
            {formatTimer(timeLeft)}
          </div>
        )}
      </div>

      {/* Test Not Started */}
      {!testActive && !testResult && (
        <Card className="text-center p-12 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              Campus Placement Qualifier Diagnostic
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              5 Questions · 5 Minutes · Covers Quantitative Aptitude, CS Fundamentals, Logic & Verbal.
            </p>
          </div>
          <Button variant="primary" size="lg" pill onClick={handleStartTest}>
            Start Timed Assessment
          </Button>
        </Card>
      )}

      {/* Active Test Screen */}
      {testActive && (
        <Card className="space-y-6">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {currQ.category}
              </Badge>
              <span className="text-xs font-bold text-stone-400">
                Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
              </span>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              {Object.keys(selectedAnswers).length} / {MOCK_QUESTIONS.length} Answered
            </span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50 leading-relaxed">
            {currQ.question}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-stone-800 border flex items-center justify-center font-mono text-xs text-stone-500 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <Button
              variant="outline"
              size="sm"
              pill
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            >
              Previous
            </Button>

            {currentIdx < MOCK_QUESTIONS.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                pill
                onClick={() => setCurrentIdx((i) => Math.min(MOCK_QUESTIONS.length - 1, i + 1))}
              >
                Next Question
              </Button>
            ) : (
              <Button variant="primary" size="sm" pill onClick={handleSubmitTest}>
                Submit & Grade Assessment
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Test Score Report View */}
      {testResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Performance Report
              </span>
              <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50">
                {testResult.scorePercentage}% Score ({testResult.correct}/{testResult.totalQuestions} Correct)
              </h2>
              <p className="text-xs text-stone-500">
                {testResult.scorePercentage >= 60
                  ? '🎉 Qualified for Next Technical Round'
                  : 'Needs revision in core quantitative reasoning'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              pill
              onClick={handleStartTest}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retake Assessment
            </Button>
          </Card>

          {/* Detailed Question Review & Explanations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Answer Key & Comprehensive Explanations
            </h3>

            {MOCK_QUESTIONS.map((q, idx) => {
              const userSelected = selectedAnswers[q.id];
              const isCorrect = userSelected === q.correctAnswer;

              return (
                <Card key={q.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                    <span className="text-xs font-mono text-stone-400">{q.category}</span>
                  </div>

                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {idx + 1}. {q.question}
                  </p>

                  <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-xs space-y-1">
                    <div>
                      Your Answer:{' '}
                      <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                        {userSelected !== undefined ? q.options[userSelected] : 'Not Answered'}
                      </span>
                    </div>
                    <div>
                      Correct Answer:{' '}
                      <span className="text-emerald-600 font-bold">{q.options[q.correctAnswer]}</span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 pt-1.5 border-t border-stone-200/60 dark:border-stone-800">
                      💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
