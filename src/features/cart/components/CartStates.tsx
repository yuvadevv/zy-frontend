import React from 'react';

export const CartSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full animate-pulse">
      <div className="w-full h-40 bg-muted/50 rounded-2xl border border-border/50"></div>
      <div className="w-full h-40 bg-muted/30 rounded-2xl border border-border/30"></div>
      <div className="w-full h-32 bg-muted/50 rounded-2xl border border-border/50 mt-4"></div>
    </div>
  );
};

export const CartErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh] gap-4">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p className="font-semibold text-foreground">Something went wrong</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <button onClick={onRetry} className="mt-4 px-6 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg">
        Try Again
      </button>
    </div>
  );
};
