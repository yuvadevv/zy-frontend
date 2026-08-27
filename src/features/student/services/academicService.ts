import { College, Branch, AcademicYear, Semester, Section } from '../types';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8500';

export interface AcademicOptions {
  colleges: College[];
  branches: Branch[];
  academicYears: AcademicYear[];
  semesters: Semester[];
  sections: Section[];
  blocks: { id: string; college_id: string; name: string }[];
  classrooms: { id: string; block_id: string; name: string }[];
}

export const academicService = {
  getAllOptions: async (): Promise<AcademicOptions> => {
    const res = await fetch(`${WORKER_URL}/api/public/academic-options`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load academic options');
    const data = await res.json();
    return {
      colleges: data.colleges || [],
      branches: data.branches || [],
      academicYears: data.academicYears || [],
      semesters: data.semesters || [],
      sections: data.sections || [],
      blocks: data.blocks || [],
      classrooms: data.classrooms || []
    };
  }
};
