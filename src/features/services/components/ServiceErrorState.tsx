"use client";
import React from 'react';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export const ServiceErrorState = ({ 
  title = "Something went wrong", 
  message = "We couldn't load the services at this time.", 
  onRetry,
  isOffline = false
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 bg-destructive/5 border border-destructive/20 rounded-xl text-center shadow-sm">
    <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">{isOffline ? '📡' : '⚠️'}</span>
    </div>
    <h3 className="text-lg font-semibold text-destructive mb-2">
      {isOffline ? "You're Offline" : title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      {isOffline ? "Please check your internet connection and try again." : message}
    </p>
    {onRetry && (
      <Button 
        onClick={onRetry} 
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-2 rounded-lg font-medium"
      >
        Retry
      </Button>
    )}
  </div>
);
