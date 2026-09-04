'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ManualForm from '@/components/admin/ManualForm';

export default function AdminManualsUploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <Link 
          href="/admin/manuals" 
          className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Manuals
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload Manual</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new lab manual to the student catalog.</p>
        </div>
      </div>

      <ManualForm mode="create" />
    </div>
  );
}
