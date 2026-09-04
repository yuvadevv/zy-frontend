export interface Branch {
  id: string;
  name: string;
  code: string;
}

export interface Year {
  id: string;
  label: string;
  value: number;
}

export interface Semester {
  id: string;
  label: string;
  value: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Manual {
  id: string;
  name: string;
  subjectId: string;
  description: string;
  pages: number;
  updatedAt: string;
  language: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  stock: number;
  basePrice: number;
  previewImageUrl?: string;
  uploadedBy?: string;
  hasPreview?: boolean;
}

export interface PrintConfig {
  copies: number;
  singleSided: boolean;
  color: boolean;
  bindingType: 'none' | 'spiral' | 'softbound' | 'hardbound';
  paperSize: 'a4' | 'letter';
}
export interface PriceBreakdown {
  basePrice: number;
  printingCost: number;
  bindingCost: number;
  colorCost?: number;
  total: number;
}
