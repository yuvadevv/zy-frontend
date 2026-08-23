"use client";
import React, { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { ProgressStepper } from '@/features/manuals/components/ProgressStepper';
import { APP_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';

function ChooseSubjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') || '';
  const yearId = searchParams.get('yearId') || '';
  const semesterId = searchParams.get('semesterId') || '';

  const [searchQuery, setSearchQuery] = useState('');

  const { data: filtersResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['manualFilters'],
    queryFn: () => workerClient.getManualFilters()
  });

  // Filter subjects based on branch, year, semester
  const filteredSubjects = useMemo(() => {
    if (!filtersResponse?.subjects) return [];
    
    let result = filtersResponse.subjects.filter((s: any) => 
      s.branch_id === branchId && 
      s.semester_id === semesterId
    );

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((s: any) => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.code.toLowerCase().includes(lowerQuery)
      );
    }
    
    return result;
  }, [branchId, semesterId, searchQuery, filtersResponse]);

  const handleSelect = (subjectId: string) => {
    router.push(`${APP_ROUTES.MANUALS_WORKFLOW.MANUAL_LIST}?branchId=${branchId}&yearId=${yearId}&semesterId=${semesterId}&subjectId=${subjectId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-safe">
      <ProgressStepper currentStep={2} totalSteps={2} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Select Subject</h2>
          <p className="text-sm text-muted-foreground mt-1">Which subject do you need a manual for?</p>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00] mb-4"></div>
            <p className="text-gray-500 text-sm">Loading subjects...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 mt-20 text-center">
            <p className="text-red-500 font-medium mb-4">Unable to load subjects</p>
            <button onClick={() => refetch()} className="bg-[#FF6B00] text-white px-6 py-2 rounded-xl">Try again</button>
          </div>
        ) : (
        <>
          {/* Search */}
          <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
        </div>

        {/* Subjects List */}
        <div className="px-4 flex flex-col gap-3 pb-8">
          {filteredSubjects.map((subject: any) => (
            <button 
              key={subject.id} 
              onClick={() => handleSelect(subject.id)}
              className="flex items-center justify-between p-4 bg-white border border-border rounded-2xl shadow-sm text-left hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-[15px]">{subject.name}</span>
                <span className="text-sm text-muted-foreground font-medium mt-0.5">{subject.code}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filteredSubjects.length === 0 && (
            <div className="text-center p-8 border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground">No subjects found.</p>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

export default function ChooseSubjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ChooseSubjectContent />
    </Suspense>
  );
}
