import { Student, PlacementStatus } from '../types/student.types';
import { Company, PlacementDrive } from '../types/company.types';
import { PlacementApplication, InterviewSchedule, PlacementReportMetrics } from '../types/placement.types';
import { Department, Course, AuditLog, NotificationItem } from '../types/global.types';

// Indian First & Last Names for realistic academic records
const FIRST_NAMES_MALE = [
  'Aarav', 'Aditya', 'Arjun', 'Ayush', 'Dhruv', 'Harsh', 'Ishaan', 'Kabir', 'Manish', 'Nikhil', 
  'Pranav', 'Rahul', 'Rohan', 'Sai', 'Siddharth', 'Varun', 'Vikas', 'Yash', 'Rishi', 'Karan',
  'Gautam', 'Sanjay', 'Deepak', 'Aniket', 'Tarun', 'Shubham', 'Abhishek', 'Surya', 'Kartik', 'Vivek'
];

const FIRST_NAMES_FEMALE = [
  'Aanya', 'Aditi', 'Ananya', 'Diya', 'Ishita', 'Kavya', 'Meera', 'Neha', 'Pooja', 'Priya', 
  'Riya', 'Saanvi', 'Shreya', 'Sneha', 'Tanvi', 'Vaidehi', 'Zara', 'Nandini', 'Divya', 'Rashmi',
  'Swati', 'Kritika', 'Bhavna', 'Simran', 'Akanksha', 'Lavanya', 'Anjali', 'Pavithra', 'Sonal', 'Deepa'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Joshi',
  'Rao', 'Deshmukh', 'Chopra', 'Malhotra', 'Bhat', 'Kulkarni', 'Mehta', 'Pandey', 'Saxena', 'Choudhury',
  'Chatterjee', 'Banerjee', 'Mishra', 'Agarwal', 'Shah', 'Ghosh', 'Pillai', 'Hegde', 'Menon', 'Venkatesh'
];

const DEPARTMENTS_DATA: { dept: Department; course: Course; sections: ('A' | 'B' | 'C')[] }[] = [
  { dept: 'Computer Applications', course: 'BCA', sections: ['A', 'B', 'C'] },
  { dept: 'Business Administration', course: 'BBA', sections: ['A', 'B'] },
  { dept: 'Commerce', course: 'B.Com', sections: ['A', 'B', 'C'] },
  { dept: 'Science', course: 'B.Sc Computer Science', sections: ['A', 'B'] },
  { dept: 'Hotel Management', course: 'BBA Hotel Management', sections: ['A'] },
];

const TECH_SKILLS = [
  'React.js', 'Node.js', 'TypeScript', 'Python', 'Java', 'SQL', 'MongoDB', 'Tailwind CSS',
  'Next.js', 'AWS', 'Docker', 'C++', 'Git', 'Data Structures', 'REST APIs', 'Spring Boot'
];

const BUSINESS_SKILLS = [
  'Financial Modeling', 'Market Research', 'Excel & PowerBI', 'Digital Marketing', 'Business Analytics',
  'Sales Strategy', 'CRM (Salesforce)', 'Brand Management', 'Operations', 'Negotiation'
];

const COMMERCE_SKILLS = [
  'Financial Accounting', 'Corporate Taxation', 'Tally ERP & Prime', 'GST Auditing', 'Financial Analysis',
  'Investment Banking', 'Cost Accounting', 'Equity Research', 'Forensic Accounting'
];

const HM_SKILLS = [
  'Front Office Operations', 'Food & Beverage Management', 'Guest Relations', 'Event Planning',
  'Hospitality Marketing', 'Revenue Management', 'Culinary Operations', 'Opera PMS'
];

import { COMPANY_LOGOS } from './companyLogos';

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'CMP-001',
    name: 'Google',
    logo: COMPANY_LOGOS.Google,
    industry: 'Technology / Cloud / AI',
    website: 'https://careers.google.com',
    location: 'Bangalore / Hyderabad',
    description: 'Global tech leader in search, cloud computing, software and quantum hardware.',
    tier: 'Super Dream (> 12 LPA)',
    targetDepartments: ['Computer Applications', 'Science'],
    eligibleCourses: ['BCA', 'B.Sc Computer Science'],
    minCgpa: 8.5,
    maxBacklogsAllowed: 0,
    packageRange: { min: 18.0, max: 24.0 },
    hiringRoles: ['Associate Software Engineer', 'Cloud Solutions Trainee'],
    contactPerson: { name: 'Kavita Menon', designation: 'University Relations Lead', email: 'kavita@google.com', phone: '+91 98765 43210' },
    totalVisitedYears: 6,
    totalHiredCount: 38,
    createdAt: '2024-01-10',
  },
  {
    id: 'CMP-002',
    name: 'Microsoft',
    logo: COMPANY_LOGOS.Microsoft,
    industry: 'Software & Enterprise Cloud',
    website: 'https://careers.microsoft.com',
    location: 'Hyderabad / Noida',
    description: 'Pioneering intelligent cloud and AI innovations worldwide.',
    tier: 'Super Dream (> 12 LPA)',
    targetDepartments: ['Computer Applications', 'Science'],
    eligibleCourses: ['BCA', 'B.Sc Computer Science'],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    packageRange: { min: 16.0, max: 22.0 },
    hiringRoles: ['Support Engineer', 'Software Engineer I'],
    contactPerson: { name: 'Rohan Deshmukh', designation: 'Campus Talent Partner', email: 'rohan.d@microsoft.com', phone: '+91 98765 43211' },
    totalVisitedYears: 8,
    totalHiredCount: 45,
    createdAt: '2024-01-12',
  },
  {
    id: 'CMP-003',
    name: 'Amazon',
    logo: COMPANY_LOGOS.Amazon,
    industry: 'E-Commerce & AWS Cloud',
    website: 'https://amazon.jobs',
    location: 'Bangalore / Chennai',
    description: 'Earth’s most customer-centric enterprise and cloud leader.',
    tier: 'Super Dream (> 12 LPA)',
    targetDepartments: ['Computer Applications', 'Business Administration', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Sc Computer Science'],
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    packageRange: { min: 14.0, max: 20.0 },
    hiringRoles: ['Cloud Support Associate', 'Operations Manager Trainee'],
    contactPerson: { name: 'Sunil Rao', designation: 'University Lead', email: 'sunilr@amazon.com', phone: '+91 98765 43212' },
    totalVisitedYears: 7,
    totalHiredCount: 52,
    createdAt: '2024-01-15',
  },
  {
    id: 'CMP-004',
    name: 'Deloitte',
    logo: COMPANY_LOGOS.Deloitte,
    industry: 'Consulting & Financial Advisory',
    website: 'https://deloitte.com/careers',
    location: 'Bangalore / Mumbai / Hyderabad',
    description: 'Leading provider of audit, consulting, tax, and advisory services.',
    tier: 'Dream (7 - 12 LPA)',
    targetDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    packageRange: { min: 7.5, max: 11.0 },
    hiringRoles: ['Technology Analyst', 'Associate Analyst - Tax & Audit', 'Business Technology Analyst'],
    contactPerson: { name: 'Alka Saxena', designation: 'Campus Recruitment Lead', email: 'asaxena@deloitte.com', phone: '+91 98765 43213' },
    totalVisitedYears: 10,
    totalHiredCount: 120,
    createdAt: '2024-01-20',
  },
  {
    id: 'CMP-005',
    name: 'Goldman Sachs',
    logo: COMPANY_LOGOS.GoldmanSachs,
    industry: 'Investment Banking & FinTech',
    website: 'https://goldmansachs.com/careers',
    location: 'Bangalore',
    description: 'Leading global financial institution providing services across investment banking and securities.',
    tier: 'Super Dream (> 12 LPA)',
    targetDepartments: ['Computer Applications', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    packageRange: { min: 15.0, max: 21.0 },
    hiringRoles: ['Operations Analyst', 'Software Analyst'],
    contactPerson: { name: 'Manish Hegde', designation: 'VP Campus Hiring', email: 'm.hegde@gs.com', phone: '+91 98765 43214' },
    totalVisitedYears: 5,
    totalHiredCount: 28,
    createdAt: '2024-02-01',
  },
  {
    id: 'CMP-006',
    name: 'Tata Consultancy Services (TCS)',
    logo: COMPANY_LOGOS.TCS,
    industry: 'IT Services & Digital Solutions',
    website: 'https://tcs.com/careers',
    location: 'Pan India',
    description: 'Global leader in IT services, consulting, and business solutions.',
    tier: 'Core (4 - 7 LPA)',
    targetDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 6.0,
    maxBacklogsAllowed: 1,
    packageRange: { min: 3.8, max: 7.2 },
    hiringRoles: ['TCS Ninja', 'TCS Digital', 'Business Process Associate'],
    contactPerson: { name: 'Deepak Varma', designation: 'RM Campus Team', email: 'deepak.v@tcs.com', phone: '+91 98765 43215' },
    totalVisitedYears: 15,
    totalHiredCount: 310,
    createdAt: '2024-01-05',
  },
  {
    id: 'CMP-007',
    name: 'Infosys',
    logo: COMPANY_LOGOS.Infosys,
    industry: 'Next-Gen IT & Consulting',
    website: 'https://infosys.com/careers',
    location: 'Bangalore / Mysore / Pune',
    description: 'Global leader in digital services and consulting.',
    tier: 'Core (4 - 7 LPA)',
    targetDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 6.0,
    maxBacklogsAllowed: 1,
    packageRange: { min: 3.6, max: 6.8 },
    hiringRoles: ['Systems Associate', 'Operations Executive'],
    contactPerson: { name: 'Swati Pillai', designation: 'Senior HR Campus', email: 'swati_p@infosys.com', phone: '+91 98765 43216' },
    totalVisitedYears: 14,
    totalHiredCount: 280,
    createdAt: '2024-01-08',
  },
  {
    id: 'CMP-008',
    name: 'HDFC Bank',
    logo: COMPANY_LOGOS.HDFC,
    industry: 'Banking & Financial Services',
    website: 'https://hdfcbank.com/careers',
    location: 'Pan India',
    description: 'India’s leading private sector bank offering personal and business banking.',
    tier: 'Core (4 - 7 LPA)',
    targetDepartments: ['Business Administration', 'Commerce'],
    eligibleCourses: ['BBA', 'B.Com'],
    minCgpa: 6.2,
    maxBacklogsAllowed: 0,
    packageRange: { min: 4.5, max: 6.5 },
    hiringRoles: ['Management Trainee', 'Relationship Executive - Premier Banking'],
    contactPerson: { name: 'Vikas Chopra', designation: 'Zonal Talent Acquisition', email: 'vchopra@hdfcbank.com', phone: '+91 98765 43217' },
    totalVisitedYears: 9,
    totalHiredCount: 85,
    createdAt: '2024-02-10',
  },
  {
    id: 'CMP-009',
    name: 'Marriott International',
    logo: COMPANY_LOGOS.Marriott,
    industry: 'Luxury Hospitality & Tourism',
    website: 'https://marriott.com/careers',
    location: 'Goa / Mumbai / Delhi / Bangalore',
    description: 'World’s premier hotel chain known for timeless hospitality.',
    tier: 'Dream (7 - 12 LPA)',
    targetDepartments: ['Hotel Management', 'Business Administration'],
    eligibleCourses: ['BBA Hotel Management', 'BBA'],
    minCgpa: 6.5,
    maxBacklogsAllowed: 0,
    packageRange: { min: 5.5, max: 8.5 },
    hiringRoles: ['Voyager Leadership Trainee', 'Guest Experience Executive'],
    contactPerson: { name: 'Chef Jean-Luc & Natasha', designation: 'Director Talent & Culture', email: 'natasha.m@marriott.com', phone: '+91 98765 43218' },
    totalVisitedYears: 8,
    totalHiredCount: 64,
    createdAt: '2024-02-15',
  },
  {
    id: 'CMP-010',
    name: 'Taj Hotels (IHCL)',
    logo: COMPANY_LOGOS.TajHotels,
    industry: 'Hospitality & Luxury Resorts',
    website: 'https://ihcltata.com/careers',
    location: 'Mumbai / Jaipur / Udaipur / Bangalore',
    description: 'Iconic hospitality brand setting international luxury benchmarks.',
    tier: 'Dream (7 - 12 LPA)',
    targetDepartments: ['Hotel Management'],
    eligibleCourses: ['BBA Hotel Management'],
    minCgpa: 6.8,
    maxBacklogsAllowed: 0,
    packageRange: { min: 6.0, max: 9.0 },
    hiringRoles: ['Hotel Operations Management Trainee (HOMT)'],
    contactPerson: { name: 'Siddharth Roy', designation: 'HR Head - Campus', email: 'sroy@ihcltata.com', phone: '+91 98765 43219' },
    totalVisitedYears: 12,
    totalHiredCount: 92,
    createdAt: '2024-02-18',
  },
  {
    id: 'CMP-011',
    name: 'Accenture',
    logo: COMPANY_LOGOS.Accenture,
    industry: 'IT Consulting & Strategy',
    website: 'https://accenture.com/careers',
    location: 'Bangalore / Pune / Gurgaon',
    description: 'Leading global professional services company specializing in digital and cloud capabilities.',
    tier: 'Dream (7 - 12 LPA)',
    targetDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 6.5,
    maxBacklogsAllowed: 0,
    packageRange: { min: 4.8, max: 8.5 },
    hiringRoles: ['Associate Software Engineer', 'Advanced Application Engineering Analyst'],
    contactPerson: { name: 'Tarun Saxena', designation: 'Campus Lead', email: 'tarun.saxena@accenture.com', phone: '+91 98765 43220' },
    totalVisitedYears: 11,
    totalHiredCount: 215,
    createdAt: '2024-01-25',
  },
  {
    id: 'CMP-012',
    name: 'KPMG',
    logo: COMPANY_LOGOS.KPMG,
    industry: 'Financial Advisory & Audit',
    website: 'https://kpmg.com/careers',
    location: 'Bangalore / Mumbai',
    description: 'Global network of professional firms providing Audit, Tax and Advisory services.',
    tier: 'Dream (7 - 12 LPA)',
    targetDepartments: ['Commerce', 'Business Administration'],
    eligibleCourses: ['B.Com', 'BBA'],
    minCgpa: 7.2,
    maxBacklogsAllowed: 0,
    packageRange: { min: 6.5, max: 9.5 },
    hiringRoles: ['Executive - Global Assurance', 'Business Associate'],
    contactPerson: { name: 'Anjali Sharma', designation: 'Talent Acquisition Partner', email: 'anjalisharma@kpmg.com', phone: '+91 98765 43221' },
    totalVisitedYears: 7,
    totalHiredCount: 58,
    createdAt: '2024-02-05',
  }
];

export const MOCK_DRIVES: PlacementDrive[] = [
  {
    id: 'DRV-2026-01',
    companyId: 'CMP-001',
    companyName: 'Google',
    companyLogo: COMPANY_LOGOS.Google,
    role: 'Associate Software Engineer',
    packageLPA: 22.0,
    driveDate: '2026-03-25',
    deadlineDate: '2026-03-20',
    venue: 'Campus Tech Auditorium & Google Meet',
    status: 'Upcoming',
    currentRound: 'Online Coding Challenge',
    rounds: [
      { roundNumber: 1, name: 'Online Coding Round', date: '2026-03-25', mode: 'Online', totalShortlisted: 45 },
      { roundNumber: 2, name: 'Technical Interview 1', date: '2026-03-27', mode: 'Online', totalShortlisted: 18 },
      { roundNumber: 3, name: 'Technical Interview 2 & Fitment', date: '2026-03-28', mode: 'Online', totalShortlisted: 6 },
    ],
    eligibleDepartments: ['Computer Applications', 'Science'],
    eligibleCourses: ['BCA', 'B.Sc Computer Science'],
    minCgpa: 8.5,
    totalRegistered: 68,
    totalShortlisted: 45,
    totalSelected: 0,
    jobDescription: 'Build next-generation distributed scalable systems. Strong DSA, algorithms, and system design fundamentals required.',
    skillsRequired: ['Data Structures', 'C++', 'Java', 'Python', 'Algorithms'],
  },
  {
    id: 'DRV-2026-02',
    companyId: 'CMP-004',
    companyName: 'Deloitte',
    companyLogo: COMPANY_LOGOS.Deloitte,
    role: 'Technology & Risk Analyst',
    packageLPA: 8.5,
    driveDate: '2026-03-15',
    deadlineDate: '2026-03-10',
    venue: 'Placement Cell Auditorium',
    status: 'Ongoing',
    currentRound: 'Technical Interview',
    rounds: [
      { roundNumber: 1, name: 'Online Aptitude & Versant Test', date: '2026-03-15', mode: 'Online', totalShortlisted: 85 },
      { roundNumber: 2, name: 'Technical Interview', date: '2026-03-18', mode: 'Offline', totalShortlisted: 32 },
      { roundNumber: 3, name: 'Partner HR Interview', date: '2026-03-20', mode: 'Offline', totalShortlisted: 15 },
    ],
    eligibleDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 7.0,
    totalRegistered: 140,
    totalShortlisted: 32,
    totalSelected: 0,
    jobDescription: 'Consulting and technology advisory role for enterprise clients across cloud and digital transformations.',
    skillsRequired: ['SQL', 'Excel', 'Problem Solving', 'React.js', 'Communication'],
  },
  {
    id: 'DRV-2026-03',
    companyId: 'CMP-006',
    companyName: 'Tata Consultancy Services (TCS)',
    companyLogo: COMPANY_LOGOS.TCS,
    role: 'TCS Digital / Ninja Trainee',
    packageLPA: 7.2,
    driveDate: '2026-02-10',
    deadlineDate: '2026-02-05',
    venue: 'Lab 1 & Lab 2',
    status: 'Completed',
    currentRound: 'Final Offers Distributed',
    rounds: [
      { roundNumber: 1, name: 'National Qualifier Test (NQT)', date: '2026-02-10', mode: 'Online', totalShortlisted: 120 },
      { roundNumber: 2, name: 'Technical & MR Interview', date: '2026-02-14', mode: 'Offline', totalShortlisted: 65 },
      { roundNumber: 3, name: 'HR Interview', date: '2026-02-16', mode: 'Offline', totalShortlisted: 48 },
    ],
    eligibleDepartments: ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
    eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
    minCgpa: 6.0,
    totalRegistered: 190,
    totalShortlisted: 65,
    totalSelected: 48,
    jobDescription: 'Full-stack software engineering and enterprise digitalization across multiple domains.',
    skillsRequired: ['Java', 'SQL', 'Python', 'Web Fundamentals'],
  },
  {
    id: 'DRV-2026-04',
    companyId: 'CMP-009',
    companyName: 'Marriott International',
    companyLogo: COMPANY_LOGOS.Marriott,
    role: 'Voyager Management Trainee',
    packageLPA: 7.5,
    driveDate: '2026-03-22',
    deadlineDate: '2026-03-18',
    venue: 'Hospitality Suite Conference Hall',
    status: 'Upcoming',
    currentRound: 'Group Discussion',
    rounds: [
      { roundNumber: 1, name: 'Personality & English Proficiency Test', date: '2026-03-22', mode: 'Online', totalShortlisted: 28 },
      { roundNumber: 2, name: 'Group Discussion', date: '2026-03-23', mode: 'Offline', totalShortlisted: 14 },
      { roundNumber: 3, name: 'General Manager Interview', date: '2026-03-24', mode: 'Offline', totalShortlisted: 6 },
    ],
    eligibleDepartments: ['Hotel Management'],
    eligibleCourses: ['BBA Hotel Management'],
    minCgpa: 6.5,
    totalRegistered: 34,
    totalShortlisted: 28,
    totalSelected: 0,
    jobDescription: 'Fast-track leadership development program for luxury hotel operations, F&B, and guest management.',
    skillsRequired: ['Guest Relations', 'Opera PMS', 'F&B Management', 'Leadership'],
  },
  {
    id: 'DRV-2026-05',
    companyId: 'CMP-008',
    companyName: 'Wipro Technologies',
    companyLogo: COMPANY_LOGOS.Wipro,
    role: 'Project Engineer (Elite NTH)',
    packageLPA: 6.5,
    driveDate: '2026-09-22',
    deadlineDate: '2026-09-18',
    venue: 'Campus Tech Auditorium & Online Assessment Portal',
    status: 'Upcoming',
    currentRound: 'National Talent Hunt Assessment',
    rounds: [
      { roundNumber: 1, name: 'Aptitude & Coding Assessment', date: '2026-09-22', mode: 'Online', totalShortlisted: 95 },
      { roundNumber: 2, name: 'Technical Interview', date: '2026-09-25', mode: 'Online', totalShortlisted: 42 },
      { roundNumber: 3, name: 'HR & Fitment Discussion', date: '2026-09-28', mode: 'Offline', totalShortlisted: 20 },
    ],
    eligibleDepartments: ['Computer Applications', 'Science', 'Commerce'],
    eligibleCourses: ['BCA', 'B.Sc Computer Science', 'B.Com'],
    minCgpa: 6.5,
    totalRegistered: 120,
    totalShortlisted: 95,
    totalSelected: 0,
    jobDescription: 'Flagship national recruitment program for fresh graduates. Comprehensive technical onboarding and global project deployment.',
    skillsRequired: ['Java', 'C++', 'Python', 'SQL', 'Data Structures', 'Communication'],
  }
];

// Seed 220 realistic students across 5 departments
export const generateRealisticStudents = (): Student[] => {
  const students: Student[] = [];
  let idCounter = 1;

  // Let's seed pre-defined student records first for exact match with demo logins
  students.push({
    id: 'STU-2026-001',
    registerNumber: '22BCA101',
    name: 'Rahul Kumar',
    email: 'student.bca@college.edu',
    phone: '+91 98450 12345',
    gender: 'Male',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul-student-bca',
    department: 'Computer Applications',
    course: 'BCA',
    section: 'A',
    batch: '2022-2026',
    academicYear: '2025-26',
    academic: {
      tenthPercentage: 88.5,
      twelfthPercentage: 86.0,
      cgpa: 8.8,
      activeBacklogs: 0,
      clearedBacklogs: 0,
      semesterScores: [
        { semester: 1, sgpa: 8.4 }, { semester: 2, sgpa: 8.6 },
        { semester: 3, sgpa: 8.9 }, { semester: 4, sgpa: 8.7 },
        { semester: 5, sgpa: 9.1 }, { semester: 6, sgpa: 8.8 }
      ]
    },
    placement: {
      status: 'Placed',
      companyId: 'CMP-004',
      companyName: 'Deloitte',
      roleOffered: 'Technology Analyst',
      packageLPA: 8.5,
      offerDate: '2026-02-15',
      appliedCount: 6,
      interviewsCount: 3,
      offersCount: 2,
    },
    skills: ['React.js', 'TypeScript', 'Node.js', 'SQL', 'Tailwind CSS', 'Docker'],
    resumeUrl: '/resumes/rahul_kumar_resume.pdf',
    resumeScore: 92,
    atsScore: 89,
    linkedinUrl: 'https://linkedin.com/in/rahulkumar-dev',
    githubUrl: 'https://github.com/rahulkumar-dev',
    bio: 'Aspiring Full Stack Engineer passionate about high performance React ecosystems and cloud architectures.',
    certifications: ['AWS Certified Cloud Practitioner', 'Meta Frontend Developer Professional'],
    projects: [
      { title: 'Placement Pro SaaS Platform', tech: 'React 19, TypeScript, Tailwind', description: 'Enterprise placement management system with AI integration.' },
      { title: 'PeerCode Collaboration IDE', tech: 'Node.js, WebSockets, Redis', description: 'Real-time collaborative code editor with video conferencing.' }
    ],
    timeline: [
      { date: '2026-02-15', title: 'Offer Letter Received', description: 'Received official offer letter from Deloitte for ₹8.5 LPA', type: 'placement' },
      { date: '2026-02-02', title: 'Deloitte Technical Interview', description: 'Cleared Technical & HR interviews with top marks', type: 'placement' },
      { date: '2025-11-20', title: 'Won Smart India Hackathon', description: 'First runner up in Smart India Hackathon 2025', type: 'achievement' }
    ],
    createdAt: '2025-08-01',
    updatedAt: '2026-02-15'
  });

  students.push({
    id: 'STU-2026-002',
    registerNumber: '22BBA201',
    name: 'Priya Singh',
    email: 'student.bba@college.edu',
    phone: '+91 98450 12346',
    gender: 'Female',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-student-bba',
    department: 'Business Administration',
    course: 'BBA',
    section: 'B',
    batch: '2022-2026',
    academicYear: '2025-26',
    academic: {
      tenthPercentage: 92.0,
      twelfthPercentage: 89.5,
      cgpa: 9.1,
      activeBacklogs: 0,
      clearedBacklogs: 0,
      semesterScores: [
        { semester: 1, sgpa: 8.9 }, { semester: 2, sgpa: 9.0 },
        { semester: 3, sgpa: 9.2 }, { semester: 4, sgpa: 9.1 },
        { semester: 5, sgpa: 9.3 }, { semester: 6, sgpa: 9.2 }
      ]
    },
    placement: {
      status: 'In Process',
      companyId: 'CMP-008',
      companyName: 'HDFC Bank',
      roleOffered: 'Management Trainee',
      packageLPA: 6.5,
      offerDate: undefined,
      appliedCount: 5,
      interviewsCount: 2,
      offersCount: 0,
    },
    skills: ['Financial Modeling', 'Market Research', 'Excel & PowerBI', 'Sales Strategy', 'Digital Marketing'],
    resumeUrl: '/resumes/priya_singh_resume.pdf',
    resumeScore: 88,
    atsScore: 85,
    linkedinUrl: 'https://linkedin.com/in/priyasingh-mgmt',
    githubUrl: undefined,
    bio: 'BBA honors student specializing in corporate strategy and financial consulting.',
    certifications: ['KPMG Lean Six Sigma Green Belt', 'Google Digital Marketing Professional'],
    projects: [
      { title: 'Brand Equity Analysis for FMCG', tech: 'SPSS, PowerBI', description: 'Comprehensive empirical market study across 500+ consumers.' }
    ],
    timeline: [
      { date: '2026-02-28', title: 'HDFC Bank Shortlisted', description: 'Shortlisted for Round 2 Personal Interview', type: 'placement' }
    ],
    createdAt: '2025-08-01',
    updatedAt: '2026-02-28'
  });

  idCounter = 3;

  // Generate 218 more students evenly distributed
  const targetTotal = 220;
  while (students.length < targetTotal) {
    const deptConfig = DEPARTMENTS_DATA[students.length % DEPARTMENTS_DATA.length];
    const isMale = Math.random() > 0.45;
    const firstName = isMale 
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const regPrefix = deptConfig.course.substring(0, 3).toUpperCase();
    const regNo = `22${regPrefix}${String(idCounter).padStart(3, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idCounter}@college.edu`;

    // Realistic CGPA bell curve between 5.5 and 9.7 (mean around 7.8)
    const baseCgpa = 5.5 + Math.random() * 2.5 + Math.random() * 1.8;
    const cgpa = Math.min(9.8, Math.max(5.2, Number(baseCgpa.toFixed(2))));
    const tenth = Number((70 + Math.random() * 28).toFixed(1));
    const twelfth = Number((68 + Math.random() * 29).toFixed(1));
    const hasBacklogs = Math.random() < 0.12; // 12% backlogs
    const activeBacklogs = hasBacklogs ? Math.floor(Math.random() * 2) + 1 : 0;

    // Skills based on department
    let studentSkills: string[] = [];
    if (deptConfig.dept === 'Computer Applications' || deptConfig.dept === 'Science') {
      studentSkills = [...TECH_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(Math.random() * 3));
    } else if (deptConfig.dept === 'Business Administration') {
      studentSkills = [...BUSINESS_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3));
    } else if (deptConfig.dept === 'Commerce') {
      studentSkills = [...COMMERCE_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3));
    } else {
      studentSkills = [...HM_SKILLS].sort(() => 0.5 - Math.random()).slice(0, 4 + Math.floor(Math.random() * 3));
    }

    // Determine Placement Status
    let status: PlacementStatus = 'Eligible';
    let company: Company | undefined;
    let pkg: number | undefined;
    let offerDate: string | undefined;

    if (activeBacklogs > 0 || cgpa < 6.0) {
      status = 'Not Eligible';
    } else {
      const rand = Math.random();
      if (rand < 0.62) { // 62% placed
        status = 'Placed';
        // Pick compatible company
        const compatibleCompanies = MOCK_COMPANIES.filter(c => 
          c.eligibleCourses.includes(deptConfig.course) && cgpa >= c.minCgpa
        );
        company = compatibleCompanies.length > 0 
          ? compatibleCompanies[Math.floor(Math.random() * compatibleCompanies.length)]
          : MOCK_COMPANIES[5]; // fallback TCS
        
        const minP = company.packageRange.min;
        const maxP = company.packageRange.max;
        pkg = Number((minP + Math.random() * (maxP - minP)).toFixed(1));
        offerDate = `2026-0${Math.floor(Math.random() * 2) + 1}-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`;
      } else if (rand < 0.82) {
        status = 'In Process';
      } else if (rand < 0.95) {
        status = 'Eligible';
      } else {
        status = 'Opted Out';
      }
    }

    const appliedCount = status === 'Not Eligible' ? 0 : Math.floor(Math.random() * 6) + 1;
    const interviewsCount = status === 'Placed' ? Math.floor(Math.random() * 3) + 2 : (status === 'In Process' ? 1 : 0);
    const offersCount = status === 'Placed' ? (Math.random() > 0.3 ? 1 : 2) : 0;

    students.push({
      id: `STU-2026-${String(idCounter).padStart(3, '0')}`,
      registerNumber: regNo,
      name,
      email,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      gender: isMale ? 'Male' : 'Female',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName.toLowerCase()}-${idCounter}`,
      department: deptConfig.dept,
      course: deptConfig.course,
      section: deptConfig.sections[Math.floor(Math.random() * deptConfig.sections.length)],
      batch: '2022-2026',
      academicYear: '2025-26',
      academic: {
        tenthPercentage: tenth,
        twelfthPercentage: twelfth,
        cgpa,
        activeBacklogs,
        clearedBacklogs: hasBacklogs ? 1 : 0,
        semesterScores: [
          { semester: 1, sgpa: Number((cgpa - 0.3 + Math.random() * 0.6).toFixed(2)) },
          { semester: 2, sgpa: Number((cgpa - 0.2 + Math.random() * 0.5).toFixed(2)) },
          { semester: 3, sgpa: Number((cgpa - 0.1 + Math.random() * 0.4).toFixed(2)) },
          { semester: 4, sgpa: Number(cgpa.toFixed(2)) },
          { semester: 5, sgpa: Number((cgpa + 0.1).toFixed(2)) },
          { semester: 6, sgpa: Number(cgpa.toFixed(2)) },
        ]
      },
      placement: {
        status,
        companyId: company?.id,
        companyName: company?.name,
        roleOffered: company?.hiringRoles[0] || (status === 'Placed' ? 'Graduate Trainee' : undefined),
        packageLPA: pkg,
        offerDate,
        appliedCount,
        interviewsCount,
        offersCount,
      },
      skills: studentSkills,
      resumeUrl: `/resumes/student_${idCounter}.pdf`,
      resumeScore: Math.floor(65 + Math.random() * 32),
      atsScore: Math.floor(60 + Math.random() * 35),
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      bio: `Enthusiastic ${deptConfig.course} student aiming for growth opportunities in competitive industry settings.`,
      certifications: [`Industry Specialization in ${studentSkills[0] || 'Domain Core'}`],
      projects: [
        { title: `${deptConfig.course} Capstone Project`, tech: studentSkills.slice(0, 3).join(', '), description: 'Full lifecycle implementation with rigorous empirical analysis and performance optimizations.' }
      ],
      timeline: [
        { date: '2025-09-01', title: 'Placement Registration', description: 'Registered for 2025-26 Campus Placement Season', type: 'academic' },
        ...(status === 'Placed' ? [{ date: offerDate || '2026-02-10', title: `Placed at ${company?.name}`, description: `Secured package of ₹${pkg} LPA`, type: 'placement' as const }] : [])
      ],
      createdAt: '2025-08-01',
      updatedAt: '2026-02-20'
    });

    idCounter++;
  }

  return students;
};

export const MOCK_STUDENTS: Student[] = generateRealisticStudents();

// Generate realistic applications
export const generatePlacementApplications = (students: Student[], companies: Company[]): PlacementApplication[] => {
  const applications: PlacementApplication[] = [];
  let appId = 1;

  students.forEach(student => {
    if (student.placement.status === 'Placed' && student.placement.companyName) {
      const company = companies.find(c => c.name === student.placement.companyName) || companies[0];
      applications.push({
        id: `APP-2026-${String(appId++).padStart(3, '0')}`,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar,
        studentRegNo: student.registerNumber,
        department: student.department,
        course: student.course,
        cgpa: student.academic.cgpa,
        driveId: 'DRV-2026-03',
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        role: student.placement.roleOffered || 'Software Engineer',
        packageLPA: student.placement.packageLPA || 6.5,
        appliedDate: '2026-01-20',
        stage: 'Placed',
        statusNotes: 'Final offer accepted and signed.',
        updatedAt: '2026-02-15'
      });
    } else if (student.placement.status === 'In Process') {
      const company = companies[Math.floor(Math.random() * 4)];
      applications.push({
        id: `APP-2026-${String(appId++).padStart(3, '0')}`,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar,
        studentRegNo: student.registerNumber,
        department: student.department,
        course: student.course,
        cgpa: student.academic.cgpa,
        driveId: 'DRV-2026-02',
        companyId: company.id,
        companyName: company.name,
        companyLogo: company.logo,
        role: 'Associate Trainee',
        packageLPA: company.packageRange.min + 1.5,
        appliedDate: '2026-02-10',
        stage: 'Technical Interview',
        statusNotes: 'Shortlisted for Round 2 technical panel.',
        interviewScheduledAt: '2026-03-18 10:30 AM',
        updatedAt: '2026-03-01'
      });
    }
  });

  return applications;
};

// Generate interview schedules
export const generateInterviewSchedules = (apps: PlacementApplication[]): InterviewSchedule[] => {
  return apps
    .filter(a => a.stage === 'Technical Interview' || a.stage === 'Aptitude Round')
    .slice(0, 12)
    .map((app, idx) => ({
      id: `INT-2026-${String(idx + 1).padStart(3, '0')}`,
      applicationId: app.id,
      studentId: app.studentId,
      studentName: app.studentName,
      companyName: app.companyName,
      companyLogo: app.companyLogo,
      roundName: 'Round 2: Technical Assessment & Live Coding',
      interviewType: idx % 2 === 0 ? 'Virtual (Google Meet)' : 'In-Person (Placement Cell Lab 2)',
      meetingLink: 'https://meet.google.com/xyz-placement-2026',
      room: idx % 2 === 1 ? 'Placement Cell Boardroom A' : undefined,
      dateTime: `2026-03-${15 + (idx % 10)} 10:${(idx % 4) * 15} AM`,
      durationMinutes: 45,
      interviewerName: 'Senior Engineering Panel Lead',
      status: 'Scheduled',
    }));
};

// Historical 5-Year placement trend data for charts
export const HISTORICAL_PLACEMENT_TRENDS = [
  { year: '2021-22', totalStudents: 850, placedStudents: 540, placementRate: 63.5, avgPackage: 4.8, highestPackage: 16.0 },
  { year: '2022-23', totalStudents: 980, placedStudents: 660, placementRate: 67.3, avgPackage: 5.4, highestPackage: 19.5 },
  { year: '2023-24', totalStudents: 1100, placedStudents: 785, placementRate: 71.4, avgPackage: 6.1, highestPackage: 21.0 },
  { year: '2024-25', totalStudents: 1210, placedStudents: 890, placementRate: 73.5, avgPackage: 6.8, highestPackage: 23.5 },
  { year: '2025-26', totalStudents: 1250, placedStudents: 780, placementRate: 62.4, avgPackage: 7.4, highestPackage: 24.0 }, // ongoing season
];

// Salary distribution breakdown for charts
export const SALARY_TIER_DISTRIBUTION = [
  { name: 'Super Dream (> 12 LPA)', count: 48, fill: '#6366F1' },
  { name: 'Dream (7 - 12 LPA)', count: 185, fill: '#8B5CF6' },
  { name: 'Core (4 - 7 LPA)', count: 420, fill: '#3B82F6' },
  { name: 'Mass (< 4 LPA)', count: 127, fill: '#10B981' },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'New Placement Drive Announced',
    message: 'Google has registered for BCA & B.Sc CS batch with ₹22.0 LPA CTC.',
    type: 'drive',
    timestamp: '10 mins ago',
    read: false,
    link: '/companies',
  },
  {
    id: 'NOTIF-02',
    title: 'Interview Shortlist Released',
    message: 'Deloitte has shortlisted 32 students for Round 2 technical assessment.',
    type: 'success',
    timestamp: '1 hour ago',
    read: false,
    link: '/placements',
  },
  {
    id: 'NOTIF-03',
    title: 'AI Resume Score Updated',
    message: 'Your resume ATS compatibility improved to 89% with recent project additions.',
    type: 'ai',
    timestamp: '3 hours ago',
    read: true,
    link: '/ai/resume',
  },
  {
    id: 'NOTIF-04',
    title: 'Upcoming Drive Deadline',
    message: 'Registration for Marriott Voyager Program closes tomorrow at 5:00 PM.',
    type: 'warning',
    timestamp: '1 day ago',
    read: true,
    link: '/companies',
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-03-09 14:32:10',
    userId: 'usr_principal_001',
    userName: 'Dr. Rajesh Sharma',
    userRole: 'principal',
    action: 'ANNUAL_REPORT_EXPORT',
    target: 'Placement Statistics 2025-26',
    details: 'Exported comprehensive PDF annual report for Board of Governors review.',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-03-09 11:20:45',
    userId: 'usr_hod_bca_001',
    userName: 'Prof. Priya Patel',
    userRole: 'hod',
    action: 'STUDENT_STATUS_UPDATE',
    target: 'Rahul Kumar (22BCA101)',
    details: 'Updated status to "Placed" at Deloitte with package ₹8.5 LPA.',
    ipAddress: '192.168.2.45',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-03-08 16:45:00',
    userId: 'usr_coord_bba_001',
    userName: 'Ms. Neha Sharma',
    userRole: 'coordinator',
    action: 'DRIVE_SCHEDULE_CREATED',
    target: 'HDFC Bank Campus Drive',
    details: 'Scheduled Round 2 interviews for 14 shortlisted candidates.',
    ipAddress: '192.168.3.12',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-03-08 09:15:30',
    userId: 'usr_principal_001',
    userName: 'Dr. Rajesh Sharma',
    userRole: 'principal',
    action: 'USER_CREATED',
    target: 'Dr. Meera Iyer (Faculty)',
    details: 'Created faculty account for Commerce & Management department review.',
    ipAddress: '192.168.1.10',
  }
];
