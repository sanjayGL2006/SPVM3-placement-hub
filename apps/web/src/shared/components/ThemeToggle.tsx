import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useSettingsStore } from '../../features/settings/stores/settingsStore';
import { cn } from '../utils/cn';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-full border border-stone-200/60 dark:border-stone-700/60',
        className
      )}
    >
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'p-1.5 rounded-full transition-all text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100',
          theme === 'light' && 'bg-white dark:bg-stone-700 text-amber-500 shadow-sm'
        )}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'p-1.5 rounded-full transition-all text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100',
          theme === 'dark' && 'bg-white dark:bg-stone-900 text-indigo-400 shadow-sm'
        )}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={cn(
          'p-1.5 rounded-full transition-all text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100',
          theme === 'system' && 'bg-white dark:bg-stone-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
        )}
        title="System Preference"
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
};
