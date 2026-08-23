"use client";
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search services..." }: SearchBarProps) => {
  return (
    <div className="px-4 mb-6">
      <div className="relative flex items-center w-full h-12 rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
        <div className="pl-4 pr-3 text-gray-400 flex items-center justify-center">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium pr-4"
          aria-label="Search services"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="pr-4 text-gray-400 hover:text-gray-700 focus:outline-none flex items-center justify-center"
            aria-label="Clear search"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};
