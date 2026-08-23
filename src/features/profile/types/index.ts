// src/features/profile/types/index.ts

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  mobile: string;
  email: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export interface AcademicProfile {
  collegeId: string;
  collegeName: string;
  campusId: string;
  campusName: string;
  departmentId: string;
  departmentName: string;
  branchId: string;
  branchName: string;
  year: number;
  semester: number;
  section: string;
  rollNumber: string;
  classroomNumber?: string;
}

export interface SavedClassroom {
  id: string;
  isDefault: boolean;
  building: string;
  floor: string;
  roomNumber: string;
  deliveryNotes?: string;
}

export interface DeliveryPreference {
  defaultClassroomId?: string;
  savedClassrooms: SavedClassroom[];
}

export interface ConnectedDevice {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  lastLogin: Date;
  location?: string;
  isCurrentDevice: boolean;
}

export interface SecuritySettings {
  otpLoginEnabled: boolean;
  connectedDevices: ConnectedDevice[];
}

export interface SupportOption {
  id: string;
  type: 'WHATSAPP' | 'CALL' | 'EMAIL' | 'FAQ' | 'TICKET';
  title: string;
  description: string;
  actionUrl: string;
}

export interface ApplicationInfo {
  version: string;
  buildNumber: string;
  environment: string;
}

export interface CombinedStudentData {
  profile: StudentProfile;
  academic: AcademicProfile;
  delivery: DeliveryPreference;
  security: SecuritySettings;
}
