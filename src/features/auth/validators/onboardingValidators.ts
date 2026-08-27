import { z } from 'zod';

export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  avatarPath: z.string().optional(),
});

export const onboardingStep2Schema = z.object({
  collegeId: z.string().min(1, 'Please select a college'),
  departmentId: z.string().min(1, 'Please select a department').optional(),
  branchId: z.string().min(1, 'Please select a branch'),
  academicYearId: z.string().min(1, 'Please select your academic year'),
  sectionId: z.string().min(1, 'Please select your section'),
  blockId: z.string().min(1, 'Please select a block'),
  classroomId: z.string().min(1, 'Please select a classroom'),
  rollNumber: z.string().regex(/^[a-zA-Z0-9]{10}$/, 'Roll number must be exactly 10 characters.'),
});

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;
