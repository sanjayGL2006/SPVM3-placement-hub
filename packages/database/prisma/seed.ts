import { PrismaClient, Role, PlacementStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Placement Pro...');

  // 1. Create PESIAMS Departments
  const departmentsData = [
    { name: 'Computer Applications (BCA)', code: 'BCA' },
    { name: 'Business Administration (BBA)', code: 'BBA' },
    { name: 'Hospitality Management (BBA HM)', code: 'BBA_HM' },
    { name: 'Commerce (B.Com)', code: 'B_COM' },
    { name: 'Science - Computer Science (B.Sc CS)', code: 'BSC_CS' },
    { name: 'Science - Physics (B.Sc Physics)', code: 'BSC_PHY' },
    { name: 'Science - Chemistry (B.Sc Chemistry)', code: 'BSC_CHEM' },
  ];

  const createdDepts: Record<string, any> = {};
  for (const dept of departmentsData) {
    createdDepts[dept.code] = await prisma.department.upsert({
      where: { name: dept.name },
      update: { code: dept.code },
      create: { name: dept.name, code: dept.code },
    });
  }

  // 2. Create Courses
  const coursesData = [
    { name: 'Bachelor of Computer Applications', code: 'BCA', deptCode: 'BCA' },
    { name: 'Bachelor of Business Administration', code: 'BBA', deptCode: 'BBA' },
    { name: 'BBA in Hotel & Hospitality Management', code: 'BBA_HM', deptCode: 'BBA_HM' },
    { name: 'Bachelor of Commerce (General/Honors)', code: 'BCOM', deptCode: 'B_COM' },
    { name: 'B.Sc in Computer Science & AI', code: 'BSC_CS', deptCode: 'BSC_CS' },
    { name: 'B.Sc in Physics & Electronics', code: 'BSC_PHY', deptCode: 'BSC_PHY' },
    { name: 'B.Sc in Chemistry & Materials', code: 'BSC_CHEM', deptCode: 'BSC_CHEM' },
  ];

  const createdCourses: Record<string, any> = {};
  for (const course of coursesData) {
    const dept = createdDepts[course.deptCode];
    createdCourses[course.code] = await prisma.course.upsert({
      where: { id: 0 }, // fallback create if not exists
      update: {},
      create: {
        name: course.name,
        code: course.code,
        departmentId: dept ? dept.id : null,
      },
    }).catch(async () => {
      return await prisma.course.findFirst({ where: { name: course.name } }) ||
        await prisma.course.create({
          data: {
            name: course.name,
            code: course.code,
            departmentId: dept ? dept.id : null,
          }
        });
    });
  }

  // 3. Create Predefined Demo Accounts
  const defaultPassword = await bcrypt.hash('Placement@2026', 10);
  const principalPassword = await bcrypt.hash('Principal@2026', 10);
  const hodBcaPassword = await bcrypt.hash('HodBca@2026', 10);
  const studentPassword = await bcrypt.hash('Student@2026', 10);

  const demoUsers = [
    {
      name: 'Dr. S. K. Narayana (Principal)',
      email: 'principal@college.edu',
      passwordHash: principalPassword,
      role: Role.PRINCIPAL,
      departmentId: null,
    },
    {
      name: 'Dr. Ramesh Kumar (HOD BCA)',
      email: 'hod.bca@college.edu',
      passwordHash: hodBcaPassword,
      role: Role.HOD,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      name: 'Prof. Anitha Rao (HOD BBA)',
      email: 'hod.bba@college.edu',
      passwordHash: defaultPassword,
      role: Role.HOD,
      departmentId: createdDepts['BBA']?.id,
    },
    {
      name: 'Dr. Meenakshi Sundaram (HOD B.Com)',
      email: 'hod.bcom@college.edu',
      passwordHash: defaultPassword,
      role: Role.HOD,
      departmentId: createdDepts['B_COM']?.id,
    },
    {
      name: 'Dr. Venkatesh Prasad (HOD B.Sc)',
      email: 'hod.bsc@college.edu',
      passwordHash: defaultPassword,
      role: Role.HOD,
      departmentId: createdDepts['BSC_CS']?.id,
    },
    {
      name: 'Prof. Chethan V (Placement Coordinator BCA)',
      email: 'coord.bca@college.edu',
      passwordHash: defaultPassword,
      role: Role.PLACEMENT_COORDINATOR,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      name: 'Prof. Geetha Nayak (Faculty View-Only)',
      email: 'faculty@college.edu',
      passwordHash: defaultPassword,
      role: Role.FACULTY,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      name: 'Aditya Sharma (Student BCA)',
      email: 'student.bca@college.edu',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      name: 'Pooja Hegde (Student BBA)',
      email: 'student.bba@college.edu',
      passwordHash: studentPassword,
      role: Role.STUDENT,
      departmentId: createdDepts['BBA']?.id,
    },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        departmentId: user.departmentId,
      },
      create: user,
    });
  }

  // 4. Create Sample Companies
  const sampleCompanies = [
    {
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
      minCgpa: 8.5,
      allowedBacklogs: 0,
      eligibleDepartments: 'BCA,BSC_CS',
      requiredSkills: 'Data Structures, Algorithms, TypeScript, React, Python',
      tier: 'Super Dream',
      hiringCount: 8,
    },
    {
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
      minCgpa: 8.2,
      allowedBacklogs: 0,
      eligibleDepartments: 'BCA,BSC_CS',
      requiredSkills: 'C#, TypeScript, Cloud Architecture, SQL, React',
      tier: 'Super Dream',
      hiringCount: 12,
    },
    {
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
      minCgpa: 7.0,
      allowedBacklogs: 1,
      eligibleDepartments: 'BCA,BBA,B_COM,BSC_CS',
      requiredSkills: 'SQL, Python, Business Analytics, PowerBI, Excel',
      tier: 'Dream',
      hiringCount: 25,
    },
    {
      name: 'Tata Consultancy Services (TCS)',
      industry: 'IT Services',
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
      minCgpa: 6.5,
      allowedBacklogs: 2,
      eligibleDepartments: 'BCA,BBA,B_COM,BSC_CS,BSC_PHY,BSC_CHEM',
      requiredSkills: 'Java, Python, C++, Web Technologies, SQL',
      tier: 'Core',
      hiringCount: 60,
    },
  ];

  for (const comp of sampleCompanies) {
    await prisma.company.upsert({
      where: { id: 0 },
      update: {},
      create: {
        name: comp.name,
        industry: comp.industry,
        location: comp.location,
        website: comp.website,
        hrName: comp.hrName,
        hrEmail: comp.hrEmail,
        hrContactNumber: comp.hrContactNumber,
        jobRole: comp.jobRole,
        packageAmount: comp.packageAmount,
        minPackage: comp.minPackage,
        maxPackage: comp.maxPackage,
        avgPackage: comp.avgPackage,
        minCgpa: comp.minCgpa,
        allowedBacklogs: comp.allowedBacklogs,
        eligibleDepartments: comp.eligibleDepartments,
        requiredSkills: comp.requiredSkills,
        tier: comp.tier,
        hiringCount: comp.hiringCount,
      },
    }).catch(async () => {
      // Ignore if exists
    });
  }

  // 5. Create Sample Students
  const sampleStudents = [
    {
      registerNumber: 'PES2026BCA001',
      name: 'Aditya Sharma',
      email: 'student.bca@college.edu',
      mobileNumber: '+91 98451 11223',
      gender: 'Male',
      section: 'A',
      academicYear: '2025-2026',
      batch: '2023-2026',
      semester: 6,
      cgpa: 9.15,
      percentage: 88.5,
      backlogs: 0,
      skills: 'TypeScript, React, Node.js, PostgreSQL, Docker, Python',
      placementStatus: PlacementStatus.OFFERED,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      registerNumber: 'PES2026BCA002',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@college.edu',
      mobileNumber: '+91 98451 22334',
      gender: 'Female',
      section: 'A',
      academicYear: '2025-2026',
      batch: '2023-2026',
      semester: 6,
      cgpa: 8.85,
      percentage: 85.0,
      backlogs: 0,
      skills: 'Java, Spring Boot, React, SQL, AWS',
      placementStatus: PlacementStatus.OFFERED,
      departmentId: createdDepts['BCA']?.id,
    },
    {
      registerNumber: 'PES2026BBA001',
      name: 'Pooja Hegde',
      email: 'student.bba@college.edu',
      mobileNumber: '+91 98451 33445',
      gender: 'Female',
      section: 'B',
      academicYear: '2025-2026',
      batch: '2023-2026',
      semester: 6,
      cgpa: 8.40,
      percentage: 81.2,
      backlogs: 0,
      skills: 'Financial Modeling, Excel, Marketing Analytics, PowerBI, Tableau',
      placementStatus: PlacementStatus.APPLIED,
      departmentId: createdDepts['BBA']?.id,
    },
    {
      registerNumber: 'PES2026BCS001',
      name: 'Karthik Raja',
      email: 'karthik.r@college.edu',
      mobileNumber: '+91 98451 44556',
      gender: 'Male',
      section: 'A',
      academicYear: '2025-2026',
      batch: '2023-2026',
      semester: 6,
      cgpa: 7.95,
      percentage: 76.8,
      backlogs: 0,
      skills: 'Python, Machine Learning, TensorFlow, SQL, FastApi',
      placementStatus: PlacementStatus.SHORTLISTED,
      departmentId: createdDepts['BSC_CS']?.id,
    }
  ];

  for (const stu of sampleStudents) {
    await prisma.student.upsert({
      where: { registerNumber: stu.registerNumber },
      update: {
        cgpa: stu.cgpa,
        skills: stu.skills,
        placementStatus: stu.placementStatus,
      },
      create: stu,
    });
  }

  // 6. Create Calendar Events & Notifications
  await prisma.calendarEvent.createMany({
    data: [
      {
        title: 'Google Placement Drive (Round 1: Online Assessment)',
        description: 'Online coding and CS fundamentals test on HackerEarth platform',
        eventType: 'DRIVE',
        startDate: new Date('2026-10-15T09:30:00.000Z'),
        endDate: new Date('2026-10-15T12:00:00.000Z'),
        location: 'Computer Lab 3 & 4',
      },
      {
        title: 'Deloitte Technical & Case Study Workshop',
        description: 'Pre-placement training workshop on case study analysis and consulting interviews',
        eventType: 'WORKSHOP',
        startDate: new Date('2026-10-20T14:00:00.000Z'),
        endDate: new Date('2026-10-20T17:00:00.000Z'),
        location: 'Main Auditorium',
      },
      {
        title: 'Microsoft Technical Interviews (Shortlisted Candidates)',
        description: 'Virtual 1-on-1 technical and system design rounds',
        eventType: 'INTERVIEW',
        startDate: new Date('2026-10-25T10:00:00.000Z'),
        endDate: new Date('2026-10-25T18:00:00.000Z'),
        location: 'Seminar Hall 1',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
  });
