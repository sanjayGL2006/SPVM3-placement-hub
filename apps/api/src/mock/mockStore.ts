import {
  StudentRecord,
  CompanyRecord,
  PlacementDriveRecord,
  ApplicationRecord,
  CalendarEventRecord,
  NotificationRecord,
  AuditLogRecord,
  RecycleBinItem,
  UserSession,
} from '../types';

export interface DepartmentRecord {
  id: number;
  name: string;
  code: string;
}

export interface MockUserRecord extends UserSession {
  passwordHash?: string;
  isActive: boolean;
}

export class MockDataStore {
  public departments: DepartmentRecord[] = [
    { id: 1, name: 'Computer Applications (BCA)', code: 'BCA' },
    { id: 2, name: 'Business Administration (BBA)', code: 'BBA' },
    { id: 3, name: 'Hospitality Management (BBA HM)', code: 'BBA_HM' },
    { id: 4, name: 'Commerce (B.Com)', code: 'B_COM' },
    { id: 5, name: 'Science - Computer Science (B.Sc CS)', code: 'BSC_CS' },
    { id: 6, name: 'Science - Physics (B.Sc Physics)', code: 'BSC_PHY' },
    { id: 7, name: 'Science - Chemistry (B.Sc Chemistry)', code: 'BSC_CHEM' },
  ];

  public users: MockUserRecord[] = [
    {
      id: 1,
      name: 'Dr. S. K. Narayana',
      email: 'principal@college.edu',
      role: 'PRINCIPAL',
      departmentId: null,
      departmentName: 'College-Wide',
      isActive: true,
    },
    {
      id: 2,
      name: 'Dr. Ramesh Kumar',
      email: 'hod.bca@college.edu',
      role: 'HOD',
      departmentId: 1,
      departmentName: 'Computer Applications (BCA)',
      isActive: true,
    },
    {
      id: 3,
      name: 'Prof. Anitha Rao',
      email: 'hod.bba@college.edu',
      role: 'HOD',
      departmentId: 2,
      departmentName: 'Business Administration (BBA)',
      isActive: true,
    },
    {
      id: 4,
      name: 'Dr. Meenakshi Sundaram',
      email: 'hod.bcom@college.edu',
      role: 'HOD',
      departmentId: 4,
      departmentName: 'Commerce (B.Com)',
      isActive: true,
    },
    {
      id: 5,
      name: 'Dr. Venkatesh Prasad',
      email: 'hod.bsc@college.edu',
      role: 'HOD',
      departmentId: 5,
      departmentName: 'Science - Computer Science (B.Sc CS)',
      isActive: true,
    },
    {
      id: 6,
      name: 'Prof. Chethan V',
      email: 'coord.bca@college.edu',
      role: 'PLACEMENT_COORDINATOR',
      departmentId: 1,
      departmentName: 'Computer Applications (BCA)',
      isActive: true,
    },
    {
      id: 7,
      name: 'Prof. Geetha Nayak',
      email: 'faculty@college.edu',
      role: 'FACULTY',
      departmentId: 1,
      departmentName: 'Computer Applications (BCA)',
      isActive: true,
    },
    {
      id: 8,
      name: 'Aditya Sharma',
      email: 'student.bca@college.edu',
      role: 'STUDENT',
      departmentId: 1,
      departmentName: 'Computer Applications (BCA)',
      isActive: true,
    },
    {
      id: 9,
      name: 'Pooja Hegde',
      email: 'student.bba@college.edu',
      role: 'STUDENT',
      departmentId: 2,
      departmentName: 'Business Administration (BBA)',
      isActive: true,
    },
    {
      id: 10,
      name: 'Rohit Verma (HR)',
      email: 'hr@google.com',
      role: 'COMPANY_HR',
      departmentId: null,
      isActive: true,
    }
  ];

  public companies: CompanyRecord[] = [
    {
      id: 1,
      name: 'Google India',
      industry: 'Product & Cloud',
      location: 'Bangalore / Hyderabad',
      website: 'https://careers.google.com',
      hrName: 'Rohit Verma',
      hrEmail: 'rohit.v@google.com',
      hrContactNumber: '+91 98801 23456',
      jobRole: 'Associate Software Engineer',
      packageAmount: 28.5,
      minPackage: 24.0,
      maxPackage: 32.0,
      avgPackage: 28.5,
      eligibleDepartments: ['BCA', 'BSC_CS'],
      minCgpa: 8.5,
      allowedBacklogs: 0,
      requiredSkills: ['Data Structures', 'Algorithms', 'TypeScript', 'React', 'Python'],
      hiringCount: 8,
      tier: 'Super Dream',
      visitDate: '2026-10-15',
      venue: 'Online & Virtual',
      lastDate: '2026-10-10',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Microsoft IDC',
      industry: 'Software Engineering',
      location: 'Bangalore',
      website: 'https://careers.microsoft.com',
      hrName: 'Ananya Roy',
      hrEmail: 'ananya.r@microsoft.com',
      hrContactNumber: '+91 98802 34567',
      jobRole: 'Software Engineer - AI/Cloud',
      packageAmount: 26.0,
      minPackage: 22.0,
      maxPackage: 30.0,
      avgPackage: 26.0,
      eligibleDepartments: ['BCA', 'BSC_CS'],
      minCgpa: 8.2,
      allowedBacklogs: 0,
      requiredSkills: ['C#', 'TypeScript', 'Cloud Architecture', 'SQL', 'React'],
      hiringCount: 12,
      tier: 'Super Dream',
      visitDate: '2026-10-25',
      venue: 'Virtual & Campus',
      lastDate: '2026-10-18',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Deloitte USI',
      industry: 'Consulting & Analytics',
      location: 'Hyderabad / Bangalore',
      website: 'https://deloitte.com/careers',
      hrName: 'Siddharth Sen',
      hrEmail: 'siddharth.s@deloitte.com',
      hrContactNumber: '+91 98803 45678',
      jobRole: 'Technology Analyst',
      packageAmount: 9.5,
      minPackage: 8.5,
      maxPackage: 11.0,
      avgPackage: 9.5,
      eligibleDepartments: ['BCA', 'BBA', 'B_COM', 'BSC_CS'],
      minCgpa: 7.0,
      allowedBacklogs: 1,
      requiredSkills: ['SQL', 'Python', 'Business Analytics', 'PowerBI', 'Excel'],
      hiringCount: 25,
      tier: 'Dream',
      visitDate: '2026-10-20',
      venue: 'Main Auditorium',
      lastDate: '2026-10-14',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Amazon Development Centre',
      industry: 'E-Commerce & AWS',
      location: 'Bangalore / Chennai',
      website: 'https://amazon.jobs',
      hrName: 'Deepa Menon',
      hrEmail: 'deepa.m@amazon.com',
      hrContactNumber: '+91 98805 67890',
      jobRole: 'Cloud Support Associate',
      packageAmount: 18.0,
      minPackage: 15.0,
      maxPackage: 21.0,
      avgPackage: 18.0,
      eligibleDepartments: ['BCA', 'BSC_CS', 'BSC_PHY'],
      minCgpa: 7.5,
      allowedBacklogs: 0,
      requiredSkills: ['Linux', 'Networking', 'AWS', 'Python', 'Troubleshooting'],
      hiringCount: 15,
      tier: 'Super Dream',
      visitDate: '2026-11-05',
      venue: 'Online Assessment',
      lastDate: '2026-10-28',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Tata Consultancy Services (TCS)',
      industry: 'IT Services & Consulting',
      location: 'Pan India',
      website: 'https://tcs.com/careers',
      hrName: 'Vikram Singh',
      hrEmail: 'vikram.s@tcs.com',
      hrContactNumber: '+91 98804 56789',
      jobRole: 'System Engineer (Digital/Ninja)',
      packageAmount: 7.2,
      minPackage: 3.8,
      maxPackage: 9.0,
      avgPackage: 6.5,
      eligibleDepartments: ['BCA', 'BBA', 'B_COM', 'BSC_CS', 'BSC_PHY', 'BSC_CHEM'],
      minCgpa: 6.0,
      allowedBacklogs: 2,
      requiredSkills: ['Java', 'Python', 'C++', 'Web Technologies', 'SQL'],
      hiringCount: 65,
      tier: 'Core',
      visitDate: '2026-11-12',
      venue: 'Campus Lab 1-4',
      lastDate: '2026-11-01',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  public students: StudentRecord[] = [];
  public drives: PlacementDriveRecord[] = [];
  public applications: ApplicationRecord[] = [];
  public calendarEvents: CalendarEventRecord[] = [];
  public notifications: NotificationRecord[] = [];
  public auditLogs: AuditLogRecord[] = [];
  public recycleBin: RecycleBinItem[] = [];

  constructor() {
    this.seedStudents();
    this.seedDrivesAndApplications();
    this.seedCalendarEvents();
    this.seedNotifications();
  }

  private seedStudents() {
    const firstNames = [
      'Aditya', 'Sneha', 'Pooja', 'Karthik', 'Rahul', 'Ananya', 'Varun', 'Megha',
      'Rohan', 'Divya', 'Naveen', 'Swathi', 'Arjun', 'Bhavana', 'Praveen', 'Shruti',
      'Ganesh', 'Kavya', 'Sandeep', 'Deepika', 'Akash', 'Priyanka', 'Manoj', 'Raksha'
    ];
    const lastNames = [
      'Sharma', 'Kulkarni', 'Hegde', 'Rao', 'Prasad', 'Bhat', 'Gowda', 'Shetty',
      'Kamath', 'Naik', 'Deshpande', 'Patil', 'Joshi', 'Narayanan', 'Menon', 'Verma'
    ];

    const depts = [
      { id: 1, name: 'Computer Applications (BCA)', code: 'BCA', skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Java'] },
      { id: 2, name: 'Business Administration (BBA)', code: 'BBA', skills: ['Financial Modeling', 'Excel', 'Marketing Analytics', 'PowerBI', 'Tableau', 'CRM'] },
      { id: 3, name: 'Hospitality Management (BBA HM)', code: 'BBA_HM', skills: ['Hotel Operations', 'Event Management', 'Customer Relations', 'F&B Services'] },
      { id: 4, name: 'Commerce (B.Com)', code: 'B_COM', skills: ['Tally Prime', 'GST Accounting', 'Taxation', 'Corporate Finance', 'Auditing', 'Excel'] },
      { id: 5, name: 'Science - Computer Science (B.Sc CS)', code: 'BSC_CS', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Structures', 'C++', 'SQL'] },
      { id: 6, name: 'Science - Physics (B.Sc Physics)', code: 'BSC_PHY', skills: ['MATLAB', 'Quantum Simulation', 'Optics', 'Data Analysis', 'Python'] },
      { id: 7, name: 'Science - Chemistry (B.Sc Chemistry)', code: 'BSC_CHEM', skills: ['Chromatography', 'Spectroscopy', 'Quality Assurance', 'Chemical Safety'] },
    ];

    let idCounter = 1;
    for (let deptIndex = 0; deptIndex < depts.length; deptIndex++) {
      const dept = depts[deptIndex]!;
      const count = dept.code === 'BCA' ? 45 : dept.code === 'BBA' ? 35 : dept.code === 'B_COM' ? 35 : dept.code === 'BSC_CS' ? 35 : 20;

      for (let i = 1; i <= count; i++) {
        const fn = firstNames[(idCounter * 7) % firstNames.length]!;
        const ln = lastNames[(idCounter * 11) % lastNames.length]!;
        const numStr = String(i).padStart(3, '0');
        const regNum = `PES2026${dept.code}${numStr}`;
        const cgpaVal = parseFloat((6.2 + ((idCounter * 17) % 36) / 10).toFixed(2));
        const hasBacklog = cgpaVal < 6.8 && (idCounter % 5 === 0) ? 1 : 0;
        
        let status: StudentRecord['placementStatus'] = 'not_placed';
        let company: string | undefined;
        let pkg: number | undefined;

        if (cgpaVal >= 8.5 && idCounter % 3 === 0) {
          status = 'offered';
          company = dept.code === 'BCA' || dept.code === 'BSC_CS' ? 'Google India' : 'Deloitte USI';
          pkg = dept.code === 'BCA' || dept.code === 'BSC_CS' ? 28.5 : 9.5;
        } else if (cgpaVal >= 7.5 && idCounter % 2 === 0) {
          status = 'selected';
          company = 'Microsoft IDC';
          pkg = 26.0;
        } else if (cgpaVal >= 7.0 && idCounter % 3 === 1) {
          status = 'shortlisted';
          company = 'Deloitte USI';
        } else if (cgpaVal >= 6.5) {
          status = 'applied';
        }

        const studentSkills = dept.skills.slice(0, 3 + (idCounter % 4));

        this.students.push({
          id: idCounter,
          registerNumber: regNum,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${idCounter}@college.edu`,
          mobileNumber: `+91 9845${(idCounter * 12345).toString().slice(0, 6)}`,
          gender: idCounter % 2 === 0 ? 'Female' : 'Male',
          departmentId: dept.id,
          departmentName: dept.name,
          courseId: dept.id,
          courseName: dept.name,
          section: idCounter % 2 === 0 ? 'A' : 'B',
          academicYear: '2025-2026',
          batch: '2023-2026',
          semester: 6,
          cgpa: cgpaVal,
          percentage: parseFloat((cgpaVal * 9.5).toFixed(1)),
          backlogs: hasBacklog,
          skills: studentSkills,
          placementStatus: status,
          companyName: company,
          packageAmount: pkg,
          eligibleStatus: hasBacklog === 0 && cgpaVal >= 6.0,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        idCounter++;
      }
    }
  }

  private seedDrivesAndApplications() {
    this.drives = [
      {
        id: 1,
        companyId: 1,
        companyName: 'Google India',
        title: 'Google University Graduate Drive 2026',
        jobRole: 'Associate Software Engineer',
        location: 'Bangalore / Hyderabad',
        packageAmount: 28.5,
        minCgpa: 8.5,
        allowedBacklogs: 0,
        eligibleDepartments: ['BCA', 'BSC_CS'],
        requiredSkills: ['Data Structures', 'Algorithms', 'TypeScript', 'React', 'Python'],
        driveDate: '2026-10-15',
        registrationDeadline: '2026-10-10',
        testDate: '2026-10-15',
        interviewDate: '2026-10-22',
        vacancies: 8,
        selectionProcess: 'Online Assessment -> Technical Round 1 -> Technical Round 2 -> Googlyness & Leadership Round',
        status: 'registration_open',
        applicantCount: 28,
        selectedCount: 4,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        companyId: 2,
        companyName: 'Microsoft IDC',
        title: 'Microsoft College Discovery Campus Hiring',
        jobRole: 'Software Engineer - AI/Cloud',
        location: 'Bangalore',
        packageAmount: 26.0,
        minCgpa: 8.2,
        allowedBacklogs: 0,
        eligibleDepartments: ['BCA', 'BSC_CS'],
        requiredSkills: ['C#', 'TypeScript', 'Cloud Architecture', 'SQL', 'React'],
        driveDate: '2026-10-25',
        registrationDeadline: '2026-10-18',
        testDate: '2026-10-25',
        interviewDate: '2026-10-30',
        vacancies: 12,
        selectionProcess: 'Coding Round -> System Design & Problem Solving -> AA Interview',
        status: 'upcoming',
        applicantCount: 34,
        selectedCount: 6,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        companyId: 3,
        companyName: 'Deloitte USI',
        title: 'Deloitte Campus Recruitment Drive',
        jobRole: 'Technology Analyst',
        location: 'Hyderabad / Bangalore',
        packageAmount: 9.5,
        minCgpa: 7.0,
        allowedBacklogs: 1,
        eligibleDepartments: ['BCA', 'BBA', 'B_COM', 'BSC_CS'],
        requiredSkills: ['SQL', 'Python', 'Business Analytics', 'PowerBI', 'Excel'],
        driveDate: '2026-10-20',
        registrationDeadline: '2026-10-14',
        testDate: '2026-10-20',
        interviewDate: '2026-10-21',
        vacancies: 25,
        selectionProcess: 'Aptitude & Technical MCQ -> Case Study -> Partner Interview',
        status: 'assessment',
        applicantCount: 52,
        selectedCount: 15,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Seed some initial applications
    this.applications = [
      {
        id: 1,
        driveId: 1,
        driveTitle: 'Google University Graduate Drive 2026',
        companyName: 'Google India',
        studentId: 1,
        studentName: 'Aditya Sharma',
        registerNumber: 'PES2026BCA001',
        departmentName: 'Computer Applications (BCA)',
        status: 'selected',
        interviewRound: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        driveId: 1,
        driveTitle: 'Google University Graduate Drive 2026',
        companyName: 'Google India',
        studentId: 2,
        studentName: 'Sneha Kulkarni',
        registerNumber: 'PES2026BCA002',
        departmentName: 'Computer Applications (BCA)',
        status: 'interview',
        interviewRound: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        driveId: 3,
        driveTitle: 'Deloitte Campus Recruitment Drive',
        companyName: 'Deloitte USI',
        studentId: 3,
        studentName: 'Pooja Hegde',
        registerNumber: 'PES2026BBA001',
        departmentName: 'Business Administration (BBA)',
        status: 'shortlisted',
        interviewRound: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  private seedCalendarEvents() {
    this.calendarEvents = [
      {
        id: 1,
        title: 'Google Placement Drive (Round 1 Online Assessment)',
        description: 'Online coding and algorithmic assessment on HackerEarth platform',
        eventType: 'DRIVE',
        startDate: '2026-10-15T09:30:00.000Z',
        endDate: '2026-10-15T12:00:00.000Z',
        location: 'Computer Lab 3 & 4',
        driveId: 1,
        companyName: 'Google India',
      },
      {
        id: 2,
        title: 'Deloitte Technical & Case Study Workshop',
        description: 'Comprehensive pre-placement training workshop on case study analysis',
        eventType: 'WORKSHOP',
        startDate: '2026-10-20T14:00:00.000Z',
        endDate: '2026-10-20T17:00:00.000Z',
        location: 'Main Auditorium',
      },
      {
        id: 3,
        title: 'Microsoft Technical Interviews (Virtual 1-on-1)',
        description: 'System design and algorithmic interviews for shortlisted students',
        eventType: 'INTERVIEW',
        startDate: '2026-10-25T10:00:00.000Z',
        endDate: '2026-10-25T18:00:00.000Z',
        location: 'Virtual Meeting Rooms',
        driveId: 2,
        companyName: 'Microsoft IDC',
      },
      {
        id: 4,
        title: 'Amazon AWS Cloud Support Registration Deadline',
        description: 'Last date for eligible BCA and B.Sc CS students to apply',
        eventType: 'DEADLINE',
        startDate: '2026-10-28T23:59:00.000Z',
        location: 'Online Portal',
      }
    ];
  }

  private seedNotifications() {
    this.notifications = [
      {
        id: 1,
        title: '🚀 Google India Campus Drive Announced',
        message: 'Google is hiring Associate Software Engineers (28.5 LPA). Eligible BCA & B.Sc CS students can apply now!',
        type: 'drive',
        isRead: false,
        link: '/placements',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: '📅 Deloitte Pre-Placement Workshop',
        message: 'Deloitte will conduct an interactive case-study and consulting workshop this Friday in Main Auditorium.',
        type: 'info',
        isRead: false,
        link: '/calendar',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: '🎉 15 Students Selected for Microsoft IDC!',
        message: 'Congratulations to our BCA and B.Sc students shortlisted for the Microsoft technical interview round.',
        type: 'success',
        isRead: true,
        link: '/placements',
        createdAt: new Date().toISOString(),
      }
    ];
  }

  public logAudit(action: string, entity: string, entityId?: string, details?: any, user?: UserSession, ip?: string) {
    this.auditLogs.unshift({
      id: this.auditLogs.length + 1,
      userId: user ? Number(user.id) : undefined,
      userEmail: user?.email || 'system',
      action,
      entity,
      entityId,
      details,
      ipAddress: ip || '127.0.0.1',
      createdAt: new Date().toISOString(),
    });
  }
}

export const mockDb = new MockDataStore();
