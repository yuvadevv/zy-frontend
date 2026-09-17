import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, UploadCloud } from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

export const EmptyManualsState = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl shadow-sm my-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">Manuals are being updated</h3>
      <p className="text-sm text-muted-foreground mb-6">
        The latest syllabus and study materials are currently pending from the college. Please check back soon.
      </p>
      
      <div className="w-full h-px bg-border my-2"></div>
      
      <div className="w-full mt-4 flex flex-col items-center">
        <p className="text-sm text-foreground/80 mb-4">
          Need something urgently? Upload your document through Custom Uploads and place your print order.
        </p>
        <button
          onClick={() => router.push(APP_ROUTES.SERVICES.UPLOAD_PDF)}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <UploadCloud className="w-5 h-5" />
          Go to Custom Uploads
        </button>
      </div>
    </div>
  );
};
