'use client';
import React from 'react';
import { DocumentUploadFlow } from '@/features/services/components/DocumentUploadFlow';

export default function CustomUploadPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <DocumentUploadFlow 
        title="Standard Custom Print"
        subtitle="Upload a single PDF for custom printing."
        serviceType="custom"
        allowedBindings={['none', 'spiral']}
        basePrice={10}
      />
    </div>
  );
}
