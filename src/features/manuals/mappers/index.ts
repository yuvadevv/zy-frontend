import { BranchDTO, YearDTO, SemesterDTO, SubjectDTO, ManualDTO, PrintConfigDTO } from '../dto';
import { Branch, Year, Semester, Subject, Manual, PrintConfig } from '../types';

export const mapBranch = (dto: BranchDTO): Branch => ({
  id: dto.id,
  name: dto.name,
  code: dto.code,
});

export const mapYear = (dto: YearDTO): Year => ({
  id: dto.id,
  label: dto.label,
  value: dto.value,
});

export const mapSemester = (dto: SemesterDTO): Semester => ({
  id: dto.id,
  label: dto.label,
  value: dto.value,
});

export const mapSubject = (dto: SubjectDTO): Subject => ({
  id: dto.id,
  name: dto.name,
  code: dto.code,
});

export const mapManual = (dto: ManualDTO): Manual => ({
  id: dto.id,
  name: dto.name,
  subjectId: dto.subject_id,
  description: dto.description,
  pages: dto.pages,
  updatedAt: dto.updated_at,
  language: dto.language,
  availability: dto.availability,
  basePrice: dto.base_price,
  previewImageUrl: dto.preview_image_url,
  uploadedBy: dto.uploaded_by,
  hasPreview: !!dto.preview_object_key,
});

export const mapPrintConfig = (dto: PrintConfigDTO): PrintConfig => ({
  copies: dto.copies,
  singleSided: dto.single_sided,
  color: dto.color,
  bindingType: dto.binding_type,
  paperSize: dto.paper_size,
});
