'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, MapPin, Check } from 'lucide-react';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { studentService } from '@/features/student/services/studentService';
import { SearchableDropdown } from '@/features/student/components/SearchableDropdown';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const editDeliverySchema = z.object({
  block: z.string().min(1, 'Block is required'),
  classroomNumber: z.string().min(1, 'Classroom is required'),
  deliveryNotes: z.string().optional(),
});

type EditDeliveryData = z.infer<typeof editDeliverySchema>;

export default function EditDeliveryPage() {
  const router = useRouter();
  const { profile, academicRecord, refreshProfile } = useStudent();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { register, handleSubmit, control, reset, formState: { isDirty } } = useForm<EditDeliveryData>({
    resolver: zodResolver(editDeliverySchema),
    defaultValues: {
      block: '',
      classroomNumber: '',
      deliveryNotes: '',
    },
  });

  useEffect(() => {
    if (profile && academicRecord) {
      reset({
        block: academicRecord.block || '',
        classroomNumber: academicRecord.classroom_number || '',
        deliveryNotes: profile.delivery_notes || '',
      });
    }
  }, [profile, academicRecord, reset]);

  const onSubmit = async (data: EditDeliveryData) => {
    if (!profile || !academicRecord) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await studentService.updateProfile(profile.user_id, {
        delivery_notes: data.deliveryNotes,
      });

      await studentService.updateAcademicRecord(profile.user_id, {
        block: data.block,
        classroom_number: data.classroomNumber,
      });

      await refreshProfile();
      toast.success('Delivery address updated');
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to update delivery address');
      toast.error('Failed to update address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      router.back();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardConfirm(false);
    router.back();
  };

  const inputClass = "w-full h-[52px] px-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all disabled:opacity-50";

  if (!academicRecord) return null;

  return (
    <div className="flex flex-col w-full h-full bg-white min-h-[100dvh]">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-black truncate">Delivery</h2>
        </div>
        <button
          type="submit"
          form="edit-delivery-form"
          disabled={!isDirty || isSaving}
          className={`h-[44px] min-w-[120px] px-4 rounded-[14px] text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isDirty && !isSaving 
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.20)] active:scale-[0.97]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form id="edit-delivery-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Read Only Section */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-black">Delivery Location</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">College</label>
              <p className="text-sm font-medium text-black">{academicRecord.colleges?.name || 'Ramachandra College of Engineering'}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</label>
              <p className="text-sm font-medium text-black">{academicRecord.branches?.name || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic Year</label>
                <p className="text-sm font-medium text-black">{academicRecord.academic_years?.name || '-'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</label>
                <p className="text-sm font-medium text-black">{academicRecord.sections?.name || '-'}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Editable Section */}
          <div className="space-y-5">
            <h3 className="font-bold text-black">Editable Details</h3>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-black">Block</label>
              <Controller
                name="block"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={[
                      { label: 'A Block', value: 'A Block' },
                      { label: 'B Block', value: 'B Block' },
                      { label: 'C Block', value: 'C Block' },
                      { label: 'D Block', value: 'D Block' },
                      { label: 'E Block', value: 'E Block' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Block"
                    searchable={false}
                    disabled={isSaving}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-black">Classroom Number</label>
              <input disabled={isSaving} {...register('classroomNumber')} className={inputClass} placeholder="e.g. SH-213" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-black">Delivery Notes (Optional)</label>
              <textarea 
                disabled={isSaving}
                {...register('deliveryNotes')} 
                className={`${inputClass} h-auto py-3 resize-none`}
                rows={3}
                placeholder="e.g. Leave near classroom door."
              />
            </div>
          </div>
        </form>
      </div>



      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl">
            <h3 className="text-lg font-bold text-black">Discard your changes?</h3>
            <p className="text-sm text-gray-600">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold text-black hover:bg-gray-200"
              >
                Keep Editing
              </button>
              <button 
                onClick={confirmDiscard}
                className="flex-1 py-3 bg-red-600 rounded-xl font-semibold text-white hover:bg-red-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
