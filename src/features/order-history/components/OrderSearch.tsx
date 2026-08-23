import React, { useState, useEffect, useRef } from 'react';
import { Search, X, HelpCircle, History, Flame } from 'lucide-react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { AnimatePresence, motion } from 'framer-motion';

import { SupportBottomSheet } from './SupportBottomSheet';

export const OrderSearch = () => {
  const { search, setSearch } = useOrderHistory();
  const [inputValue, setInputValue] = useState(search?.query || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== (search?.query || '')) {
        setSearch(inputValue ? { query: inputValue } : undefined);
      }
    }, 250); // Reduced to 250ms as per V2.1 spec
    return () => clearTimeout(timer);
  }, [inputValue, search, setSearch]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
    setIsFocused(false);
  };

  const recentSearches = ['CS101 Assignment', 'Hall Ticket', 'Physics Manual', 'Machine Learning'];
  const suggestedTags = ['Printing', 'Delivered', 'Cancelled', 'Refunded'];

  return (
    <div className="relative w-full px-5 pt-4 pb-2" ref={dropdownRef}>
      <div className="flex items-center gap-3 relative z-40">
        <div className="relative flex items-center flex-1 h-[52px] bg-gray-50 border border-gray-200 rounded-[18px] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all overflow-hidden shadow-sm">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by Order ID, Manual, Subject..."
            className="w-full h-full bg-transparent outline-none pl-12 pr-12 text-[15px] font-medium text-gray-900 placeholder:text-gray-400"
            value={inputValue}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button 
              onClick={() => setInputValue('')}
              className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setIsSupportOpen(true)}
          className="w-[52px] h-[52px] shrink-0 bg-white border border-gray-200 rounded-[18px] flex items-center justify-center text-gray-600 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
        >
          <HelpCircle className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
      
      <SupportBottomSheet isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Smart Search Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[76px] left-5 right-5 bg-white border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden z-40 p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</span>
                <div className="flex flex-col">
                  {recentSearches.map(term => (
                    <button 
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                    >
                      <History className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-[15px] font-medium text-gray-700">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-gray-100 w-full" />
              
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleSuggestionClick(tag)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 hover:border-orange-200 rounded-xl transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5 opacity-60" />
                      <span className="text-[13px] font-medium text-gray-700">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
