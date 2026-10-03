import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 w-full min-h-[44px]">
      <div className="flex items-center gap-2.5 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1.5 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-50 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
};
