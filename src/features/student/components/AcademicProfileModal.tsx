'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Hash, 
  DoorClosed, 
  X, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { studentService } from '../services/studentService';
import { academicService, AcademicOptions } from '../services/academicService';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

interface AcademicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const AcademicProfileModal: React.FC<AcademicProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Complete Your Academic Profile",
  subtitle = "Please provide your academic details before placing your first order. This helps us deliver your orders to the correct classroom."
}) => {
  const { user } = useAuthSession();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeId, setCollegeId] = useState('COL-001');
  const [collegeName, setCollegeName] = useState('RAMACHANDRA COLLEGE OF ENGINEERING');
  const [branchId, setBranchId] = useState('');
  const [yearId, setYearId] = useState('');
  const [section, setSection] = useState('');
  const [blockId, setBlockId] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classroom, setClassroom] = useState('');

  // Options State
  const [options, setOptions] = useState<AcademicOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load configured options and current student profile
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoadingOptions(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    async function loadData() {
      try {
        const [opts, currentStudent] = await Promise.all([
          academicService.getAllOptions().catch(() => null),
          user?.id ? studentService.getProfile(user.id).catch(() => null) : null
        ]);

        if (!isMounted) return;

        if (opts) {
          setOptions(opts);
          if (opts.colleges?.[0]) {
            setCollegeId(opts.colleges[0].id);
            setCollegeName(opts.colleges[0].name);
          }
        }

        // Prefill existing student or Google user data
        const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.name || '';
        const googlePhone = user?.user_metadata?.phone || user?.phone || '';

        setFullName(currentStudent?.full_name || googleName || '');
        setPhone(currentStudent?.phone_number || googlePhone || '');

        if (user?.id) {
          const academicRecord = await studentService.getAcademicRecord(user.id).catch(() => null);
          if (academicRecord && isMounted) {
            if (academicRecord.roll_number) setRollNumber(academicRecord.roll_number);
            if (academicRecord.branch_id) setBranchId(academicRecord.branch_id);
            if (academicRecord.academic_year_id) setYearId(academicRecord.academic_year_id);
            if (academicRecord.section_id) setSection(academicRecord.section_id);
            if (academicRecord.block_id) setBlockId(academicRecord.block_id);
            if (academicRecord.classroom_id || academicRecord.classrooms?.name) {
              setClassroom(academicRecord.classrooms?.name || academicRecord.classroom_id || '');
            }
          }
        }
      } catch (err: any) {
        console.warn('Failed to load academic options or profile:', err);
      } finally {
        if (isMounted) setIsLoadingOptions(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Fallback branches if network fails
  const fallbackBranches = [
    { id: 'b_cse', name: 'Computer Science Engineering (CSE)' },
    { id: 'b_aiml', name: 'Artificial Intelligence & Machine Learning (AIML)' },
    { id: 'ccfd4597-817d-412a-8b54-57c53804272b', name: 'Artificial Intelligence & Data Science (AIDS)' },
    { id: 'c41e487f-ef74-4b07-b477-c12c173068bb', name: 'Internet Of Things (IOT)' },
    { id: 'dadcab5b-fe8f-4f3b-9de3-e85cbb7dec11', name: 'Cyber Security (CS)' },
    { id: 'b_ece', name: 'Electronics & Communication (ECE)' },
    { id: 'b_eee', name: 'Electrical & Electronics (EEE)' },
    { id: 'b_mech', name: 'Mechanical Engineering (MECH)' },
    { id: 'b_civil', name: 'Civil Engineering (CIVIL)' },
    { id: 'd247fd39-9c07-4266-a828-5a74952d6512', name: 'Bachelor of Business Administration (BBA)' }
  ];

  const branches = options?.branches && options.branches.length > 0 ? options.branches : fallbackBranches;

  const years = options?.academicYears && options.academicYears.length > 0 ? options.academicYears : [
    { id: 'y_1', name: '1st Year' },
    { id: 'y_2', name: '2nd Year' },
    { id: 'y_3', name: '3rd Year' },
    { id: 'y_4', name: '4th Year' }
  ];

  const sections = ['A', 'B', 'C'];

  const blocks = options?.blocks && options.blocks.length > 0 ? options.blocks : [
    { id: '6bbaf05e-afe8-419b-9c6a-b4d1faee7b8a', name: 'A-BLOCK' },
    { id: 'bbd18684-c506-4427-bf18-296ef3193034', name: 'B-BLOCK' },
    { id: '76297168-bfa9-4ae4-8905-d9dd0331cae6', name: 'C-BLOCK' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedName = fullName.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanClassroom = classroom.trim().toUpperCase();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order delivery.');
      return;
    }
    if (!cleanRoll) {
      setErrorMessage('Roll Number is required.');
      return;
    }
    if (!branchId) {
      setErrorMessage('Please select your branch / department.');
      return;
    }
    if (!yearId) {
      setErrorMessage('Please select your academic year.');
      return;
    }
    if (!section) {
      setErrorMessage('Please select your section.');
      return;
    }
    if (!blockId) {
      setErrorMessage('Please select your campus block.');
      return;
    }
    if (!cleanClassroom) {
      setErrorMessage('Classroom number is required (e.g. SH-101, 204).');
      return;
    }

    setIsSubmitting(true);

    try {
      const sem = options?.semesters?.find((s: any) => s.academic_year_id === yearId);
      const semesterId = sem ? sem.id : 's_1';

      await studentService.saveCompleteAcademicProfile({
        name: trimmedName,
        phone: cleanPhone,
        email: user?.email || '',
        avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
        roll_number: cleanRoll,
        college_id: collegeId,
        branch_id: branchId,
        study_year_id: yearId,
        semester_id: semesterId,
        section: section,
        block_id: blockId,
        classroom_id: cleanClassroom
      });

      setSaveSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('CONFLICT') || err.status === 409) {
        setErrorMessage('This roll number is already registered by another student. Please verify your roll number.');
      } else {
        setErrorMessage(msg || 'Failed to save academic profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-br from-[#151515] to-[#252525] text-white p-5 sm:p-6 pb-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-orange-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-[#FF6B00]/30">
                Mandatory for Orders
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed font-normal">
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1 leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Academic Profile saved successfully! Continuing to order...</span>
              </div>
            )}

            {/* Student Identity Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Student Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-xs font-bold text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* College Field (Configured Default) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400" /> College Name
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-gray-100/80 flex items-center justify-between">
                <span>{collegeName}</span>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Default Campus
                </span>
              </div>
            </div>

            {/* Branch / Department Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> Branch / Department *
              </label>
              <select
                required
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
              >
                <option value="">Select your Branch / Department</option>
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year & Section */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Academic Year *
                </label>
                <select
                  required
                  value={yearId}
                  onChange={(e) => setYearId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
                >
                  <option value="">Select Year</option>
                  {years.map((y: any) => (
                    <option key={y.id} value={y.id}>
                      {y.name || y.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Section *
                </label>
                <select
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Block & Classroom Number */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" /> College Block *
                </label>
                <select
                  required
                  value={blockId}
                  onChange={(e) => setBlockId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
                >
                  <option value="">Select Block</option>
                  {blocks.map((bl: any) => (
                    <option key={bl.id} value={bl.id}>
                      {bl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <DoorClosed className="w-3.5 h-3.5 text-gray-400" /> Classroom *
                </label>
                <input
                  type="text"
                  required
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value.toUpperCase())}
                  placeholder="e.g. SH-101"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-gray-400" /> Roll Number (Student ID) *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 21ME1A0501"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold font-mono tracking-wide text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 bg-white"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Must be your registered college student roll number. Unique per student.
              </span>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isLoadingOptions || saveSuccess}
                className="flex-[2] py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save & Proceed to Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
