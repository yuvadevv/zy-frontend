// src/features/checkout/components/DeliveryCard.tsx
"use client";
import { MapPin, Edit2 } from 'lucide-react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { useRouter } from 'next/navigation';

export const DeliveryCard = () => {
  const { profile, academicRecord } = useStudent();
  const router = useRouter();

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <MapPin className="w-5 h-5 text-primary" />
          <h2>Delivery Location</h2>
        </div>
        <button 
          onClick={() => router.push('/app/profile/edit-delivery')}
          className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      <div className="flex flex-col bg-muted/30 p-3 rounded-xl border border-border/50">
        <span className="font-semibold text-sm">
          {academicRecord?.colleges?.name || 'College'}, {academicRecord?.branches?.name || 'Branch'}
        </span>
        <span className="text-sm text-foreground mt-1">
          {academicRecord?.block || 'Block'}, Section {academicRecord?.sections?.name || 'N/A'}, Room {academicRecord?.classroom_number || 'N/A'}
        </span>
        {profile?.delivery_notes && (
          <p className="text-xs text-muted-foreground mt-2 bg-background p-2 rounded-md border border-border/50">
            <span className="font-semibold block mb-0.5">Notes:</span>
            {profile.delivery_notes}
          </p>
        )}
      </div>
    </div>
  );
};
