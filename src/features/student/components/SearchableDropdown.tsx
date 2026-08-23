"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Loader2, CheckCircle2 } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  isLoading?: boolean;
  emptyText?: string;
  disabled?: boolean;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  isLoading = false,
  emptyText = "No options found",
  disabled = false
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "border-orange-500 ring-1 ring-orange-500" : ""
        } ${!selectedOption ? "text-gray-400" : "text-black"}`}
        style={{ minHeight: '52px' }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            {searchable && (
              <div className="border-b border-gray-100 p-3 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-gray-50 py-3 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            )}
            <ul className="max-h-60 overflow-y-auto py-2">
              {isLoading ? (
                <li className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </li>
              ) : filteredOptions.length === 0 ? (
                <li className="py-6 text-center text-sm text-gray-500">{emptyText}</li>
              ) : (
                filteredOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-orange-50 ${
                        value === opt.value ? "bg-orange-50/50 text-orange-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        value === opt.value ? "border-orange-500" : "border-gray-300"
                      }`}>
                        {value === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />}
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
