"use client";
import React from 'react';
import { Highlight } from '../types';

interface HighlightsProps {
  highlights: Highlight[];
}

export const TodaysHighlights = ({ highlights }: HighlightsProps) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
      {highlights.map((highlight) => (
        <div 
          key={highlight.id} 
          className={`min-w-[280px] snap-center p-6 border border-gray-100 rounded-[24px] shadow-sm shrink-0 flex flex-col gap-3 ${highlight.backgroundColor || 'bg-white'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{highlight.icon || '✨'}</span>
          </div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">{highlight.title}</h4>
          {highlight.actionLabel && (
            <a href={highlight.deepLink || '#'} className="mt-1 text-sm font-bold text-orange-500 hover:text-orange-600">
              {highlight.actionLabel} &rarr;
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

