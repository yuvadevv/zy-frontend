import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface HelpCardProps {
  onHelpClick?: () => void;
}

export const HelpCard = ({ onHelpClick }: HelpCardProps) => (
  <div className="mx-4 mb-8 mt-2 p-5 bg-card border border-border rounded-xl shadow-sm text-center flex flex-col items-center gap-3">
    <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
      <span className="text-xl">💡</span>
    </div>
    <div>
      <h3 className="text-base font-bold text-foreground">Can&apos;t find what you need?</h3>
      <p className="text-sm text-muted-foreground mt-1 leading-snug">
        Our support team is available to help you with custom printing requests.
      </p>
    </div>
    <Button 
      onClick={onHelpClick}
      className="mt-2 w-full max-w-[200px] bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold"
    >
      Contact Support
    </Button>
  </div>
);
