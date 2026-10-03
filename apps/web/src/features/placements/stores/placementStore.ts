import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';
import { PlacementApplication, InterviewSchedule, ApplicationStage } from '../../../shared/types/placement.types';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';

interface PlacementState {
  applications: PlacementApplication[];
  interviews: InterviewSchedule[];
  selectedStage: string;
  searchQuery: string;

  setSelectedStage: (stage: string) => void;
  setSearchQuery: (query: string) => void;

  updateApplicationStage: (id: string, stage: ApplicationStage, notes?: string) => void;
  addApplication: (app: Omit<PlacementApplication, 'id' | 'updatedAt'>) => void;
  deleteApplication: (id: string) => void;

  scheduleInterview: (interview: Omit<InterviewSchedule, 'id'>) => void;
  updateInterviewStatus: (id: string, status: InterviewSchedule['status']) => void;
  deleteInterview: (id: string) => void;
  clearAllPlacements: () => void;
}

const sanitizeApplications = (apps: PlacementApplication[]): PlacementApplication[] => {
  return apps.map((a) => ({
    ...a,
    companyLogo: getCompanyLogo(a.companyName, a.companyLogo),
  }));
};

const sanitizeInterviews = (ints: InterviewSchedule[]): InterviewSchedule[] => {
  return ints.map((i) => ({
    ...i,
    companyLogo: getCompanyLogo(i.companyName, i.companyLogo),
  }));
};

export const usePlacementStore = create<PlacementState>()(
  persist(
    (set, get) => ({
      applications: [],
      interviews: [],
      selectedStage: 'All',
      searchQuery: '',

      setSelectedStage: (selectedStage) => set({ selectedStage }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      updateApplicationStage: (id, stage, notes) => {
        const timestamp = new Date().toISOString().split('T')[0];

        // Trigger celebratory confetti if placed or offered
        if (stage === 'Placed' || stage === 'Offered') {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6'],
          });
        }

        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? {
                  ...app,
                  stage,
                  statusNotes: notes || app.statusNotes,
                  updatedAt: timestamp,
                }
              : app
          ),
        }));
      },

      addApplication: (appData) => {
        const id = `APP-2026-${String(get().applications.length + 1).padStart(3, '0')}`;
        const timestamp = new Date().toISOString().split('T')[0];
        const newApp: PlacementApplication = {
          ...appData,
          id,
          companyLogo: getCompanyLogo(appData.companyName, appData.companyLogo),
          updatedAt: timestamp,
        };
        set((state) => ({ applications: [newApp, ...state.applications] }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((a) => a.id !== id),
        }));
      },

      scheduleInterview: (interviewData) => {
        const id = `INT-2026-${String(get().interviews.length + 1).padStart(3, '0')}`;
        const newInt: InterviewSchedule = {
          ...interviewData,
          id,
          companyLogo: getCompanyLogo(interviewData.companyName, interviewData.companyLogo),
        };
        set((state) => ({ interviews: [newInt, ...state.interviews] }));
      },

      updateInterviewStatus: (id, status) => {
        set((state) => ({
          interviews: state.interviews.map((i) => (i.id === id ? { ...i, status } : i)),
        }));
      },

      deleteInterview: (id) => {
        set((state) => ({
          interviews: state.interviews.filter((i) => i.id !== id),
        }));
      },

      clearAllPlacements: () => {
        set({
          applications: [],
          interviews: [],
          selectedStage: 'All',
          searchQuery: '',
        });
      },
    }),
    {
      name: 'placement_pro_placements',
      version: 3,
      migrate: () => {
        return { applications: [], interviews: [], selectedStage: 'All', searchQuery: '' };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.applications)) {
            state.applications = sanitizeApplications(state.applications);
          }
          if (Array.isArray(state.interviews)) {
            state.interviews = sanitizeInterviews(state.interviews);
          }
        }
      },
    }
  )
);
