export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  content: string;
  timestamp: string;
  dataCard?: {
    type: 'kpi' | 'table' | 'chart' | 'alert';
    title: string;
    metrics?: { label: string; value: string | number; change?: string }[];
    tableData?: { headers: string[]; rows: (string | number)[][] };
    chartData?: { name: string; value: number }[];
  };
  suggestions?: string[];
}

export interface ResumeAnalysisResult {
  overallScore: number;
  atsScore: number;
  formattingScore: number;
  skillsScore: number;
  fileName: string;
  fileSize: string;
  analyzedAt: string;
  candidateName?: string;
  targetRole: string;
  skillsFound: string[];
  skillsMissing: string[];
  strengths: string[];
  improvements: {
    id: string;
    severity: 'high' | 'medium' | 'low';
    section: 'Experience' | 'Skills' | 'Formatting' | 'Impact & Metrics' | 'Education';
    issue: string;
    suggestion: string;
  }[];
  extractedSummary: string;
}

export interface SkillsGapTarget {
  role: string;
  overallMatchPercentage: number;
  currentSkills: { name: string; level: number; category: string }[];
  requiredSkills: { name: string; importance: 'Essential' | 'Preferred' | 'Bonus'; matched: boolean }[];
  recommendedCourses: { title: string; provider: string; duration: string; url: string }[];
  projectIdeas: { title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; description: string }[];
}

export interface MockQuestion {
  id: number;
  category: 'Aptitude' | 'Reasoning' | 'Technical (CS)' | 'Core Java & Python' | 'Verbal Ability';
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface MockTestResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  categoryBreakdown: { category: string; correct: number; total: number }[];
  answers: { questionId: number; selected: number; isCorrect: boolean }[];
}

export interface MockInterviewQuestion {
  id: number;
  category: 'HR' | 'Technical' | 'Behavioral' | 'Situational';
  question: string;
  sampleAnswer: string;
  tips: string[];
}
