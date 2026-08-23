// src/features/profile/components/DeliveryPreferencesCard.tsx
import React from 'react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { Truck, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DeliveryPreferencesCard = () => {
  const { profile, academicRecord } = useStudent();
  const router = useRouter();

  if (!profile || !academicRecord) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="font-bold text-foreground">Delivery Preferences</h3>
        </div>
        <button onClick={() => router.push('/app/profile/edit-delivery')} className="text-sm font-semibold text-primary hover:underline">Edit</button>
      </div>

      <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl border border-border/50">
        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-foreground flex items-center gap-2">
            {academicRecord.classroom_number || 'Room not set'}
            <span className="text-[10px] uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm">Default</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {academicRecord.colleges?.name || 'College'}, {academicRecord.branches?.name || 'Branch'}, {academicRecord.block || 'Block'}, Section {academicRecord.sections?.name || 'N/A'}
          </span>
          {profile.delivery_notes && (
            <p className="text-xs text-muted-foreground mt-1 bg-background p-2 rounded-md border border-border/50">
              <span className="font-semibold block mb-0.5">Notes:</span>
              {profile.delivery_notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
