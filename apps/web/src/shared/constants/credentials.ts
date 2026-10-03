import { UserRole, Department, Course } from '../types/global.types';

export interface PredefinedUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  department?: Department;
  course?: Course;
  section?: string;
  academicYear?: string;
  avatar: string;
  permissions: string[];
}

export const PREDEFINED_USERS: PredefinedUser[] = [
  // ─── PRINCIPAL (Super Admin) ───
  {
    id: 'usr_principal_001',
    email: 'principal@college.edu',
    password: 'Principal@2026',
    role: 'principal',
    name: 'Dr. Rajesh Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh-principal',
    permissions: ['*'], // All permissions
  },

  // ─── HODs ───
  {
    id: 'usr_hod_bca_001',
    email: 'hod.bca@college.edu',
    password: 'HodBca@2026',
    role: 'hod',
    name: 'Prof. Priya Patel',
    department: 'Computer Applications',
    course: 'BCA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-hod',
    permissions: [
      'dashboard:view',
      'students:view', 'students:create', 'students:edit', 'students:delete',
      'students:import', 'students:export',
      'companies:view', 'companies:create', 'companies:edit',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate', 'reports:export',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
      'users:view', 'users:create_coordinator', 'users:create_faculty',
      'settings:view', 'settings:edit',
    ],
  },
  {
    id: 'usr_hod_bba_001',
    email: 'hod.bba@college.edu',
    password: 'HodBba@2026',
    role: 'hod',
    name: 'Prof. Amit Kumar',
    department: 'Business Administration',
    course: 'BBA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit-hod',
    permissions: [
      'dashboard:view',
      'students:view', 'students:create', 'students:edit', 'students:delete',
      'students:import', 'students:export',
      'companies:view', 'companies:create', 'companies:edit',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate', 'reports:export',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
      'users:view', 'users:create_coordinator', 'users:create_faculty',
      'settings:view', 'settings:edit',
    ],
  },
  {
    id: 'usr_hod_bcom_001',
    email: 'hod.bcom@college.edu',
    password: 'HodBcom@2026',
    role: 'hod',
    name: 'Prof. Sunita Reddy',
    department: 'Commerce',
    course: 'B.Com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita-hod',
    permissions: [
      'dashboard:view',
      'students:view', 'students:create', 'students:edit', 'students:delete',
      'students:import', 'students:export',
      'companies:view', 'companies:create', 'companies:edit',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate', 'reports:export',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
      'users:view', 'users:create_coordinator', 'users:create_faculty',
      'settings:view', 'settings:edit',
    ],
  },
  {
    id: 'usr_hod_bsc_001',
    email: 'hod.bsc@college.edu',
    password: 'HodBsc@2026',
    role: 'hod',
    name: 'Prof. Vikram Singh',
    department: 'Science',
    course: 'B.Sc Computer Science',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram-hod',
    permissions: [
      'dashboard:view',
      'students:view', 'students:create', 'students:edit', 'students:delete',
      'students:import', 'students:export',
      'companies:view', 'companies:create', 'companies:edit',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate', 'reports:export',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
      'users:view', 'users:create_coordinator', 'users:create_faculty',
      'settings:view', 'settings:edit',
    ],
  },
  {
    id: 'usr_hod_hm_001',
    email: 'hod.hm@college.edu',
    password: 'HodHm@2026',
    role: 'hod',
    name: 'Prof. Ananya Gupta',
    department: 'Hotel Management',
    course: 'BBA Hotel Management',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya-hod',
    permissions: [
      'dashboard:view',
      'students:view', 'students:create', 'students:edit', 'students:delete',
      'students:import', 'students:export',
      'companies:view', 'companies:create', 'companies:edit',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate', 'reports:export',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
      'users:view', 'users:create_coordinator', 'users:create_faculty',
      'settings:view', 'settings:edit',
    ],
  },

  // ─── PLACEMENT COORDINATORS ───
  {
    id: 'usr_coord_bca_001',
    email: 'coord.bca@college.edu',
    password: 'CoordBca@2026',
    role: 'coordinator',
    name: 'Mr. Rahul Verma',
    department: 'Computer Applications',
    course: 'BCA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul-coord',
    permissions: [
      'dashboard:view',
      'students:view', 'students:edit',
      'companies:view', 'companies:create',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
    ],
  },
  {
    id: 'usr_coord_bba_001',
    email: 'coord.bba@college.edu',
    password: 'CoordBba@2026',
    role: 'coordinator',
    name: 'Ms. Neha Sharma',
    department: 'Business Administration',
    course: 'BBA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha-coord',
    permissions: [
      'dashboard:view',
      'students:view', 'students:edit',
      'companies:view', 'companies:create',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
    ],
  },
  {
    id: 'usr_coord_bcom_001',
    email: 'coord.bcom@college.edu',
    password: 'CoordBcom@2026',
    role: 'coordinator',
    name: 'Mr. Arjun Nair',
    department: 'Commerce',
    course: 'B.Com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun-coord',
    permissions: [
      'dashboard:view',
      'students:view', 'students:edit',
      'companies:view', 'companies:create',
      'placements:view', 'placements:manage',
      'reports:view', 'reports:generate',
      'ai:chatbot', 'ai:resume_analyze', 'ai:skills_gap',
    ],
  },

  // ─── FACULTY / VIEW-ONLY ───
  {
    id: 'usr_faculty_001',
    email: 'faculty@college.edu',
    password: 'Faculty@2026',
    role: 'faculty',
    name: 'Dr. Meera Iyer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera-faculty',
    permissions: [
      'dashboard:view',
      'students:view',
      'companies:view',
      'placements:view',
      'reports:view',
    ],
  },

  // ─── SAMPLE STUDENTS ───
  {
    id: 'usr_student_bca_001',
    email: 'student.bca@college.edu',
    password: 'Student@2026',
    role: 'student',
    name: 'Rahul Kumar',
    department: 'Computer Applications',
    course: 'BCA',
    section: 'A',
    academicYear: '2025-26',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul-student-bca',
    permissions: [
      'student:dashboard',
      'student:profile',
      'student:resume',
      'student:applications',
      'student:mock_test',
      'student:mock_interview',
      'student:skills_gap',
      'settings:view',
    ],
  },
  {
    id: 'usr_student_bba_001',
    email: 'student.bba@college.edu',
    password: 'Student@2026',
    role: 'student',
    name: 'Priya Singh',
    department: 'Business Administration',
    course: 'BBA',
    section: 'B',
    academicYear: '2025-26',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-student-bba',
    permissions: [
      'student:dashboard',
      'student:profile',
      'student:resume',
      'student:applications',
      'student:mock_test',
      'student:mock_interview',
      'student:skills_gap',
      'settings:view',
    ],
  },
];
