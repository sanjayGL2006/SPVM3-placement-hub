import { Course, Department } from './global.types';

export type CompanyTier = 'Super Dream (> 12 LPA)' | 'Dream (7 - 12 LPA)' | 'Core (4 - 7 LPA)' | 'Mass (< 4 LPA)';
export type DriveStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export type PipelineStage =
  | 'Interested'
  | 'Assigned'
  | 'Aptitude Test'
  | 'Technical Interview'
  | 'Group Discussion'
  | 'HR Round'
  | 'Selected'
  | 'IR'
  | 'Offer Letter Request'
  | 'Joined Company Request'
  | 'Rejected';

export type PipelineStatus =
  | 'Completed'
  | 'Passed Round'
  | 'Pending Review'
  | 'Processing'
  | 'Failed or Rejected';

export interface PipelineActivity {
  date: string;
  stage: PipelineStage;
  status: PipelineStatus;
  note?: string;
}

export interface CandidatePipelineItem {
  id: string; // e.g. "PIPE-001"
  driveId: string;
  companyId: string;
  studentId: string;
  registerNumber: string;
  candidateName: string;
  email: string;
  department: string;
  section: string;
  cgpa: number;
  packageLPA: number;
  hiringStage: PipelineStage;
  driveStatus: 'Ongoing' | 'Completed' | 'Upcoming' | 'Cancelled';
  offerLetterStatus: 'Pending' | 'Issued' | 'Accepted' | 'Rejected' | 'Joined';
  activityLog: PipelineActivity[];
  notes?: string;
  updatedAt: string;
}

export interface Company {
  id: string; // e.g. "CMP-001"
  name: string;
  logo: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  tier: CompanyTier;
  targetDepartments: Department[];
  eligibleCourses: Course[];
  minCgpa: number;
  maxBacklogsAllowed: number;
  packageRange: { min: number; max: number }; // LPA
  avgPackage?: number;
  totalInterestedCount?: number;
  hiringRoles: string[];
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  totalVisitedYears: number;
  totalHiredCount: number;
  createdAt: string;
}

export interface PlacementDrive {
  id: string; // e.g. "DRV-2026-01"
  companyId: string;
  companyName: string;
  companyLogo: string;
  role: string;
  packageLPA: number;
  driveDate: string;
  deadlineDate: string;
  venue: string; // e.g. "Auditorium & Virtual"
  status: DriveStatus;
  currentRound: string; // e.g. "Aptitude Test", "Technical Interview", "Final HR"
  rounds: {
    roundNumber: number;
    name: string;
    date: string;
    mode: 'Online' | 'Offline';
    totalShortlisted: number;
  }[];
  eligibleDepartments: Department[];
  eligibleCourses: Course[];
  minCgpa: number;
  totalRegistered: number;
  totalShortlisted: number;
  totalSelected: number;
  jobDescription: string;
  skillsRequired: string[];
}
