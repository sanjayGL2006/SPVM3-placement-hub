import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Target, Sparkles, BookOpen, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export const SkillsGapPage = () => {
  const [selectedRole, setSelectedRole] = useState<'fullstack' | 'data' | 'cloud' | 'mgmt'>('fullstack');

  const roleProfiles = {
    fullstack: {
      title: 'Full Stack Software Engineer',
      matchScore: 88,
      radar: [
        { subject: 'Frontend (React/TS)', you: 92, target: 85 },
        { subject: 'Backend (Node/SQL)', you: 86, target: 85 },
        { subject: 'DSA & Algorithms', you: 78, target: 90 },
        { subject: 'System Architecture', you: 70, target: 80 },
        { subject: 'Docker / Cloud', you: 65, target: 75 },
        { subject: 'Testing & CI/CD', you: 60, target: 70 },
      ],
      missingSkills: ['Kubernetes', 'Microservices', 'GraphQL', 'Jest / Vitest'],
      courses: [
        { title: 'Advanced Distributed System Architecture', platform: 'Coursera / Stanford', duration: '4 weeks' },
        { title: 'Docker & Kubernetes Mastery for Production', platform: 'Udemy Pro', duration: '3 weeks' },
      ],
      projectIdeas: [
        { title: 'Real-Time Collaborative Document Editor', desc: 'Build with WebSockets, CRDTs, Redis cache, and Dockerized microservices.' }
      ],
    },
    data: {
      title: 'Data & Analytics Engineer',
      matchScore: 72,
      radar: [
        { subject: 'SQL & Database Design', you: 85, target: 90 },
        { subject: 'Python & Pandas', you: 75, target: 90 },
        { subject: 'PowerBI & Tableau', you: 60, target: 85 },
        { subject: 'ETL Pipelines', you: 55, target: 80 },
        { subject: 'Statistical Modeling', you: 70, target: 75 },
        { subject: 'Data Warehousing', you: 50, target: 80 },
      ],
      missingSkills: ['Apache Spark', 'Snowflake', 'dbt', 'Airflow'],
      courses: [
        { title: 'Modern Data Engineering with Python & Spark', platform: 'Databricks Academy', duration: '6 weeks' },
      ],
      projectIdeas: [
        { title: 'Automated E-Commerce Sales Pipeline ETL', desc: 'Ingest 1M records into PostgreSQL, transform with dbt, and visualize in PowerBI.' }
      ],
    },
    cloud: {
      title: 'Cloud & DevOps Associate',
      matchScore: 68,
      radar: [
        { subject: 'AWS / Azure Core', you: 65, target: 85 },
        { subject: 'Linux Systems', you: 80, target: 85 },
        { subject: 'CI/CD Pipelines', you: 60, target: 80 },
        { subject: 'Terraform (IaC)', you: 45, target: 75 },
        { subject: 'Containerization', you: 75, target: 85 },
        { subject: 'Monitoring & Logs', you: 50, target: 75 },
      ],
      missingSkills: ['Terraform', 'Prometheus & Grafana', 'Kubernetes Helm', 'AWS IAM Security'],
      courses: [
        { title: 'AWS Solutions Architect Associate Certification Drill', platform: 'A Cloud Guru', duration: '5 weeks' },
      ],
      projectIdeas: [
        { title: 'Automated Multi-Region Terraform Deployment', desc: 'Deploy fault-tolerant VPC with Auto Scaling and Prometheus alerting.' }
      ],
    },
    mgmt: {
      title: 'Management & Strategy Trainee',
      matchScore: 84,
      radar: [
        { subject: 'Business Analysis', you: 88, target: 85 },
        { subject: 'Financial Modeling', you: 82, target: 85 },
        { subject: 'Communication', you: 90, target: 90 },
        { subject: 'Market Research', you: 85, target: 80 },
        { subject: 'Agile & Scrum', you: 75, target: 80 },
        { subject: 'Sales Analytics', you: 70, target: 75 },
      ],
      missingSkills: ['Salesforce CRM', 'Advanced Macro Excel (VBA)', 'Supply Chain Optimization'],
      courses: [
        { title: 'Strategic Business Analytics with Tableau', platform: 'Wharton Online', duration: '4 weeks' },
      ],
      projectIdeas: [
        { title: 'Market Entry Strategy Simulation for Fintech', desc: 'Comprehensive financial forecasting and competitor SWOT analysis.' }
      ],
    },
  };

  const active = roleProfiles[selectedRole];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
          <Target className="w-3.5 h-3.5" />
          Industry Role Competency Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
          AI Skills Gap Analysis & Career Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Benchmark your skills against live job descriptions of visiting companies.
        </p>
      </div>

      {/* Target Role Selector Pills */}
      <div className="flex overflow-x-auto bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl gap-1 max-w-2xl">
        {(['fullstack', 'data', 'cloud', 'mgmt'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`flex-1 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedRole === r
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {roleProfiles[r].title.split(' ')[0]} {roleProfiles[r].title.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Main Grid: Radar Chart & Skills Match */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                {active.title} Match Radar
              </h3>
              <p className="text-xs text-stone-500">Your profile vs Industry Bar</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {active.matchScore}% Match
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={active.radar}>
                <PolarGrid stroke="#e5e7eb" opacity={0.6} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716C', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Your Score" dataKey="you" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                <Radar name="Industry Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Missing Skills & Next Steps */}
        <Card className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              High Priority Skills to Acquire
            </h3>
            <p className="text-xs text-stone-500">
              Acquiring these will increase selection probability for {active.title} roles:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {active.missingSkills.map((sk) => (
              <span
                key={sk}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60"
              >
                + {sk}
              </span>
            ))}
          </div>

          {/* Recommended Capstone Project */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Recommended Portfolio Project
            </h4>
            {active.projectIdeas.map((proj, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-1"
              >
                <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  {proj.title}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{proj.desc}</p>
              </div>
            ))}
          </div>

          {/* Recommended Courses */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Fast-Track Learning Resources
            </h4>
            <div className="space-y-2">
              {active.courses.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-bold text-stone-800 dark:text-stone-200">{c.title}</div>
                      <div className="text-[10px] text-stone-400">{c.platform} · {c.duration}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" pill onClick={() => toast.success('Enrolled in course!')}>
                    Enroll
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
