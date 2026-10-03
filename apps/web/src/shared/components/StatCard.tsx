import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  iconColor?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple';
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  iconColor = 'indigo',
  onClick,
}: StatCardProps) => {
  const iconColors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 transition-all duration-300 shadow-pinterest hover:shadow-pinterest-hover dark:hover:shadow-pinterest-dark-hover hover:-translate-y-0.5',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl transition-colors', iconColors[iconColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 font-sans">
          {value}
        </div>
        {change && (
          <div
            className={cn(
              'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
      )}
    </div>
  );
};
