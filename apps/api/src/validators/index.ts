import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentCreateSchema = z.object({
  registerNumber: z.string().min(3, 'Register number is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional().or(z.literal('')),
  mobileNumber: z.string().optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  departmentId: z.number().int().positive().optional(),
  courseId: z.number().int().positive().optional(),
  section: z.string().optional(),
  academicYear: z.string().optional(),
  batch: z.string().optional(),
  semester: z.number().int().min(1).max(8).optional(),
  cgpa: z.number().min(0).max(10).optional(),
  percentage: z.number().min(0).max(100).optional(),
  backlogs: z.number().int().min(0).default(0),
  skills: z.union([z.string(), z.array(z.string())]).default([]),
  placementStatus: z.enum([
    'not_placed',
    'applied',
    'shortlisted',
    'interview',
    'selected',
    'offered',
    'accepted',
    'declined',
    'joined',
  ]).default('not_placed'),
});

export const studentUpdateSchema = studentCreateSchema.partial();

export const companyCreateSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  hrName: z.string().optional(),
  hrEmail: z.string().email().optional().or(z.literal('')),
  hrContactNumber: z.string().optional(),
  jobRole: z.string().min(2, 'Job role is required'),
  packageAmount: z.number().positive().optional(),
  minPackage: z.number().positive().optional(),
  maxPackage: z.number().positive().optional(),
  avgPackage: z.number().positive().optional(),
  eligibleDepartments: z.union([z.string(), z.array(z.string())]).default([]),
  minCgpa: z.number().min(0).max(10).default(6.0),
  allowedBacklogs: z.number().int().min(0).default(0),
  requiredSkills: z.union([z.string(), z.array(z.string())]).default([]),
  tier: z.enum(['Super Dream', 'Dream', 'Core', 'Mass']).default('Core'),
  hiringCount: z.number().int().min(0).default(0),
  visitDate: z.string().optional(),
  venue: z.string().optional(),
  lastDate: z.string().optional(),
});

export const companyUpdateSchema = companyCreateSchema.partial();

export const placementDriveCreateSchema = z.object({
  companyId: z.number().int().positive(),
  title: z.string().min(3, 'Drive title is required'),
  jobRole: z.string().min(2, 'Job role is required'),
  jobDescription: z.string().optional(),
  location: z.string().optional(),
  packageAmount: z.number().positive().optional(),
  minCgpa: z.number().min(0).max(10).default(6.0),
  allowedBacklogs: z.number().int().min(0).default(0),
  eligibleDepartments: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  driveDate: z.string().min(4, 'Drive date is required'),
  registrationDeadline: z.string().optional(),
  testDate: z.string().optional(),
  interviewDate: z.string().optional(),
  vacancies: z.number().int().min(0).default(0),
  selectionProcess: z.string().optional(),
  status: z.enum([
    'draft',
    'upcoming',
    'registration_open',
    'registration_closed',
    'assessment',
    'interview',
    'completed',
    'cancelled',
  ]).default('upcoming'),
});

export const placementDriveUpdateSchema = placementDriveCreateSchema.partial();

export const applicationCreateSchema = z.object({
  driveId: z.number().int().positive(),
  studentId: z.number().int().positive().optional(), // studentId deduced from auth user if student
  resumeUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const applicationStatusUpdateSchema = z.object({
  status: z.enum([
    'applied',
    'shortlisted',
    'assessment',
    'interview',
    'selected',
    'rejected',
    'waitlisted',
    'withdrawn',
  ]),
  interviewRound: z.number().int().min(1).optional(),
  notes: z.string().optional(),
});

export const calendarEventCreateSchema = z.object({
  title: z.string().min(3, 'Event title is required'),
  description: z.string().optional(),
  eventType: z.enum(['DRIVE', 'INTERVIEW', 'TEST', 'WORKSHOP', 'DEADLINE']),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  driveId: z.number().int().optional(),
  departmentId: z.number().int().optional(),
});
