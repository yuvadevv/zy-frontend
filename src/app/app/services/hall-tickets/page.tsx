import React from 'react';
import { AppHeader } from '@/features/app-shell/components/AppHeader';
import { DocumentUploadFlow } from '@/features/services/components/DocumentUploadFlow';

export default function HallTicketsPage() {
  return (
    <>
      <DocumentUploadFlow 
        title="Upload Your Hall Ticket"
        subtitle="Upload your hall ticket PDF and we'll prepare it for printing."
        serviceType="hall_ticket"
        allowedBindings={['none']}
        basePrice={5}
      />
    </>
  );
}
