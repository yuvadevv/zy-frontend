"use client";
import React, { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ManualCard } from '@/features/manuals/components/ManualCard';
import { mapManual } from '@/features/manuals/mappers';
import { APP_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import { workerClient } from '@/lib/api/workerClient';

function ManualListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') || '';
  const yearId = searchParams.get('yearId') || '';
  const semesterId = searchParams.get('semesterId') || '';
  const subjectId = searchParams.get('subjectId') || '';

  const { data: filtersResponse } = useQuery({
    queryKey: ['manualFilters'],
    queryFn: () => workerClient.getManualFilters()
  });

  const subject = filtersResponse?.subjects?.find((s: any) => s.id === subjectId);

  const { data: manualsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['manualsList', { branchId, yearId, semesterId, subjectId }],
    queryFn: () => workerClient.getManuals({ 
      branchId, 
      studyYearId: yearId, 
      semesterId, 
      subjectId 
    })
  });

  const filteredManuals = useMemo(() => {
    if (!manualsResponse?.manuals) return [];
    return manualsResponse.manuals.map((m: any) => ({
      ...m,
      name: m.title,
      availability: m.stock > 0 && (m.availability === 'available' || m.availability === 'in_stock') ? 'in_stock' : 'out_of_stock',
      stock: m.stock || 0,
      updated_at: new Date().toISOString(), // Fallback if missing
      language: 'English',
      uploaded_by: 'Admin'
    })).map(mapManual);
  }, [manualsResponse]);

  const handleSelect = (manualId: string) => {
    // Navigate directly to OPTIONS with the selected params
    router.push(`${APP_ROUTES.MANUALS_WORKFLOW.OPTIONS}?branchId=${branchId}&yearId=${yearId}&semesterId=${semesterId}&subjectId=${subjectId}&manualId=${manualId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-safe">
      
      <div className="flex flex-col pt-4 px-4 pb-4 bg-background">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {subject ? `${subject.name} Manuals` : 'Manuals'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Choose a manual to continue</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 mt-2">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00] mb-4"></div>
            <p className="text-gray-500 text-sm">Loading manuals...</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-red-500 font-medium mb-4">Unable to load manuals</p>
            <button onClick={() => refetch()} className="bg-[#FF6B00] text-white px-6 py-2 rounded-xl">Try again</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredManuals.map((manual: any) => (
              <ManualCard key={manual.id} manual={manual} onClick={handleSelect} />
            ))}
            {filteredManuals.length === 0 && (
              <div className="text-center p-8 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">No matching manuals found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManualListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ManualListContent />
    </Suspense>
  );
}
