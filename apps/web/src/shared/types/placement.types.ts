export type ApplicationStage = 
  | 'Applied' 
  | 'Aptitude Round' 
  | 'Technical Interview' 
  | 'HR Interview' 
  | 'Offered' 
  | 'Placed' 
  | 'Rejected';

export interface PlacementApplication {
  id: string; // "APP-001"
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentRegNo: string;
  department: string;
  course: string;
  cgpa: number;
  driveId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  role: string;
  packageLPA: number;
  appliedDate: string;
  stage: ApplicationStage;
  statusNotes?: string;
  interviewScheduledAt?: string;
  offerLetterUrl?: string;
  updatedAt: string;
}

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  companyName: string;
  companyLogo: string;
  roundName: string; // e.g. "Round 2: System Design & React"
  interviewType: 'Virtual (Google Meet)' | 'Virtual (Zoom)' | 'In-Person (Placement Cell Lab 2)';
  meetingLink?: string;
  room?: string;
  dateTime: string;
  durationMinutes: number;
  interviewerName: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
}

export interface PlacementReportMetrics {
  totalStudents: number;
  eligibleStudents: number;
  placedStudents: number;
  inProcessStudents: number;
  optedOutStudents: number;
  placementPercentage: number;
  highestPackage: number;
  averagePackage: number;
  medianPackage: number;
  lowestPackage: number;
  totalCompaniesVisited: number;
  totalOffersMade: number;
  multipleOffersCount: number;
}
