import { Department, Course } from './global.types';

export type PlacementStatus = 'Placed' | 'In Process' | 'Eligible' | 'Opted Out' | 'Not Eligible';

export interface AcademicRecord {
  tenthPercentage: number;
  twelfthPercentage: number;
  cgpa: number;
  activeBacklogs: number;
  clearedBacklogs: number;
  semesterScores: { semester: number; sgpa: number }[];
}

export interface StudentPlacementInfo {
  status: PlacementStatus;
  companyId?: string;
  companyName?: string;
  roleOffered?: string;
  packageLPA?: number; // in Lakhs Per Annum, e.g. 8.5
  offerDate?: string;
  appliedCount: number;
  interviewsCount: number;
  offersCount: number;
}

export interface Student {
  id: string; // e.g. "STU-2026-001"
  registerNumber: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  department: Department;
  course: Course;
  section: 'A' | 'B' | 'C';
  batch: string; // e.g. "2022-2026"
  academicYear: string; // e.g. "2025-26"
  academic: AcademicRecord;
  placement: StudentPlacementInfo;
  skills: string[];
  resumeUrl?: string;
  resumeScore?: number;
  atsScore?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
  certifications: string[];
  projects: { title: string; tech: string; description: string }[];
  timeline: { date: string; title: string; description: string; type: 'academic' | 'placement' | 'achievement' }[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilterParams {
  search?: string;
  department?: string;
  course?: string;
  section?: string;
  academicYear?: string;
  placementStatus?: string;
  minCgpa?: number;
  maxCgpa?: number;
  hasBacklogs?: boolean;
}
