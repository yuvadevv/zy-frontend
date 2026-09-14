'use client';
import React, { useState } from 'react';
import { AppHeader } from '@/features/app-shell/components/AppHeader';
import { DocumentUploadFlow } from '@/features/services/components/DocumentUploadFlow';
import { CodeTantraUploadFlow } from '@/features/services/components/CodeTantraUploadFlow';
import { FileText, FileCode2, ChevronLeft } from 'lucide-react';

export default function CustomUploadPage() {
  const [activeFlow, setActiveFlow] = useState<'none' | 'standard' | 'codetantra'>('none');

  if (activeFlow === 'standard') {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="p-4 border-b border-border bg-card sticky top-0 z-10 pt-safe flex items-center gap-3">
          <button onClick={() => setActiveFlow('none')} className="p-2 hover:bg-secondary rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Standard PDF</h1>
        </div>
        <DocumentUploadFlow 
          title="Standard Custom Print"
          subtitle="Upload a single PDF for custom printing."
          serviceType="custom"
          allowedBindings={['spiral']}
          basePrice={10}
        />
      </div>
    );
  }

  if (activeFlow === 'codetantra') {
    return (
      <div className="flex flex-col h-full bg-background">
         <div className="p-4 border-b border-border bg-card sticky top-0 z-10 pt-safe flex items-center gap-3">
          <button onClick={() => setActiveFlow('none')} className="p-2 hover:bg-secondary rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Code Tantra Files</h1>
        </div>
        <CodeTantraUploadFlow />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-2xl mx-auto w-full pb-32">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Select Upload Type</h2>
          <p className="text-muted-foreground mt-1 text-sm">Choose the type of file you want to upload for printing.</p>
        </div>

        {/* Standard PDF Card */}
        <button
          onClick={() => setActiveFlow('standard')}
          className="w-full text-left group bg-card border-2 border-border hover:border-primary/50 hover:shadow-lg rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100 group-hover:scale-105 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Standard PDF</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload a single standard PDF file. We will calculate the pages and you can choose spiral binding options.
              </p>
            </div>
          </div>
        </button>

        {/* Code Tantra Files Card */}
        <button
          onClick={() => setActiveFlow('codetantra')}
          className="w-full text-left group bg-card border-2 border-border hover:border-[#FF6B00]/50 hover:shadow-lg rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-[#FF6B00]/10 text-[#FF6B00] rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[#FF6B00]/20 group-hover:scale-105 transition-transform">
              <FileCode2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">Code Tantra Files</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload your project ZIP or PDF files. We will analyze the files, extract PDFs, and calculate the exact printing price based on your choices.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
