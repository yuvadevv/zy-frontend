"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/design-system/components/buttons/Button/Button';

interface ServicePlaceholderProps {
  title: string;
  description: string;
  icon?: string;
}

export const ServicePlaceholder = ({ title, description, icon = '??' }: ServicePlaceholderProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-background/80 backdrop-blur-md border-b border-border">
        <button onClick={() => router.back()} className="mr-4 text-xl hover:text-primary" aria-label="Go back">
          ?
        </button>
        <h1 className="text-lg font-bold truncate">{title}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground mb-8 max-w-[80%]">{description}</p>
        <Button onClick={() => router.back()} className="bg-primary text-primary-foreground font-medium px-8">
          Back to Services
        </Button>
      </main>
    </div>
  );
};
