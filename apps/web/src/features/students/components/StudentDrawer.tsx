import { useState } from 'react';
import { Student } from '../../../shared/types/student.types';
import { Drawer } from '../../../shared/components/ui/Drawer';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import {
  GraduationCap,
  Mail,
  Phone,
  Briefcase,
  FileText,
  Calendar,
  Linkedin,
  Github,
  Award,
  BookOpen,
  Edit,
} from 'lucide-react';
import { cn } from '../../../shared/utils/cn';

export interface StudentDrawerProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (student: Student) => void;
  canEdit?: boolean;
}

export const StudentDrawer = ({
  student,
  isOpen,
  onClose,
  onEdit,
  canEdit = true,
}: StudentDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'placement' | 'projects'>('overview');

  if (!student) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={student.name}
      subtitle={`${student.course} · ${student.registerNumber} · Section ${student.section}`}
      width="xl"
      headerActions={
        canEdit && onEdit ? (
          <Button
            variant="outline"
            size="sm"
            pill
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => {
              onEdit(student);
              onClose();
            }}
          >
            Edit
          </Button>
        ) : undefined
      }
    >
      {/* Header Bio Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
          {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              {student.name}
            </h3>
            <Badge variant={student.placement.status === 'Placed' ? 'success' : 'primary'} size="sm">
              {student.placement.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" /> {student.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-400" /> {student.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-6 text-xs font-semibold">
        {(['overview', 'academic', 'placement', 'projects'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 capitalize transition-all relative',
              activeTab === tab
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6 pt-2">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">CGPA</div>
                <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {student.academic.cgpa}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">ATS Score</div>
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {student.atsScore || 88}%
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-center">
                <div className="text-[10px] uppercase font-bold text-stone-400">Backlogs</div>
                <div className="text-lg font-extrabold text-stone-800 dark:text-stone-100 mt-0.5">
                  {student.academic.activeBacklogs}
                </div>
              </div>
            </div>

            {/* Bio */}
            {student.bio && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Bio</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/40 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800/60">
                  {student.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Technical & Professional Skills</h4>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {student.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile
                </a>
              )}
              {student.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
            </div>
          </div>
        )}

        {/* ACADEMIC TAB */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold">10th Grade Score</span>
                <div className="text-base font-bold text-stone-900 dark:text-stone-50 mt-0.5">
                  {student.academic.tenthPercentage}%
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-bold">12th Grade / Diploma</span>
                <div className="text-base font-bold text-stone-900 dark:text-stone-50 mt-0.5">
                  {student.academic.twelfthPercentage}%
                </div>
              </div>
            </div>

            {/* Semester Scores Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Semester-Wise Grade Breakdown
              </h4>
              <div className="bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 text-stone-500 font-bold uppercase">
                      <th className="py-2.5 px-4">Semester</th>
                      <th className="py-2.5 px-4 text-right">SGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/40 dark:divide-stone-800/40">
                    {student.academic.semesterScores.map((score) => (
                      <tr key={score.semester}>
                        <td className="py-2.5 px-4 font-medium">Semester {score.semester}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                          {score.sgpa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PLACEMENT TAB */}
        {activeTab === 'placement' && (
          <div className="space-y-4">
            {student.placement.status === 'Placed' ? (
              <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      Confirmed Placement Offer
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    {formatCurrency(student.placement.packageLPA)}
                  </span>
                </div>
                <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-0.5 pt-1">
                  <div>Company: <span className="font-bold">{student.placement.companyName}</span></div>
                  <div>Role: <span className="font-bold">{student.placement.roleOffered}</span></div>
                  <div>Offer Date: {formatDate(student.placement.offerDate)}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Status: {student.placement.status}</span>
                <p className="text-xs text-stone-500">Currently registered and active for ongoing placement cycles.</p>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Placement Journey & Milestones
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-indigo-200 dark:border-indigo-900/60">
                {student.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-4 space-y-0.5">
                    <span className="absolute -left-[1.35rem] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-stone-900" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-stone-400">{item.date}</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {student.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {proj.title}
                  </h5>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                    {proj.tech}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};
