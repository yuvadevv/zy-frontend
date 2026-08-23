// src/features/profile/components/AcademicInformationCard.tsx
import React from 'react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { GraduationCap, Building2, MapPin } from 'lucide-react';

export const AcademicInformationCard = () => {
  const { academicRecord } = useStudent();

  if (!academicRecord) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-bold text-foreground">Academic Information</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{academicRecord.colleges?.name || 'Ramachandra College of Engineering'}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{academicRecord.branches?.name || 'Branch not set'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <span className="block text-xs text-muted-foreground mb-1">Academic Year</span>
            <span className="font-bold text-foreground">{academicRecord.academic_years?.name || 'N/A'}</span>
          </div>
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <span className="block text-xs text-muted-foreground mb-1">Section</span>
            <span className="font-bold text-foreground">{academicRecord.sections?.name || 'N/A'}</span>
          </div>
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <span className="block text-xs text-muted-foreground mb-1">Block</span>
            <span className="font-bold text-foreground">{academicRecord.block || 'N/A'}</span>
          </div>
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <span className="block text-xs text-muted-foreground mb-1">Roll Number</span>
            <span className="font-bold text-foreground">{academicRecord.roll_number || 'N/A'}</span>
          </div>
          {academicRecord.classroom_number && (
            <div className="bg-muted/30 p-3 rounded-xl border border-border/50 col-span-2">
              <span className="block text-xs text-muted-foreground mb-1">Classroom Number</span>
              <span className="font-bold text-foreground">{academicRecord.classroom_number}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
