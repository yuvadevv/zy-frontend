export interface BranchDTO {
  id: string;
  name: string;
  code: string;
}

export interface YearDTO {
  id: string;
  label: string;
  value: number;
}

export interface SemesterDTO {
  id: string;
  label: string;
  value: number;
}

export interface SubjectDTO {
  id: string;
  name: string;
  code: string;
  branch_id: string;
  year_id: string;
  semester_id: string;
}

export interface ManualDTO {
  id: string;
  name: string;
  subject_id: string;
  branch_id: string;
  year_id: string;
  semester_id: string;
  description: string;
  pages: number;
  updated_at: string;
  language: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  base_price: number;
  preview_image_url?: string;
  uploaded_by?: string;
  preview_object_key?: string;
}

export interface PrintConfigDTO {
  copies: number;
  single_sided: boolean;
  color: boolean;
  binding_type: 'none' | 'spiral' | 'softbound' | 'hardbound';
  paper_size: 'a4' | 'letter';
}
