// src/features/profile/services/mockProfile.ts
import { CombinedStudentData } from '../types';

export const mockStudentData: CombinedStudentData = {
  profile: {
    id: 'STU-98765',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul.s@college.edu',
    isEmailVerified: true,
    isMobileVerified: true,
  },
  academic: {
    collegeId: 'COL-001',
    collegeName: 'National Institute of Technology',
    campusId: 'CAM-MAIN',
    campusName: 'Main Campus',
    departmentId: 'DEPT-CSE',
    departmentName: 'Computer Science and Engineering',
    branchId: 'BR-CSE',
    branchName: 'B.Tech CSE',
    year: 3,
    semester: 5,
    section: 'A',
    rollNumber: '21CS3001'
  },
  delivery: {
    defaultClassroomId: 'ROOM-502',
    savedClassrooms: [
      {
        id: 'ROOM-502',
        isDefault: true,
        building: 'Block A (CSE)',
        floor: '5th Floor',
        roomNumber: 'Room 502',
        deliveryNotes: 'Leave near the podium if class is ongoing'
      },
      {
        id: 'ROOM-314',
        isDefault: false,
        building: 'Library Block',
        floor: '3rd Floor',
        roomNumber: 'Reading Room C',
      }
    ]
  },
  security: {
    otpLoginEnabled: true,
    connectedDevices: [
      {
        id: 'DEV-1',
        deviceName: 'iPhone 13',
        browser: 'Safari',
        os: 'iOS 16',
        lastLogin: new Date(),
        location: 'College Campus',
        isCurrentDevice: true
      },
      {
        id: 'DEV-2',
        deviceName: 'MacBook Air',
        browser: 'Chrome',
        os: 'macOS 13',
        lastLogin: new Date(Date.now() - 86400000 * 2),
        location: 'Home',
        isCurrentDevice: false
      }
    ]
  }
};
