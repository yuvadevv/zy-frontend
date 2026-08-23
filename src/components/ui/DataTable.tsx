'use client';

import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Info } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  enableSorting?: boolean;
  className?: string; // Optional custom column styling
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  
  // Sorting
  sortColumn?: keyof T | string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: keyof T | string) => void;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // Mobile Render (for turning rows into cards)
  renderMobileCard?: (item: T) => ReactNode;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading,
  isError,
  errorMessage = 'Failed to load data.',
  onRetry,
  emptyMessage = 'No records found.',
  sortColumn,
  sortDirection,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  renderMobileCard
}: DataTableProps<T>) {

  const renderSortIcon = (key: keyof T | string) => {
    if (sortColumn !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-[#FF6B00] ml-1" /> : 
      <ArrowDown className="w-4 h-4 text-[#FF6B00] ml-1" />;
  };

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-sm text-gray-500 mb-4">{errorMessage}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF6B00] hover:bg-[#e66000] focus:outline-none"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
        </div>
      )}

      {/* Mobile Card View */}
      {renderMobileCard && data.length > 0 && (
        <div className="md:hidden divide-y divide-gray-100">
          {data.map((item) => (
            <div key={keyExtractor(item)} className="p-4">
              {renderMobileCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      <div className={`overflow-x-auto ${renderMobileCard ? 'hidden md:block' : 'block'}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => {
                const isSortable = col.enableSorting && (col.accessorKey || col.header);
                const columnKey = col.accessorKey || col.header;
                return (
                  <th
                    key={index}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {isSortable ? (
                      <button
                        onClick={() => onSort?.(columnKey as string)}
                        className="flex items-center group focus:outline-none hover:text-gray-700"
                      >
                        {col.header}
                        {renderSortIcon(columnKey as string)}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.className || ''}`}>
                      {col.cell 
                        ? col.cell(item) 
                        : col.accessorKey 
                          ? String(item[col.accessorKey]) 
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 mt-auto">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Simplified page numbers for brevity */}
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {currentPage}
                </span>
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
