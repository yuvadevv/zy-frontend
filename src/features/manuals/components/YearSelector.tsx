"use client";
import React, { useState } from 'react';
import { Year } from '../types';
import { motion } from 'framer-motion';

interface YearSelectorProps {
  years: Year[];
  onSelect: (yearId: string) => void;
}

export const YearSelector = ({ years, onSelect }: YearSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredYears = years.filter(y => 
    y.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    y.value.toString().includes(searchQuery)
  ).sort((a,b) => a.value - b.value);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        <input 
          type="text" 
          placeholder="Search year..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 mt-2">
        {filteredYears.map(year => (
          <motion.button
            key={year.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(year.id)}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card text-left hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-bold text-base text-foreground">{year.label}</span>
              <span className="text-sm text-muted-foreground">Year {year.value} Curriculum</span>
            </div>
            <span className="text-muted-foreground">→</span>
          </motion.button>
        ))}
        {filteredYears.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No years found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
