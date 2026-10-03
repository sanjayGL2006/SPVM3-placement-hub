import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  Briefcase,
  FileBarChart,
  Calendar,
  Sparkles,
  Bot,
  FileText,
  Wand2,
  Target,
  Brain,
  Video,
  Users,
  Settings,
  LogOut,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { cn } from '../../shared/utils/cn';

export interface SidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, className }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isStudent = user?.role === 'student';
  const isPrincipal = user?.role === 'principal';
  const isFaculty = user?.role === 'faculty';
  const isHodOrCoord = user?.role === 'hod' || user?.role === 'coordinator';
  const isStaff = isPrincipal || isHodOrCoord || isFaculty;

  // 1. Core Operations
  const coreNavItems = [
    { name: isStudent ? 'Student Dashboard' : 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(isStaff
      ? [
          { name: 'Students Directory', path: '/students', icon: GraduationCap },
          { name: 'Company Partners', path: '/companies', icon: Building2 },
          { name: 'Active Drives', path: '/drives', icon: Calendar },
          { name: 'Placement Pipeline', path: '/placements', icon: Briefcase },
          { name: 'Analytics & Reports', path: '/reports', icon: FileBarChart },
          { name: 'Annual Report', path: '/reports/annual', icon: FileSpreadsheet },
        ]
      : [
          { name: 'My Applications & Drives', path: '/placements', icon: Briefcase },
        ]),
  ];

  // 2. AI Intelligence Suite (Accessible across all roles)
  const aiNavItems = [
    { name: 'AI Placement Chatbot', path: '/ai-chat', icon: Bot, highlight: true },
    { name: 'ATS Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { name: 'AI Resume Builder', path: '/resume-builder', icon: Wand2 },
    { name: 'Skills Gap Radar', path: '/skills-gap', icon: Target },
    { name: 'AI Mock Tests', path: '/mock-tests', icon: Brain },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: Video },
  ];

  // 3. Administration & Governance
  const adminNavItems = [
    {
      name: isPrincipal || isHodOrCoord
        ? 'User & Security Controls'
        : 'Security & Access Controls',
      path: '/users',
      icon: Users,
    },
    { name: 'Settings & Profile', path: '/settings', icon: Settings },
  ];

  // Generate initials from user name
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Deterministic color based on name
  const getInitialsColor = (name?: string) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-blue-500 to-cyan-600',
      'from-violet-500 to-fuchsia-600',
    ];
    let hash = 0;
    const str = name || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={cn(
        'w-[280px] h-screen bg-white dark:bg-[#151515] border-r border-stone-200/80 dark:border-stone-800/80 flex flex-col justify-between p-4 transition-colors select-none z-40',
        className
      )}
    >
      {/* Top Header + Navigation Items Container */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand & Logo + Mobile Close */}
        <div className="flex items-center justify-between px-2 py-2 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-stone-900 dark:text-stone-50 tracking-tight leading-none flex items-center gap-1.5">
                Placement Pro
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  2026
                </span>
              </div>
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mt-1">
                Academic Placement System
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation links with smooth scrollbar */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800 overscroll-contain">
          {/* Section 1: Core Operations */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              {isStudent ? 'Student Self-Service' : 'Placement Operations'}
            </div>

            <nav className="space-y-0.5">
              {coreNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group',
                      isActive
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                        )}
                        <item.icon
                          className={cn(
                            'w-4 h-4 transition-colors',
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section 2: AI Intelligence Suite */}
          <div className="space-y-1">
            <div className="px-3 pb-1 flex items-center justify-between text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              <span>AI Intelligence Suite</span>
              <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>

            <nav className="space-y-0.5">
              {aiNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/30 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                        )}
                        <item.icon
                          className={cn(
                            'w-4 h-4 transition-colors',
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section 3: Administration */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              Management & Controls
            </div>

            <nav className="space-y-0.5">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group',
                      isActive
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-100'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />
                        )}
                        <item.icon
                          className={cn(
                            'w-4 h-4 transition-colors',
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800/80 shrink-0">
        <div className="p-2.5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getInitialsColor(
                user?.name
              )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            >
              {getUserInitials(user?.name)}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {user?.name}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 capitalize truncate">
                {user?.role} {user?.course ? `· ${user.course}` : ''}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              if (onCloseMobile) onCloseMobile();
              navigate('/login');
            }}
            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
