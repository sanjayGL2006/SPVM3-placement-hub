import { useParams, useNavigate } from 'react-router-dom';
import { useStudentStore } from '../stores/studentStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Linkedin,
  Github,
  Award,
  Sparkles,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useStudentStore();
  const { user } = useAuthStore();

  // If "my-profile" or student role, match by email or id
  const student = id === 'my-profile' || !id
    ? students.find((s) => s.email.toLowerCase() === user?.email.toLowerCase()) || students[0]
    : students.find((s) => s.id === id) || students[0];

  const handleDownloadResume = () => {
    toast.success(`Downloading verified resume for ${student.name}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Hero Profile Header */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50">
                {student.name}
              </h1>
              <Badge variant={student.placement.status === 'Placed' ? 'success' : 'primary'}>
                {student.placement.status}
              </Badge>
            </div>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              {student.course} · Register No: <span className="font-mono text-stone-800 dark:text-stone-200 font-bold">{student.registerNumber}</span> · Section {student.section}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" /> {student.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={handleDownloadResume}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Resume
          </Button>
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => navigate('/ai/resume')}
            leftIcon={<Sparkles className="w-4 h-4 text-indigo-600" />}
          >
            ATS Score
          </Button>
        </div>
      </div>

      {/* Grid Overview: Academic, Placement, Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <GraduationCap className="w-4 h-4" /> Academic Dossier
          </div>

          <div className="space-y-3 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">Cumulative CGPA</span>
              <span className="font-extrabold text-indigo-600 text-sm">{student.academic.cgpa} / 10.0</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">Active Backlogs</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">{student.academic.activeBacklogs}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">10th Grade Score</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">{student.academic.tenthPercentage}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">12th Grade Score</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">{student.academic.twelfthPercentage}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-500">Academic Cohort</span>
              <span className="font-bold text-stone-800 dark:text-stone-100">{student.academicYear}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Placement Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Award className="w-4 h-4" /> Placement Records
          </div>

          {student.placement.status === 'Placed' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs">
              <div className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                {student.placement.companyName}
              </div>
              <div className="text-emerald-700 dark:text-emerald-300">
                Role: <span className="font-semibold">{student.placement.roleOffered}</span>
              </div>
              <div className="text-emerald-700 dark:text-emerald-300">
                CTC Package: <span className="font-bold text-sm text-emerald-600">{formatCurrency(student.placement.packageLPA)}</span>
              </div>
              <div className="text-[11px] text-stone-400 pt-1">
                Offered on {formatDate(student.placement.offerDate)}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-xs text-stone-500 space-y-1">
              <div className="font-bold text-stone-800 dark:text-stone-200">In Active Recruitment</div>
              <p>Applied to {student.placement.appliedCount} recruitment drives.</p>
            </div>
          )}
        </div>

        {/* Right Column: Skills & Bio */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" /> Technical Profile
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {student.bio && (
            <div className="space-y-1 pt-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Bio</span>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {student.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
