import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ServiceEmptyState = ({ 
  title = "No Services Found", 
  description = "Try adjusting your search or category filters.", 
  actionLabel = "Clear Filters",
  onAction 
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center shadow-sm">
    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">📭</span>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction} className="bg-primary text-primary-foreground hover:bg-primary/90">
        {actionLabel}
      </Button>
    )}
  </div>
);
