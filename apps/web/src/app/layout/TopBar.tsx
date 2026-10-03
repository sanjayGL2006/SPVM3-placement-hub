import { useState, useRef, useEffect } from 'react';
import { Search, LogOut, User as UserIcon, ChevronDown, RefreshCw, Menu, LayoutGrid, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { ThemeToggle } from '../../shared/components/ThemeToggle';
import { NotificationPopover } from '../../features/notifications/components/NotificationPopover';
import { PREDEFINED_USERS } from '../../shared/constants/credentials';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../shared/utils/cn';

export interface TopBarProps {
  onOpenCommand: () => void;
  onOpenMobileMenu?: () => void;
  onOpenLauncher?: () => void;
}

export const TopBar = ({ onOpenCommand, onOpenMobileMenu, onOpenLauncher }: TopBarProps) => {
  const { user, logout, demoLogin } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'principal':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'hod':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'coordinator':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'faculty':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 md:px-8 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors focus:outline-none"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Cmd + K Trigger) */}
        <div className="flex-1">
          <button
            onClick={onOpenCommand}
            className="w-full flex items-center justify-between bg-stone-100 dark:bg-stone-900/90 hover:bg-stone-200/70 dark:hover:bg-stone-800/90 text-stone-500 dark:text-stone-400 px-3 sm:px-4 py-2 rounded-full border border-stone-200/60 dark:border-stone-800 text-xs sm:text-sm transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="hidden sm:inline">Search students, drives, AI tools...</span>
              <span className="sm:hidden">Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-md text-stone-500 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-2 sm:ml-4">
        {/* All Modules / A-Z Apps Launcher Button */}
        {onOpenLauncher && (
          <button
            onClick={onOpenLauncher}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold transition-all shadow-xs"
            title="A-to-Z Modules Launcher"
          >
            <LayoutGrid className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="hidden lg:inline">All Apps (A-Z)</span>
            <span className="hidden sm:inline lg:hidden">Apps</span>
          </button>
        )}

        {/* Quick Role Switcher Dropdown */}
        <div className="relative" ref={switcherRef}>
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shadow-xs"
            title="Switch Demo Role Instantly"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Role:</span>
            <span className="uppercase font-bold text-[11px] sm:text-xs">{user?.role}</span>
            <ChevronDown className="w-3 h-3 text-indigo-500" />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50 animate-slide-up">
              <div className="px-3 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                <span>Instant Role Switcher</span>
                <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" /> Demo
                </span>
              </div>
              <div className="space-y-1">
                {PREDEFINED_USERS.slice(0, 7).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      demoLogin(u.role === 'hod' || u.role === 'coordinator' ? u.email : u.role);
                      setRoleSwitcherOpen(false);
                      navigate('/dashboard');
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors hover:bg-stone-100 dark:hover:bg-stone-800',
                      user?.email === u.email && 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full bg-stone-200" />
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">{u.name}</div>
                        <div className="text-[10px] text-stone-400 capitalize">
                          {u.role} {u.course ? `(${u.course})` : ''}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationPopover />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none"
            aria-label="User Profile"
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20 bg-stone-200 object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-2xl p-3 z-50 animate-slide-up">
              {/* Profile Card Summary */}
              <div className="p-3 border-b border-stone-100 dark:border-stone-800/80 mb-2">
                <div className="font-bold text-sm text-stone-900 dark:text-stone-50 truncate">
                  {user?.name}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {user?.email}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border',
                      getRoleBadgeColor(user?.role)
                    )}
                  >
                    {user?.role}
                  </span>
                  {user?.department && (
                    <span className="text-[10px] text-stone-500 truncate max-w-[120px]">
                      {user.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-stone-400" />
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
