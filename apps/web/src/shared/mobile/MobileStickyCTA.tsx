import React from 'react';
import { Button } from '../components/ui/Button';

export interface MobileStickyCTAProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  primaryIcon?: React.ReactNode;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
  primaryLabel,
  onPrimaryClick,
  primaryIcon,
  secondaryLabel,
  onSecondaryClick,
  secondaryIcon,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-2.5 w-full">
      {secondaryLabel && onSecondaryClick && (
        <Button
          variant="outline"
          size="md"
          pill
          onClick={onSecondaryClick}
          leftIcon={secondaryIcon}
          className="flex-1 min-h-[48px] text-sm font-semibold"
        >
          {secondaryLabel}
        </Button>
      )}

      <Button
        variant="primary"
        size="md"
        pill
        onClick={onPrimaryClick}
        leftIcon={primaryIcon}
        isLoading={isLoading}
        disabled={disabled}
        className="flex-1 min-h-[48px] text-sm font-bold shadow-lg shadow-indigo-500/25 typo-cta-label"
      >
        {primaryLabel}
      </Button>
    </div>
  );
};
