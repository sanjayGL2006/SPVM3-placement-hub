import { User } from '../../../shared/types/global.types';
import { Card } from '../../../shared/components/ui/Card';
import { Badge } from '../../../shared/components/ui/Badge';
import { useStudentStore } from '../../students/stores/studentStore';
import { usePlacementStore } from '../../placements/stores/placementStore';
import {
  Sparkles,
  Trophy,
  ArrowRight,
  FileText,
  Target,
  Bot,
  Wand2,
  Brain,
  Video,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export interface StudentDashboardViewProps {
  currentUser: User;
}

export const StudentDashboardView = ({ currentUser }: StudentDashboardViewProps) => {
  const navigate = useNavigate();
  const { students } = useStudentStore();
  const { applications, interviews } = usePlacementStore();

  // Find active student record
  const student = students.find((s) => s.email.toLowerCase() === currentUser.email.toLowerCase()) || students[0];
  const myApplications = student ? applications.filter((a) => a.studentId === student.id || a.studentName === student.name) : [];
  const myInterviews = student ? interviews.filter((i) => i.studentId === student.id || i.studentName === student.name) : [];

  const studentName = student?.name || currentUser.name || 'Student';
  const studentCourse = student?.course || 'Engineering';
  const studentCgpa = student?.academic?.cgpa ?? 'N/A';
  const studentStatus = student?.placement?.status ?? 'Not Placed';
  const studentPackage = student?.placement?.packageLPA;
  const studentAts = student?.atsScore ?? 85;

  // Radar skills data (current vs market demand)
  const skillsRadarData = [
    { skill: 'React / Frontend', student: 90, market: 85 },
    { skill: 'Algorithms & DSA', student: 75, market: 90 },
    { skill: 'System Design', student: 70, market: 80 },
    { skill: 'Databases & SQL', student: 85, market: 80 },
    { skill: 'Cloud & DevOps', student: 65, market: 75 },
    { skill: 'Communication', student: 88, market: 85 },
  ];

  const aiTools = [
    {
      title: 'ATS Resume Analyzer',
      description: 'Upload resume for real-time scoring (0-100), formatting check & keyword match',
      icon: FileText,
      path: '/resume-analyzer',
      badge: 'Score: ' + studentAts + '/100',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-300 dark:hover:border-emerald-700',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'AI Resume Builder',
      description: 'Generate high-scoring single-column ATS optimized PDF resume in 1 click',
      icon: Wand2,
      path: '/resume-builder',
      badge: 'PDF Export',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
      gradient: 'from-indigo-500/10 to-purple-500/10 hover:border-indigo-300 dark:hover:border-indigo-700',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Skills Gap Radar',
      description: 'Benchmark your proficiency vs top tier tech hiring benchmarks',
      icon: Target,
      path: '/skills-gap',
      badge: '88% Match',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      gradient: 'from-amber-500/10 to-orange-500/10 hover:border-amber-300 dark:hover:border-amber-700',
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'AI Mock Tests Engine',
      description: 'Timed aptitude, reasoning & CS fundamentals quizzes with instant scorecard',
      icon: Brain,
      path: '/mock-tests',
      badge: 'Practice Mode',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      gradient: 'from-blue-500/10 to-cyan-500/10 hover:border-blue-300 dark:hover:border-blue-700',
      iconBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'AI Mock Interview Coach',
      description: 'Practice technical & HR interview questions with real-time AI evaluation',
      icon: Video,
      path: '/mock-interview',
      badge: 'Voice & Text',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      gradient: 'from-rose-500/10 to-pink-500/10 hover:border-rose-300 dark:hover:border-rose-700',
      iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    },
    {
      title: 'AI Placement Chatbot',
      description: 'Ask natural language questions about drives, packages & preparation strategy',
      icon: Bot,
      path: '/ai-chat',
      badge: '24/7 AI Assistant',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      gradient: 'from-purple-500/10 to-fuchsia-500/10 hover:border-purple-300 dark:hover:border-purple-700',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            2026 Student Placement Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {studentName}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Cohort: {studentCourse}. You have{' '}
            <span className="font-bold underline">{myApplications.length} active applications</span> and{' '}
            {myInterviews.length > 0 ? (
              <span className="font-bold text-amber-300">{myInterviews.length} interview scheduled</span>
            ) : (
              '0 pending interviews'
            )}.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <Card className="flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-200 dark:text-stone-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray="94, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-stone-900 dark:text-stone-50">
              94%
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Profile Strength
            </div>
            <div className="text-base font-bold text-stone-900 dark:text-stone-50">
              All Sections Complete
            </div>
          </div>
        </Card>

        {/* ATS Score */}
        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              ATS Compatibility
            </div>
            <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-50">
              {studentAts}/100
            </div>
          </div>
        </Card>

        {/* Placement Status */}
        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Placement Status
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="success" size="sm">
                {studentStatus}
              </Badge>
              {studentPackage && (
                <span className="text-xs font-bold text-indigo-600">
                  ₹{studentPackage} LPA
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* CGPA */}
        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Academic CGPA
            </div>
            <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-50">
              {studentCgpa} / 10.0
            </div>
          </div>
        </Card>
      </div>

      {/* AI Career Acceleration Suite Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-50 tracking-tight flex items-center gap-2">
                AI Career Acceleration Suite
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Powered by AI
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sharpen your resume, test your technical skills, and practice with AI interview coaches
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTools.map((tool) => (
            <button
              key={tool.title}
              onClick={() => navigate(tool.path)}
              className={`text-left p-4 rounded-3xl bg-white dark:bg-[#181818] border border-stone-200/80 dark:border-stone-800/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group ${tool.gradient}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-2xl ${tool.iconBg} transition-transform group-hover:scale-110`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-current/20 ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Tool</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Skills Radar & Applied Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar Analysis */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  Skills Competency Radar
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Your skill proficiency vs. recruiter expectations
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/skills-gap')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Analyze Gap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#e5e7eb" opacity={0.6} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#78716C', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#d1d5db" />
                <Radar
                  name="Your Score"
                  dataKey="student"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Industry Benchmark"
                  dataKey="market"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Applied Drives & Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                My Active Applications
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Real-time recruitment round statuses
              </p>
            </div>
            <button
              onClick={() => navigate('/placements')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myApplications.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                You haven't applied to any drives yet.
              </div>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getCompanyLogo(app.companyName, app.companyLogo)}
                      alt={app.companyName}
                      className="w-10 h-10 object-contain rounded-xl p-1 bg-white border border-stone-200 shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getCompanyLogo(app.companyName);
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {app.companyName}
                      </div>
                      <div className="text-xs text-stone-500">
                        {app.role} · ₹{app.packageLPA} LPA
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={
                        app.stage === 'Placed'
                          ? 'success'
                          : app.stage === 'Rejected'
                          ? 'danger'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {app.stage}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
