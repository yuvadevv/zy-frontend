"use client";
import React, { useState } from 'react';
import { Semester } from '../types';
import { motion } from 'framer-motion';

interface SemesterSelectorProps {
  semesters: Semester[];
  onSelect: (semesterId: string) => void;
}

export const SemesterSelector = ({ semesters, onSelect }: SemesterSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSemesters = semesters.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.value.toString().includes(searchQuery)
  ).sort((a,b) => a.value - b.value);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        <input 
          type="text" 
          placeholder="Search semester..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 mt-2">
        {filteredSemesters.map(semester => (
          <motion.button
            key={semester.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(semester.id)}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card text-left hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-bold text-base text-foreground">{semester.label}</span>
              <span className="text-sm text-muted-foreground">Semester {semester.value} Subjects</span>
            </div>
            <span className="text-muted-foreground">→</span>
          </motion.button>
        ))}
        {filteredSemesters.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No semesters found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
