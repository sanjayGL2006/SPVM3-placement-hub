import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company, PlacementDrive, CandidatePipelineItem, PipelineStage, PipelineStatus } from '../../../shared/types/company.types';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import { MOCK_COMPANIES, MOCK_DRIVES } from '../../../shared/utils/mockData';

export interface RecycleBinItem {
  id: string;
  entityType: 'STUDENT' | 'COMPANY' | 'DRIVE';
  entityId: string;
  entityName: string;
  payload: any;
  deletedBy: string;
  deletedAt: string;
}

interface CompanyState {
  companies: Company[];
  drives: PlacementDrive[];
  pipelineCandidates: CandidatePipelineItem[];
  recycleBin: RecycleBinItem[];
  selectedCompany: Company | null;
  selectedDrive: PlacementDrive | null;
  searchQuery: string;
  selectedTier: string;

  setSearchQuery: (query: string) => void;
  setSelectedTier: (tier: string) => void;
  setSelectedCompany: (company: Company | null) => void;
  setSelectedDrive: (drive: PlacementDrive | null) => void;

  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  addDrive: (driveData: Omit<PlacementDrive, 'id'>) => void;
  updateDrive: (id: string, updates: Partial<PlacementDrive>) => void;
  deleteDrive: (id: string) => void;

  assignStudentsToCompanyDrive: (
    companyId: string,
    driveId: string,
    studentIds: string[],
    initialStage?: PipelineStage
  ) => void;

  updateCandidatePipelineStage: (
    candidateId: string,
    stage: PipelineStage,
    status: PipelineStatus,
    packageLPA?: number,
    offerLetterStatus?: 'Pending' | 'Issued' | 'Accepted' | 'Rejected' | 'Joined',
    note?: string
  ) => void;

  restoreFromRecycleBin: (itemId: string) => void;
  emptyRecycleBin: () => void;
  clearAllCompanies: () => void;
}

const sanitizeCompanies = (companies: Company[]): Company[] => {
  return companies.map((c) => ({
    ...c,
    logo: getCompanyLogo(c.name, c.logo),
    totalInterestedCount: c.totalInterestedCount || Math.floor(Math.random() * 40) + 35,
    avgPackage: c.avgPackage || Number(((c.packageRange.min + c.packageRange.max) / 2).toFixed(1)),
  }));
};

const sanitizeDrives = (drives: PlacementDrive[]): PlacementDrive[] => {
  return drives.map((d) => ({
    ...d,
    companyLogo: getCompanyLogo(d.companyName, d.companyLogo),
  }));
};

// Initial Seed Pipeline Candidates
const INITIAL_PIPELINE_CANDIDATES: CandidatePipelineItem[] = [
  {
    id: 'PIPE-001',
    driveId: 'DRV-2026-01',
    companyId: 'CMP-001',
    studentId: 'STU-2026-001',
    registerNumber: '22BCA001',
    candidateName: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    department: 'Computer Applications',
    section: 'A',
    cgpa: 9.42,
    packageLPA: 24.0,
    hiringStage: 'Offer Letter Request',
    driveStatus: 'Ongoing',
    offerLetterStatus: 'Issued',
    activityLog: [
      { date: '2026-02-01 10:00', stage: 'Assigned', status: 'Completed', note: 'Assigned from BCA Sec A' },
      { date: '2026-02-05 14:00', stage: 'Aptitude Test', status: 'Passed Round', note: 'Scored 96% in DSA challenge' },
      { date: '2026-02-12 11:30', stage: 'Technical Interview', status: 'Passed Round', note: 'Cleared System Design & Cloud' },
      { date: '2026-02-20 16:00', stage: 'HR Round', status: 'Passed Round', note: 'Recommended for hiring' },
      { date: '2026-03-01 09:30', stage: 'Offer Letter Request', status: 'Completed', note: 'Offer Letter dispatched' },
    ],
    updatedAt: '2026-03-01',
  },
  {
    id: 'PIPE-002',
    driveId: 'DRV-2026-01',
    companyId: 'CMP-001',
    studentId: 'STU-2026-002',
    registerNumber: '22BCA002',
    candidateName: 'Diya Patel',
    email: 'diya.patel@college.edu',
    department: 'Computer Applications',
    section: 'A',
    cgpa: 9.15,
    packageLPA: 24.0,
    hiringStage: 'Technical Interview',
    driveStatus: 'Ongoing',
    offerLetterStatus: 'Pending',
    activityLog: [
      { date: '2026-02-01 10:00', stage: 'Assigned', status: 'Completed', note: 'Assigned by Coordinator' },
      { date: '2026-02-05 14:00', stage: 'Aptitude Test', status: 'Passed Round', note: 'Cleared online coding' },
      { date: '2026-02-18 10:30', stage: 'Technical Interview', status: 'Processing', note: 'Round 2 scheduled' },
    ],
    updatedAt: '2026-02-18',
  },
  {
    id: 'PIPE-003',
    driveId: 'DRV-2026-04',
    companyId: 'CMP-004',
    studentId: 'STU-2026-003',
    registerNumber: '22BBA001',
    candidateName: 'Rohan Verma',
    email: 'rohan.verma@college.edu',
    department: 'Business Administration',
    section: 'B',
    cgpa: 8.85,
    packageLPA: 9.5,
    hiringStage: 'Selected',
    driveStatus: 'Completed',
    offerLetterStatus: 'Issued',
    activityLog: [
      { date: '2026-01-20 09:00', stage: 'Assigned', status: 'Completed', note: 'Assigned from BBA cohort' },
      { date: '2026-01-25 11:00', stage: 'Aptitude Test', status: 'Passed Round', note: 'Passed Business Analytics test' },
      { date: '2026-02-02 15:00', stage: 'Group Discussion', status: 'Passed Round', note: 'Led case study discussion' },
      { date: '2026-02-10 14:00', stage: 'HR Round', status: 'Passed Round', note: 'Partner interview cleared' },
      { date: '2026-02-15 12:00', stage: 'Selected', status: 'Completed', note: 'Selected for Technology Consulting' },
    ],
    updatedAt: '2026-02-15',
  },
  {
    id: 'PIPE-004',
    driveId: 'DRV-2026-06',
    companyId: 'CMP-006',
    studentId: 'STU-2026-004',
    registerNumber: '22BCA004',
    candidateName: 'Ananya Iyer',
    email: 'ananya.iyer@college.edu',
    department: 'Computer Applications',
    section: 'A',
    cgpa: 8.70,
    packageLPA: 7.0,
    hiringStage: 'Aptitude Test',
    driveStatus: 'Ongoing',
    offerLetterStatus: 'Pending',
    activityLog: [
      { date: '2026-02-10 09:00', stage: 'Assigned', status: 'Completed', note: 'Assigned to TCS Drive' },
      { date: '2026-02-22 10:00', stage: 'Aptitude Test', status: 'Processing', note: 'NQT assessment ongoing' },
    ],
    updatedAt: '2026-02-22',
  },
  {
    id: 'PIPE-005',
    driveId: 'DRV-2026-01',
    companyId: 'CMP-001',
    studentId: 'STU-2026-005',
    registerNumber: '22BCA005',
    candidateName: 'Karan Reddy',
    email: 'karan.reddy@college.edu',
    department: 'Computer Applications',
    section: 'B',
    cgpa: 8.50,
    packageLPA: 24.0,
    hiringStage: 'HR Round',
    driveStatus: 'Ongoing',
    offerLetterStatus: 'Pending',
    activityLog: [
      { date: '2026-02-01 10:00', stage: 'Assigned', status: 'Completed', note: 'Assigned from BCA Sec B' },
      { date: '2026-02-05 14:00', stage: 'Aptitude Test', status: 'Passed Round', note: 'Cleared assessment' },
      { date: '2026-02-15 11:00', stage: 'Technical Interview', status: 'Passed Round', note: 'Full stack round cleared' },
      { date: '2026-02-25 15:00', stage: 'HR Round', status: 'Processing', note: 'Executive interview pending' },
    ],
    updatedAt: '2026-02-25',
  },
  {
    id: 'PIPE-006',
    driveId: 'DRV-2026-04',
    companyId: 'CMP-004',
    studentId: 'STU-2026-006',
    registerNumber: '22BCOM001',
    candidateName: 'Sneha Gupta',
    email: 'sneha.gupta@college.edu',
    department: 'Commerce',
    section: 'A',
    cgpa: 8.90,
    packageLPA: 9.5,
    hiringStage: 'Joined Company Request',
    driveStatus: 'Completed',
    offerLetterStatus: 'Joined',
    activityLog: [
      { date: '2026-01-15 10:00', stage: 'Assigned', status: 'Completed', note: 'Assigned to Deloitte' },
      { date: '2026-01-20 14:00', stage: 'Aptitude Test', status: 'Passed Round', note: 'Financial reasoning test passed' },
      { date: '2026-01-28 11:00', stage: 'Technical Interview', status: 'Passed Round', note: 'Audit modeling interview passed' },
      { date: '2026-02-05 16:00', stage: 'HR Round', status: 'Passed Round', note: 'HR approved' },
      { date: '2026-02-12 10:00', stage: 'Offer Letter Request', status: 'Completed', note: 'Offer letter signed' },
      { date: '2026-03-01 09:00', stage: 'Joined Company Request', status: 'Completed', note: 'Candidate joined training cohort' },
    ],
    updatedAt: '2026-03-01',
  },
];

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: MOCK_COMPANIES.map((c) => ({
        ...c,
        totalInterestedCount: c.totalInterestedCount || Math.floor(Math.random() * 30) + 40,
        avgPackage: c.avgPackage || Number(((c.packageRange.min + c.packageRange.max) / 2).toFixed(1)),
      })),
      drives: MOCK_DRIVES,
      pipelineCandidates: INITIAL_PIPELINE_CANDIDATES,
      recycleBin: [],
      selectedCompany: null,
      selectedDrive: null,
      searchQuery: '',
      selectedTier: '',

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTier: (selectedTier) => set({ selectedTier }),
      setSelectedCompany: (selectedCompany) =>
        set({
          selectedCompany: selectedCompany
            ? { ...selectedCompany, logo: getCompanyLogo(selectedCompany.name, selectedCompany.logo) }
            : null,
        }),
      setSelectedDrive: (selectedDrive) =>
        set({
          selectedDrive: selectedDrive
            ? { ...selectedDrive, companyLogo: getCompanyLogo(selectedDrive.companyName, selectedDrive.companyLogo) }
            : null,
        }),

      addCompany: (data) => {
        const id = `CMP-${String(get().companies.length + 1).padStart(3, '0')}`;
        const timestamp = new Date().toISOString().split('T')[0];
        const avg = data.avgPackage || Number(((data.packageRange.min + data.packageRange.max) / 2).toFixed(1));
        const newCompany: Company = {
          ...data,
          id,
          createdAt: timestamp,
          avgPackage: avg,
          totalInterestedCount: data.totalInterestedCount || 45,
          logo: getCompanyLogo(data.name, data.logo),
        };

        // Create default placement drive for the company
        const driveId = `DRV-2026-${String(get().drives.length + 1).padStart(2, '0')}`;
        const newDrive: PlacementDrive = {
          id: driveId,
          companyId: id,
          companyName: data.name,
          companyLogo: newCompany.logo,
          role: data.hiringRoles[0] || 'Associate Software Engineer',
          packageLPA: avg,
          driveDate: '2026-04-15',
          deadlineDate: '2026-04-05',
          venue: 'Auditorium & Virtual Interview Suites',
          status: 'Upcoming',
          currentRound: 'Aptitude Test',
          rounds: [
            { roundNumber: 1, name: 'Online Aptitude Test', date: '2026-04-15', mode: 'Online', totalShortlisted: 0 },
            { roundNumber: 2, name: 'Technical Interview', date: '2026-04-18', mode: 'Online', totalShortlisted: 0 },
            { roundNumber: 3, name: 'Partner HR Round', date: '2026-04-20', mode: 'Offline', totalShortlisted: 0 },
          ],
          eligibleDepartments: data.targetDepartments,
          eligibleCourses: data.eligibleCourses,
          minCgpa: data.minCgpa,
          totalRegistered: 0,
          totalShortlisted: 0,
          totalSelected: 0,
          jobDescription: data.description,
          skillsRequired: ['Core Fundamentals', 'Communication', 'Problem Solving'],
        };

        set((state) => ({
          companies: [newCompany, ...state.companies],
          drives: [newDrive, ...state.drives],
        }));
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updates,
                  logo: updates.logo !== undefined || updates.name !== undefined
                    ? getCompanyLogo(updates.name || c.name, updates.logo || c.logo)
                    : c.logo,
                }
              : c
          ),
          selectedCompany:
            state.selectedCompany?.id === id
              ? {
                  ...state.selectedCompany,
                  ...updates,
                  logo: updates.logo !== undefined || updates.name !== undefined
                    ? getCompanyLogo(updates.name || state.selectedCompany.name, updates.logo || state.selectedCompany.logo)
                    : state.selectedCompany.logo,
                }
              : state.selectedCompany,
        }));
      },

      deleteCompany: (id) => {
        const company = get().companies.find((c) => c.id === id);
        if (company) {
          const recycleItem: RecycleBinItem = {
            id: `TRASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            entityType: 'COMPANY',
            entityId: company.id,
            entityName: company.name,
            payload: company,
            deletedBy: 'System Administrator',
            deletedAt: new Date().toISOString(),
          };

          set((state) => ({
            companies: state.companies.filter((c) => c.id !== id),
            selectedCompany: state.selectedCompany?.id === id ? null : state.selectedCompany,
            recycleBin: [recycleItem, ...state.recycleBin],
          }));
        }
      },

      addDrive: (data) => {
        const id = `DRV-2026-${String(get().drives.length + 1).padStart(2, '0')}`;
        const newDrive: PlacementDrive = {
          ...data,
          id,
          companyLogo: getCompanyLogo(data.companyName, data.companyLogo),
        };
        set((state) => ({ drives: [newDrive, ...state.drives] }));
      },

      updateDrive: (id, updates) => {
        set((state) => ({
          drives: state.drives.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...updates,
                  companyLogo: updates.companyLogo !== undefined || updates.companyName !== undefined
                    ? getCompanyLogo(updates.companyName || d.companyName, updates.companyLogo || d.companyLogo)
                    : d.companyLogo,
                }
              : d
          ),
          selectedDrive:
            state.selectedDrive?.id === id
              ? {
                  ...state.selectedDrive,
                  ...updates,
                  companyLogo: updates.companyLogo !== undefined || updates.companyName !== undefined
                    ? getCompanyLogo(updates.companyName || state.selectedDrive.companyName, updates.companyLogo || state.selectedDrive.companyLogo)
                    : state.selectedDrive.companyLogo,
                }
              : state.selectedDrive,
        }));
      },

      deleteDrive: (id) => {
        set((state) => ({
          drives: state.drives.filter((d) => d.id !== id),
          selectedDrive: state.selectedDrive?.id === id ? null : state.selectedDrive,
        }));
      },

      assignStudentsToCompanyDrive: (companyId, driveId, studentIds, initialStage = 'Assigned') => {
        const now = new Date();
        const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
        const drive = get().drives.find((d) => d.id === driveId) || get().drives[0];
        const company = get().companies.find((c) => c.id === companyId) || get().companies[0];

        const newCandidates: CandidatePipelineItem[] = studentIds.map((studentId, idx) => {
          const id = `PIPE-${Date.now()}-${idx}`;
          return {
            id,
            driveId: drive?.id || driveId,
            companyId: company?.id || companyId,
            studentId,
            registerNumber: '', // Populated dynamically or matched
            candidateName: '',
            email: '',
            department: '',
            section: 'A',
            cgpa: 7.5,
            packageLPA: drive?.packageLPA || company?.avgPackage || 6.5,
            hiringStage: initialStage,
            driveStatus: 'Ongoing',
            offerLetterStatus: 'Pending',
            activityLog: [
              {
                date: dateStr,
                stage: initialStage,
                status: 'Processing',
                note: `Pushed into ${company?.name || 'Company'} Drive pipeline by Administrator.`,
              },
            ],
            notes: 'Candidate registered for recruitment drive',
            updatedAt: dateStr,
          };
        });

        // Filter out duplicates if already in pipeline
        set((state) => {
          const existingKeys = new Set(state.pipelineCandidates.map((c) => `${c.driveId}-${c.studentId}`));
          const filteredNew = newCandidates.filter((c) => !existingKeys.has(`${c.driveId}-${c.studentId}`));
          
          // Also bump company interested count
          const updatedCompanies = state.companies.map((c) =>
            c.id === companyId
              ? { ...c, totalInterestedCount: (c.totalInterestedCount || 0) + filteredNew.length }
              : c
          );

          return {
            pipelineCandidates: [...filteredNew, ...state.pipelineCandidates],
            companies: updatedCompanies,
          };
        });
      },

      updateCandidatePipelineStage: (candidateId, stage, status, packageLPA, offerLetterStatus, note) => {
        const now = new Date();
        const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

        set((state) => ({
          pipelineCandidates: state.pipelineCandidates.map((c) => {
            if (c.id === candidateId) {
              const newOfferStatus =
                offerLetterStatus ||
                (stage === 'Offer Letter Request' || stage === 'Selected'
                  ? 'Issued'
                  : stage === 'Joined Company Request'
                  ? 'Joined'
                  : stage === 'Rejected' || status === 'Failed or Rejected'
                  ? 'Rejected'
                  : c.offerLetterStatus);

              const activityEntry = {
                date: dateStr,
                stage,
                status,
                note: note || `Stage updated to ${stage} (${status})`,
              };

              return {
                ...c,
                hiringStage: stage,
                stageStatus: status,
                packageLPA: packageLPA !== undefined ? packageLPA : c.packageLPA,
                offerLetterStatus: newOfferStatus,
                activityLog: [activityEntry, ...(c.activityLog || [])],
                updatedAt: dateStr,
              };
            }
            return c;
          }),
        }));
      },

      restoreFromRecycleBin: (itemId) => {
        const item = get().recycleBin.find((i) => i.id === itemId);
        if (!item) return;

        if (item.entityType === 'COMPANY') {
          set((state) => ({
            companies: [item.payload as Company, ...state.companies],
            recycleBin: state.recycleBin.filter((i) => i.id !== itemId),
          }));
        } else {
          set((state) => ({
            recycleBin: state.recycleBin.filter((i) => i.id !== itemId),
          }));
        }
      },

      emptyRecycleBin: () => {
        set({ recycleBin: [] });
      },

      clearAllCompanies: () => {
        set({
          companies: [],
          drives: [],
          pipelineCandidates: [],
          selectedCompany: null,
          selectedDrive: null,
          searchQuery: '',
          selectedTier: '',
        });
      },
    }),
    {
      name: 'placement_pro_companies',
      version: 4,
      migrate: () => {
        return {
          companies: MOCK_COMPANIES,
          drives: MOCK_DRIVES,
          pipelineCandidates: INITIAL_PIPELINE_CANDIDATES,
          recycleBin: [],
          selectedCompany: null,
          selectedDrive: null,
          searchQuery: '',
          selectedTier: '',
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.companies)) {
            state.companies = sanitizeCompanies(state.companies);
          }
          if (Array.isArray(state.drives)) {
            state.drives = sanitizeDrives(state.drives);
          }
          if (!Array.isArray(state.pipelineCandidates) || state.pipelineCandidates.length === 0) {
            state.pipelineCandidates = INITIAL_PIPELINE_CANDIDATES;
          }
          if (!Array.isArray(state.recycleBin)) {
            state.recycleBin = [];
          }
        }
      },
    }
  )
);
