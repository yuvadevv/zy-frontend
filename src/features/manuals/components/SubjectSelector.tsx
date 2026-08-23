"use client";
import React, { useState } from 'react';
import { Subject } from '../types';
import { motion } from 'framer-motion';

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelect: (subjectId: string) => void;
}

export const SubjectSelector = ({ subjects, onSelect }: SubjectSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        <input 
          type="text" 
          placeholder="Search subjects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 mt-2">
        {filteredSubjects.map(subject => (
          <motion.button
            key={subject.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(subject.id)}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card text-left hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="flex flex-col pr-4">
              <span className="font-bold text-base text-foreground line-clamp-2 leading-tight mb-1">{subject.name}</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 w-fit px-2 py-0.5 rounded uppercase">{subject.code}</span>
            </div>
            <span className="text-muted-foreground shrink-0">→</span>
          </motion.button>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No subjects found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
