import { BranchDTO, YearDTO, SemesterDTO, SubjectDTO, ManualDTO } from '../dto';

export const MOCK_BRANCHES: BranchDTO[] = [
  { id: 'b_aiml', name: 'Artificial Intelligence & ML', code: 'AIML' },
  { id: 'b_cse', name: 'Computer Science', code: 'CSE' },
  { id: 'b_ece', name: 'Electronics & Communication', code: 'ECE' },
  { id: 'b_eee', name: 'Electrical & Electronics', code: 'EEE' },
  { id: 'b_mech', name: 'Mechanical Engineering', code: 'MECH' },
  { id: 'b_civil', name: 'Civil Engineering', code: 'CIVIL' },
];

export const MOCK_YEARS: YearDTO[] = [
  { id: 'y_1', label: '1st Year', value: 1 },
  { id: 'y_2', label: '2nd Year', value: 2 },
  { id: 'y_3', label: '3rd Year', value: 3 },
  { id: 'y_4', label: '4th Year', value: 4 },
];

export const MOCK_SEMESTERS: SemesterDTO[] = [
  { id: 's_1', label: 'Semester 1', value: 1 },
  { id: 's_2', label: 'Semester 2', value: 2 },
  { id: 's_3', label: 'Semester 3', value: 3 },
  { id: 's_4', label: 'Semester 4', value: 4 },
  { id: 's_5', label: 'Semester 5', value: 5 },
  { id: 's_6', label: 'Semester 6', value: 6 },
  { id: 's_7', label: 'Semester 7', value: 7 },
  { id: 's_8', label: 'Semester 8', value: 8 },
];

export const MOCK_SUBJECTS: SubjectDTO[] = [
  { id: 'sub_ds', name: 'Data Structures', code: 'CS101', branch_id: 'b_aiml', year_id: 'y_1', semester_id: 's_1' },
  { id: 'sub_ds_cse', name: 'Data Structures', code: 'CS101', branch_id: 'b_cse', year_id: 'y_2', semester_id: 's_3' },
  { id: 'sub_algo', name: 'Design and Analysis of Algorithms', code: 'CS102', branch_id: 'b_aiml', year_id: 'y_1', semester_id: 's_2' },
  { id: 'sub_algo_cse', name: 'Design and Analysis of Algorithms', code: 'CS102', branch_id: 'b_cse', year_id: 'y_2', semester_id: 's_4' },
  { id: 'sub_os', name: 'Operating Systems', code: 'CS103', branch_id: 'b_aiml', year_id: 'y_2', semester_id: 's_3' },
  { id: 'sub_dbms', name: 'Database Management Systems', code: 'CS104', branch_id: 'b_cse', year_id: 'y_3', semester_id: 's_5' },
  { id: 'sub_ml', name: 'Machine Learning', code: 'CS105', branch_id: 'b_aiml', year_id: 'y_3', semester_id: 's_5' },
];

export const MOCK_MANUALS: ManualDTO[] = [
  {
    id: 'm_ds_v1',
    name: 'Data Structures Lab Manual',
    subject_id: 'sub_ds',
    branch_id: 'b_aiml',
    year_id: 'y_1',
    semester_id: 's_1',
    description: 'Complete lab manual for Data Structures covering arrays, linked lists, stacks, queues, trees, and graphs with C++ implementations.',
    pages: 124,
    updated_at: '2026-06-15T00:00:00Z',
    language: 'English',
    availability: 'in_stock',
    base_price: 150,
    uploaded_by: 'Prof. Sharma',
  },
  {
    id: 'm_ds_v2',
    name: 'Data Structures Lab Manual',
    subject_id: 'sub_ds_cse',
    branch_id: 'b_cse',
    year_id: 'y_2',
    semester_id: 's_3',
    description: 'Complete lab manual for Data Structures covering arrays, linked lists, stacks, queues, trees, and graphs with C++ implementations.',
    pages: 130,
    updated_at: '2026-06-15T00:00:00Z',
    language: 'English',
    availability: 'in_stock',
    base_price: 155,
    uploaded_by: 'Prof. Sharma',
  },
  {
    id: 'm_algo_v1',
    name: 'Algorithms Lab Manual',
    subject_id: 'sub_algo',
    branch_id: 'b_aiml',
    year_id: 'y_1',
    semester_id: 's_2',
    description: 'Comprehensive guide to algorithmic paradigms including divide and conquer, greedy methods, and dynamic programming.',
    pages: 98,
    updated_at: '2026-01-10T00:00:00Z',
    language: 'English',
    availability: 'in_stock',
    base_price: 120,
    uploaded_by: 'Dr. Gupta',
  },
  {
    id: 'm_algo_v2',
    name: 'Design and Analysis of Algorithms',
    subject_id: 'sub_algo_cse',
    branch_id: 'b_cse',
    year_id: 'y_2',
    semester_id: 's_4',
    description: 'Comprehensive guide to algorithmic paradigms.',
    pages: 110,
    updated_at: '2026-01-10T00:00:00Z',
    language: 'English',
    availability: 'in_stock',
    base_price: 125,
    uploaded_by: 'Dr. Gupta',
  }
];
