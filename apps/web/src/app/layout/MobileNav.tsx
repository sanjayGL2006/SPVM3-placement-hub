import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, Briefcase, Bot, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { cn } from '../../shared/utils/cn';

export interface MobileNavProps {
  onOpenLauncher: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenLauncher }) => {
  const { user } = useAuthStore();
  const isStudent = user?.role === 'student';

  const primaryItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(isStudent
      ? [{ name: 'Applications', path: '/placements', icon: Briefcase }]
      : [{ name: 'Students', path: '/students', icon: GraduationCap }]),
    { name: 'AI Chat', path: '/ai-chat', icon: Bot, isAi: true },
    { name: 'Drives', path: '/placements', icon: Briefcase },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#151515]/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 z-40 flex items-center justify-around px-2 shadow-lg">
      {primaryItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition-colors relative',
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
            )
          }
        >
          <div className="relative">
            <item.icon className="w-5 h-5 mb-0.5" />
            {item.isAi && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>
          <span>{item.name}</span>
        </NavLink>
      ))}

      {/* All Apps (A-Z) launcher trigger */}
      <button
        onClick={onOpenLauncher}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold text-stone-500 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 transition-colors"
        title="View All A-to-Z Modules"
      >
        <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-0.5">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <span>All Apps</span>
      </button>
    </nav>
  );
};
