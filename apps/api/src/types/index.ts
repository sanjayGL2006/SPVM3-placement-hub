export type Role =
  | 'SUPER_ADMIN'
  | 'PRINCIPAL'
  | 'HOD'
  | 'PLACEMENT_COORDINATOR'
  | 'FACULTY'
  | 'STUDENT'
  | 'COMPANY_HR'
  | 'principal'
  | 'hod'
  | 'coordinator'
  | 'faculty'
  | 'student'
  | 'hr';

export type PlacementStatus =
  | 'not_placed'
  | 'applied'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'joined';

export type DriveStatus =
  | 'draft'
  | 'upcoming'
  | 'registration_open'
  | 'registration_closed'
  | 'assessment'
  | 'interview'
  | 'completed'
  | 'cancelled';

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'assessment'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'waitlisted'
  | 'withdrawn';

export interface UserSession {
  id: number | string;
  name: string;
  email: string;
  role: Role;
  departmentId?: number | null;
  departmentName?: string | null;
  courseId?: number | null;
  avatarUrl?: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: string[] | Record<string, string[]>;
}

export interface StudentRecord {
  id: number;
  registerNumber: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  gender?: 'Male' | 'Female' | 'Other';
  departmentId?: number;
  departmentName?: string;
  courseId?: number;
  courseName?: string;
  section?: string;
  academicYear?: string;
  batch?: string;
  semester?: number;
  cgpa?: number;
  percentage?: number;
  backlogs: number;
  skills: string[];
  certifications?: string[];
  projects?: { title: string; tech: string; description: string }[];
  resumeUrl?: string;
  profilePhotoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  placementStatus: PlacementStatus;
  companyName?: string;
  packageAmount?: number;
  eligibleStatus: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRecord {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  location?: string;
  state?: string;
  description?: string;
  logoUrl?: string;
  hrName?: string;
  hrEmail?: string;
  hrContactNumber?: string;
  jobRole: string;
  packageAmount?: number;
  minPackage?: number;
  maxPackage?: number;
  avgPackage?: number;
  eligibleDepartments: string[];
  minCgpa: number;
  allowedBacklogs: number;
  requiredSkills: string[];
  hiringCount: number;
  tier: 'Super Dream' | 'Dream' | 'Core' | 'Mass';
  visitDate?: string;
  venue?: string;
  lastDate?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementDriveRecord {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  title: string;
  jobRole: string;
  jobDescription?: string;
  location?: string;
  packageAmount?: number;
  minCgpa: number;
  allowedBacklogs: number;
  eligibleDepartments: string[];
  requiredSkills: string[];
  driveDate: string;
  registrationDeadline?: string;
  testDate?: string;
  interviewDate?: string;
  vacancies: number;
  selectionProcess?: string;
  status: DriveStatus;
  applicantCount: number;
  selectedCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: number;
  driveId: number;
  driveTitle?: string;
  companyName?: string;
  studentId: number;
  studentName?: string;
  registerNumber?: string;
  departmentName?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  interviewRound?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventRecord {
  id: number;
  title: string;
  description?: string;
  eventType: 'DRIVE' | 'INTERVIEW' | 'TEST' | 'WORKSHOP' | 'DEADLINE';
  startDate: string;
  endDate?: string;
  location?: string;
  driveId?: number;
  departmentId?: number;
  companyName?: string;
}

export interface NotificationRecord {
  id: number;
  userId?: number;
  targetRole?: Role | 'ALL';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'drive' | 'interview';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: number;
  userId?: number;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface RecycleBinItem {
  id: number;
  entityType: 'STUDENT' | 'COMPANY' | 'DRIVE' | 'USER';
  entityId: number;
  entityName: string;
  payload: any;
  deletedBy: string;
  deletedAt: string;
}
