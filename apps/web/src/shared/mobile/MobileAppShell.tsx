import React from 'react';
import { useMobileViewport } from './useMobileViewport';
import { cn } from '../utils/cn';

export interface MobileAppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  stickyBottomCTA?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * MobileAppShell
 * Strict, fixed-position layout framework for iOS & Android
 * - Locked top safe-area header
 * - Scrollable viewport with momentum touch scrolling
 * - Fixed thumb-zone bottom CTA
 */
export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  header,
  stickyBottomCTA,
  className,
  contentClassName,
}) => {
  const { isIOS, isAndroid } = useMobileViewport();

  return (
    <div
      className={cn(
        'mobile-viewport-container bg-[#FAFAF9] dark:bg-[#0F0F0F] text-stone-900 dark:text-stone-50',
        isIOS && 'ios-platform-safe',
        isAndroid && 'android-platform-safe',
        className
      )}
    >
      {/* 1. Header Locked to Safe Area Top */}
      {header && <header className="mobile-header-fixed glass-panel">{header}</header>}

      {/* 2. Scrollable Content Viewport with Momentum Touch Scrolling */}
      <main className={cn('mobile-scroll-viewport', contentClassName)}>
        {children}
      </main>

      {/* 3. Thumb-Zone Fixed Bottom CTA */}
      {stickyBottomCTA && (
        <div className="mobile-bottom-cta">
          {stickyBottomCTA}
        </div>
      )}
    </div>
  );
};
