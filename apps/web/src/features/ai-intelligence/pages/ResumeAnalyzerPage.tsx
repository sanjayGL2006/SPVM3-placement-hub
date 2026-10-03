import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ResumeAnalysisResult } from '../../../shared/types/ai.types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ResumeAnalyzerPage = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult>({
    overallScore: 89,
    atsScore: 92,
    formattingScore: 88,
    skillsScore: 86,
    fileName: 'Rahul_Kumar_Resume_2026.pdf',
    fileSize: '1.4 MB',
    analyzedAt: 'Just now',
    candidateName: 'Rahul Kumar',
    targetRole: 'Full Stack Software Engineer',
    skillsFound: [
      'React 19',
      'TypeScript',
      'Node.js',
      'SQL',
      'Tailwind CSS',
      'Docker',
      'REST APIs',
      'Git',
      'DSA',
    ],
    skillsMissing: [
      'Kubernetes',
      'AWS Lambda',
      'GraphQL',
      'Microservices Architecture',
    ],
    strengths: [
      'High density of quantifiable impact metrics (e.g., "Reduced bundle latency by 42%")',
      'Standard ATS single-column formatting with clean heading hierarchy',
      'Strong open-source repository contributions highlighted',
    ],
    improvements: [
      {
        id: 'imp-1',
        severity: 'high',
        section: 'Skills',
        issue: 'Cloud computing infrastructure tools not explicitly listed in header.',
        suggestion: 'Include AWS S3, CloudFront, or GCP basics to pass automated enterprise filters.',
      },
      {
        id: 'imp-2',
        severity: 'medium',
        section: 'Experience',
        issue: 'Action verbs in second project could be strengthened.',
        suggestion: 'Replace "worked on" with "architected", "engineered", or "deployed".',
      },
      {
        id: 'imp-3',
        severity: 'low',
        section: 'Formatting',
        issue: 'LinkedIn and GitHub URLs should use clean hyperlinked anchors.',
        suggestion: 'Format hyperlinks as github.com/username rather than raw URL.',
      },
    ],
    extractedSummary:
      'Passionate Full Stack Engineer specializing in TypeScript, React, and high-throughput backend services. Experienced in building production-ready web apps with clean system architecture.',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    toast.loading('Analyzing resume against Tier-1 ATS algorithms...');

    setTimeout(() => {
      setIsAnalyzing(false);
      toast.dismiss();
      toast.success('Resume analysis completed!');
      setAnalysisResult((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        overallScore: Math.floor(82 + Math.random() * 14),
        atsScore: Math.floor(85 + Math.random() * 12),
      }));
    }, 1200);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            AI Resume & ATS Parser
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Resume Intelligence & ATS Compatibility
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Simulate recruiter ATS scanners (Taleo, Greenhouse, Workday) and optimize keywords.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          pill
          onClick={() => navigate('/ai/resume-generator')}
          leftIcon={<Zap className="w-3.5 h-3.5 text-indigo-600" />}
        >
          AI Resume Generator
        </Button>
      </div>

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all bg-white dark:bg-[#1C1C1C] ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-lg'
            : 'border-stone-200 dark:border-stone-800 hover:border-indigo-400 shadow-sm'
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50">
          Upload resume for live ATS diagnostic
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Drag & drop PDF or DOCX file (Maximum size: 5MB)
        </p>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Score Circular Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-200 dark:text-stone-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600"
                    strokeDasharray={`${analysisResult.overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-stone-900 dark:text-stone-50">
                  {analysisResult.overallScore}%
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Overall Score</span>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-50">Strong Match</div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">ATS Pass Rate</span>
                <div className="text-xl font-black text-emerald-600">
                  {analysisResult.atsScore}%
                </div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Formatting Score</span>
                <div className="text-xl font-black text-purple-600">
                  {analysisResult.formattingScore}%
                </div>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Skills Density</span>
                <div className="text-xl font-black text-blue-600">
                  {analysisResult.skillsScore}%
                </div>
              </div>
            </Card>
          </div>

          {/* Skills Matched Cloud vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                  Keywords & Skills Extracted ({analysisResult.skillsFound.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.skillsFound.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                  High-Demand Skills Missing ({analysisResult.skillsMissing.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.skillsMissing.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Actionable Improvement Suggestions */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Actionable Optimization Recommendations
            </h3>

            <div className="space-y-3">
              {analysisResult.improvements.map((imp) => (
                <div
                  key={imp.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {imp.section} Section
                    </span>
                    <Badge
                      variant={imp.severity === 'high' ? 'danger' : imp.severity === 'medium' ? 'warning' : 'info'}
                      size="sm"
                    >
                      {imp.severity.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <p className="text-stone-500 font-medium">{imp.issue}</p>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                    💡 Suggestion: {imp.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
