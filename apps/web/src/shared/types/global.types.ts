export type UserRole = 'principal' | 'hod' | 'coordinator' | 'faculty' | 'student';

export type Department = 
  | 'Computer Applications'
  | 'Business Administration'
  | 'Commerce'
  | 'Science'
  | 'Hotel Management';

export type Course = 
  | 'BCA'
  | 'BBA'
  | 'B.Com'
  | 'B.Sc Computer Science'
  | 'BBA Hotel Management';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: Department;
  course?: Course;
  section?: string;
  academicYear?: string;
  avatar: string;
  permissions: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'drive' | 'ai';
  timestamp: string;
  read: boolean;
  link?: string;
}
