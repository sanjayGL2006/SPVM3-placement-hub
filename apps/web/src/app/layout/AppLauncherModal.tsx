import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  FileBarChart,
  FileSpreadsheet,
  Bot,
  FileText,
  Wand2,
  Target,
  Brain,
  Video,
  Users,
  Settings,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../../shared/components/ui/Modal';
import { useAuthStore } from '../../features/auth/stores/authStore';

export interface AppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModuleItem {
  name: string;
  desc: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  roles?: string[];
  gradient: string;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const sections: { title: string; subtitle: string; items: ModuleItem[] }[] = [
    {
      title: 'AI Intelligence Suite',
      subtitle: 'Next-gen AI engines powered for students & placement coordinators',
      items: [
        {
          name: 'AI Placement Chatbot',
          desc: 'Instant answers on policies, resume tips, and company prep',
          path: '/ai-chat',
          icon: Bot,
          badge: 'AI LIVE',
          badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
          gradient: 'from-indigo-500 to-purple-600',
        },
        {
          name: 'ATS Resume Analyzer',
          desc: 'Score resumes against job descriptions with AI keyword analysis',
          path: '/resume-analyzer',
          icon: FileText,
          badge: 'AI ENGINE',
          badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
          gradient: 'from-purple-500 to-pink-600',
        },
        {
          name: 'AI Resume Builder',
          desc: 'Generate single-column, high-scoring ATS resumes instantly',
          path: '/resume-builder',
          icon: Wand2,
          badge: 'BUILDER',
          badgeColor: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
          gradient: 'from-fuchsia-500 to-rose-600',
        },
        {
          name: 'Skills Gap Radar',
          desc: 'Benchmark your profile against target company tech stacks',
          path: '/skills-gap',
          icon: Target,
          badge: 'ANALYTICS',
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
          gradient: 'from-emerald-500 to-teal-600',
        },
        {
          name: 'AI Mock Tests Engine',
          desc: 'Timed aptitude, coding & CS foundation practice tests',
          path: '/mock-tests',
          icon: Brain,
          badge: 'TEST ENGINE',
          badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          name: 'AI Mock Interview Coach',
          desc: 'Simulate HR & Technical rounds with AI evaluation',
          path: '/mock-interview',
          icon: Video,
          badge: 'INTERACTIVE',
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
          gradient: 'from-rose-500 to-red-600',
        },
      ],
    },
    {
      title: 'Placement Operations',
      subtitle: 'Core operational workflow, student tracking & corporate drives',
      items: [
        {
          name: 'Executive Dashboard',
          desc: 'Real-time placement KPIs, salary ranges, and hiring metrics',
          path: '/dashboard',
          icon: LayoutDashboard,
          gradient: 'from-blue-500 to-indigo-600',
        },
        {
          name: 'Students Directory',
          desc: 'Filterable database of all students with CGPA and offer tracking',
          path: '/students',
          icon: GraduationCap,
          gradient: 'from-cyan-500 to-blue-600',
        },
        {
          name: 'Company Partners',
          desc: 'Hiring partners, tier ratings, eligibility criteria & packages',
          path: '/companies',
          icon: Building2,
          gradient: 'from-emerald-500 to-green-600',
        },
        {
          name: 'Active Placement Drives',
          desc: 'Drive calendar, registration deadlines & hiring rounds',
          path: '/drives',
          icon: Calendar,
          badge: 'SCHEDULE',
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
          gradient: 'from-teal-500 to-emerald-600',
        },
        {
          name: 'Placement Pipeline & Tracking',
          desc: 'Kanban stages from Applied to Interview and Selected',
          path: '/placements',
          icon: Briefcase,
          gradient: 'from-violet-500 to-purple-600',
        },
        {
          name: 'Analytics & Insights Reports',
          desc: 'Salary distribution, department comparisons & hiring trends',
          path: '/reports',
          icon: FileBarChart,
          gradient: 'from-orange-500 to-amber-600',
        },
        {
          name: 'Annual Placement Report',
          desc: 'Comprehensive annual institutional placement summary',
          path: '/reports/annual',
          icon: FileSpreadsheet,
          badge: 'ANNUAL',
          badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
          gradient: 'from-amber-600 to-yellow-600',
        },
      ],
    },
    {
      title: 'Governance & Administration',
      subtitle: 'User access control, permissions & system settings',
      items: [
        {
          name: 'User & Security Controls',
          desc: 'Role-based access management, faculty coordinators & security',
          path: '/users',
          icon: Users,
          gradient: 'from-slate-600 to-stone-700',
        },
        {
          name: 'System & Profile Settings',
          desc: 'Notification preferences, profile details & theme configuration',
          path: '/settings',
          icon: Settings,
          gradient: 'from-zinc-600 to-neutral-700',
        },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="space-y-6">
        {/* Header banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  Placement Pro — All Modules & Features
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Full A-to-Z suite navigation · Current role:{' '}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/60 px-3 py-1.5 rounded-full self-start sm:self-auto border border-stone-200/60 dark:border-stone-700/60">
            14 Integrated Modules
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
                  {section.title}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {section.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="group relative flex flex-col justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-800/90 border border-stone-200/70 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                              item.badgeColor || 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-[10px] font-semibold text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <span>Open Module</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
