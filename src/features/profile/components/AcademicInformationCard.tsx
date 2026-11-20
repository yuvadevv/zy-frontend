'use client';

import React from 'react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { GraduationCap, Building2, MapPin, Hash, DoorClosed, Edit2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AcademicInformationCard = () => {
  const student = useStudent();
  const academicRecord = student?.academicRecord;
  const isProfileCompleted = Boolean(student?.isProfileCompleted);
  const handleOpenAcademicModal = (onSuccess?: () => void) => {
    if (student && typeof student.openAcademicModal === 'function') {
      student.openAcademicModal(onSuccess);
    } else {
      window.location.href = '/app/profile/edit';
    }
  };

  if (!isProfileCompleted || !academicRecord) {
    return (
      <div className="bg-white border-2 border-dashed border-orange-200 rounded-3xl p-5 shadow-sm mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Academic Information</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Action Required
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          Please provide your academic details before placing your first order. This helps us deliver your orders to the correct classroom.
        </p>

        <button
          onClick={() => handleOpenAcademicModal()}
          className="w-full py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Complete Academic Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const collegeName = academicRecord.colleges?.name || 'RAMACHANDRA COLLEGE OF ENGINEERING';
  const branchName = academicRecord.branches?.name || academicRecord.branch_id || 'Not set';
  const yearName = academicRecord.academic_years?.name || academicRecord.academic_year_id || 'Not set';
  const sectionName = academicRecord.sections?.name || (academicRecord.section_id ? `Section ${academicRecord.section_id}` : 'Not set');
  const blockName = academicRecord.blocks?.name || academicRecord.block_id || 'Not set';
  const rollNumber = academicRecord.roll_number || 'Not set';
  const classroomName = academicRecord.classrooms?.name || academicRecord.classroom_id || 'Not set';

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-[#FF6B00]" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">Academic Information</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Complete & Verified
            </span>
          </div>
        </div>

        <button
          onClick={() => handleOpenAcademicModal()}
          className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Edit Academic Details"
        >
          <Edit2 className="w-3 h-3 text-[#FF6B00]" />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* College */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
          <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">College</span>
            <span className="text-xs font-bold text-gray-900">{collegeName}</span>
          </div>
        </div>

        {/* Branch */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Branch / Department</span>
            <span className="text-xs font-bold text-gray-900">{branchName}</span>
          </div>
        </div>

        {/* 2x2 Grid of Academic Details */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Academic Year</span>
            <span className="font-extrabold text-xs text-gray-900">{yearName}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Section</span>
            <span className="font-extrabold text-xs text-gray-900">{sectionName}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">College Block</span>
            <span className="font-extrabold text-xs text-gray-900">{blockName}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Roll Number</span>
            <span className="font-extrabold text-xs text-gray-900 font-mono tracking-wide">{rollNumber}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 col-span-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Classroom Number</span>
            <span className="font-extrabold text-xs text-[#FF6B00] font-mono tracking-wide">{classroomName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
