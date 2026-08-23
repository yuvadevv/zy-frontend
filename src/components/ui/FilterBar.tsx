'use client';

import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters
}: FilterBarProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const FilterInputs = () => (
    <>
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 sm:hidden">{filter.label}</label>
          <select
            value={activeFilters[filter.key] || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#FF6B00] focus:outline-none focus:ring-[#FF6B00] sm:text-sm border bg-white"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors mt-4 sm:mt-0"
        >
          Clear Filters
        </button>
      )}
    </>
  );

  return (
    <div className="mb-6">
      {/* Desktop Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-[#FF6B00] focus:outline-none focus:ring-[#FF6B00]"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex items-center gap-4 flex-wrap flex-1 justify-end">
          <FilterInputs />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-[#FF6B00] px-2 py-0.5 text-xs font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <FilterInputs />
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66000] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
