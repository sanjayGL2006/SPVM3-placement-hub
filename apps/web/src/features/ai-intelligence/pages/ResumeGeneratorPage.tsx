import { useState } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useStudentStore } from '../../students/stores/studentStore';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { exportElementToPdf } from '../../../shared/utils/exportHelpers';
import { Download, Sparkles, Wand2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ResumeGeneratorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { students } = useStudentStore();
  const activeStudent = students.find((s) => s.email.toLowerCase() === user?.email.toLowerCase()) || students[0];

  const [fullName, setFullName] = useState(activeStudent.name);
  const [headline, setHeadline] = useState('Full Stack Software Engineer & Cloud Architect');
  const [email, setEmail] = useState(activeStudent.email);
  const [phone, setPhone] = useState(activeStudent.phone);
  const [summary, setSummary] = useState(
    'Motivated Computer Applications student with demonstrable expertise in TypeScript, React 19, distributed architectures, and modern web application development.'
  );
  const [skills, setSkills] = useState(activeStudent.skills.join(', '));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadResume = async () => {
    setIsGenerating(true);
    toast.loading('Compiling ATS-optimized Single-Column PDF Resume...');
    await exportElementToPdf('printable-resume-preview', `${fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`);
    setIsGenerating(false);
    toast.dismiss();
    toast.success('Resume PDF downloaded!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Analyzer
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            AI Automated Resume Generator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Export a high-scoring, single-column ATS resume tailored for top tier recruiters.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          pill
          onClick={handleDownloadResume}
          isLoading={isGenerating}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download PDF Resume
        </Button>
      </div>

      {/* Split Grid: Editor (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm border-b border-stone-100 dark:border-stone-800 pb-3">
            <Wand2 className="w-4 h-4" /> Custom Resume Content
          </div>

          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Professional Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Professional Summary
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Input
            label="Technical Skills (Comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        {/* Live Printable Preview Canvas */}
        <div className="p-2 bg-stone-100 dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg">
          <div
            id="printable-resume-preview"
            className="p-8 bg-white text-stone-900 rounded-2xl shadow-sm space-y-5 text-xs font-sans"
          >
            {/* Header */}
            <div className="text-center border-b border-stone-300 pb-4 space-y-1">
              <h2 className="text-xl font-black tracking-tight text-stone-900 uppercase">
                {fullName}
              </h2>
              <p className="text-xs font-semibold text-indigo-700">{headline}</p>
              <div className="text-[11px] text-stone-600 flex justify-center gap-3">
                <span>{email}</span>
                <span>•</span>
                <span>{phone}</span>
                <span>•</span>
                <span>Bangalore, India</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-stone-200 pb-0.5">
                Summary
              </h3>
              <p className="text-[11px] text-stone-700 leading-relaxed">{summary}</p>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-stone-200 pb-0.5">
                Education
              </h3>
              <div className="flex justify-between items-baseline text-[11px]">
                <div>
                  <span className="font-bold text-stone-900">{activeStudent.course}</span> (CGPA: {activeStudent.academic.cgpa} / 10.0)
                </div>
                <span className="text-stone-500">{activeStudent.batch}</span>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-stone-200 pb-0.5">
                Technical Skills
              </h3>
              <p className="text-[11px] text-stone-700">{skills}</p>
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800 border-b border-stone-200 pb-0.5">
                Key Projects & Experience
              </h3>
              {activeStudent.projects.map((p, i) => (
                <div key={i} className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{p.title}</span>
                    <span className="text-stone-500 font-normal">{p.tech}</span>
                  </div>
                  <p className="text-stone-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
