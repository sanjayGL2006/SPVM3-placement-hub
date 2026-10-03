import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, StudentFilterParams, PlacementStatus } from '../../../shared/types/student.types';
import { MOCK_STUDENTS } from '../../../shared/utils/mockData';

export interface StudentRecycleBinItem {
  id: string;
  student: Student;
  deletedAt: string;
  deletedBy: string;
}

interface StudentState {
  students: Student[];
  selectedStudent: Student | null;
  filters: StudentFilterParams;
  viewMode: 'masonry' | 'table';
  selectedStudentIds: string[];
  recycleBin: StudentRecycleBinItem[];
  
  // Actions
  setFilters: (filters: Partial<StudentFilterParams>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'masonry' | 'table') => void;
  setSelectedStudent: (student: Student | null) => void;
  toggleSelectStudentId: (id: string) => void;
  selectAllStudentIds: (ids: string[]) => void;
  clearSelectedStudentIds: () => void;
  
  // CRUD
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  bulkDeleteStudents: (ids: string[]) => void;
  restoreStudent: (id: string) => void;
  emptyRecycleBin: () => void;
  bulkUpdatePlacementStatus: (ids: string[], status: PlacementStatus, companyName?: string, packageLPA?: number) => void;
  importStudents: (newStudentsData: Partial<Student>[]) => { added: number; errors: string[] };
  clearAllStudents: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: MOCK_STUDENTS,
      selectedStudent: null,
      filters: {
        search: '',
        department: '',
        course: '',
        section: '',
        academicYear: '2025-26',
        placementStatus: '',
        minCgpa: 0,
        maxCgpa: 10,
        hasBacklogs: false,
      },
      viewMode: 'table',
      selectedStudentIds: [],
      recycleBin: [],

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({
          filters: {
            search: '',
            department: '',
            course: '',
            section: '',
            academicYear: '2025-26',
            placementStatus: '',
            minCgpa: 0,
            maxCgpa: 10,
            hasBacklogs: false,
          },
        });
      },

      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedStudent: (student) => set({ selectedStudent: student }),

      toggleSelectStudentId: (id) => {
        set((state) => {
          const exists = state.selectedStudentIds.includes(id);
          return {
            selectedStudentIds: exists
              ? state.selectedStudentIds.filter((item) => item !== id)
              : [...state.selectedStudentIds, id],
          };
        });
      },

      selectAllStudentIds: (ids) => set({ selectedStudentIds: ids }),
      clearSelectedStudentIds: () => set({ selectedStudentIds: [] }),

      addStudent: (newStudentData) => {
        const id = `STU-2026-${String(get().students.length + 1).padStart(3, '0')}`;
        const timestamp = new Date().toISOString().split('T')[0];
        const student: Student = {
          ...newStudentData,
          id,
          createdAt: timestamp,
          updatedAt: timestamp,
        } as Student;

        set((state) => ({
          students: [student, ...state.students],
        }));
      },

      updateStudent: (id, updates) => {
        const timestamp = new Date().toISOString().split('T')[0];
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: timestamp } : s
          ),
          selectedStudent:
            state.selectedStudent?.id === id
              ? { ...state.selectedStudent, ...updates, updatedAt: timestamp }
              : state.selectedStudent,
        }));
      },

      deleteStudent: (id) => {
        const student = get().students.find((s) => s.id === id);
        if (student) {
          const trashItem: StudentRecycleBinItem = {
            id: `TRASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            student,
            deletedAt: new Date().toISOString(),
            deletedBy: 'Administrator',
          };
          set((state) => ({
            students: state.students.filter((s) => s.id !== id),
            selectedStudent: state.selectedStudent?.id === id ? null : state.selectedStudent,
            selectedStudentIds: state.selectedStudentIds.filter((item) => item !== id),
            recycleBin: [trashItem, ...state.recycleBin],
          }));
        }
      },

      bulkDeleteStudents: (ids) => {
        const deletedStudents = get().students.filter((s) => ids.includes(s.id));
        const timestamp = new Date().toISOString();
        const trashItems: StudentRecycleBinItem[] = deletedStudents.map((student, idx) => ({
          id: `TRASH-${Date.now()}-${idx}`,
          student,
          deletedAt: timestamp,
          deletedBy: 'Administrator',
        }));

        set((state) => ({
          students: state.students.filter((s) => !ids.includes(s.id)),
          selectedStudentIds: [],
          recycleBin: [...trashItems, ...state.recycleBin],
        }));
      },

      restoreStudent: (trashId) => {
        const item = get().recycleBin.find((i) => i.id === trashId);
        if (item) {
          set((state) => ({
            students: [item.student, ...state.students],
            recycleBin: state.recycleBin.filter((i) => i.id !== trashId),
          }));
        }
      },

      emptyRecycleBin: () => {
        set({ recycleBin: [] });
      },

      bulkUpdatePlacementStatus: (ids, status, companyName, packageLPA) => {
        const timestamp = new Date().toISOString().split('T')[0];
        set((state) => ({
          students: state.students.map((s) => {
            if (ids.includes(s.id)) {
              return {
                ...s,
                updatedAt: timestamp,
                placement: {
                  ...s.placement,
                  status,
                  companyName: companyName || s.placement.companyName,
                  packageLPA: packageLPA !== undefined ? packageLPA : s.placement.packageLPA,
                  offerDate: status === 'Placed' ? timestamp : s.placement.offerDate,
                },
              };
            }
            return s;
          }),
          selectedStudentIds: [],
        }));
      },

      importStudents: (newStudentsData: Partial<Student>[]) => {
        const currentCount = get().students.length;
        const timestamp = new Date().toISOString().split('T')[0];
        const errors: string[] = [];
        const addedStudents: Student[] = [];

        newStudentsData.forEach((item, index) => {
          if (!item.name || !item.email || !item.department || !item.course) {
            errors.push(`Row ${index + 1}: Missing required student fields`);
            return;
          }

          const reg = item.registerNumber || `22${item.course?.substring(0, 3).toUpperCase()}${String(currentCount + index + 1).padStart(3, '0')}`;
          const newStudent: Student = {
            id: `STU-2026-${String(currentCount + index + 1).padStart(3, '0')}`,
            registerNumber: reg,
            name: item.name,
            email: item.email,
            phone: item.phone || '+91 98000 00000',
            gender: item.gender || 'Male',
            department: item.department || 'Computer Applications',
            course: item.course || 'BCA',
            section: item.section || 'A',
            batch: item.batch || '2022-2026',
            academicYear: item.academicYear || '2025-26',
            academic: {
              tenthPercentage: item.academic?.tenthPercentage || 80,
              twelfthPercentage: item.academic?.twelfthPercentage || 80,
              cgpa: item.academic?.cgpa || 7.5,
              activeBacklogs: item.academic?.activeBacklogs || 0,
              clearedBacklogs: item.academic?.clearedBacklogs || 0,
              semesterScores: item.academic?.semesterScores || [
                { semester: 1, sgpa: 7.5 }, { semester: 2, sgpa: 7.5 }
              ],
            },
            placement: {
              status: item.placement?.status || 'Eligible',
              companyName: item.placement?.companyName,
              packageLPA: item.placement?.packageLPA,
              appliedCount: item.placement?.appliedCount || 0,
              interviewsCount: item.placement?.interviewsCount || 0,
              offersCount: item.placement?.offersCount || 0,
            },
            skills: item.skills || ['Core Fundamentals', 'Communication'],
            certifications: item.certifications || [],
            projects: item.projects || [],
            timeline: [{ date: timestamp, title: 'Imported Profile', description: 'Record created via bulk import.', type: 'academic' }],
            createdAt: timestamp,
            updatedAt: timestamp,
          };
          addedStudents.push(newStudent);
        });

        if (addedStudents.length > 0) {
          set((state) => ({
            students: [...addedStudents, ...state.students],
          }));
        }

        return { added: addedStudents.length, errors };
      },

      clearAllStudents: () => {
        set({
          students: [],
          selectedStudent: null,
          selectedStudentIds: [],
          recycleBin: [],
        });
      },

    }),
    {
      name: 'placement_pro_students',
      version: 3,
      migrate: () => {
        return {
          students: MOCK_STUDENTS,
          selectedStudent: null,
          selectedStudentIds: [],
          recycleBin: [],
          viewMode: 'table' as const,
          filters: { search: '', department: '', course: '', section: '', academicYear: '2025-26', placementStatus: '', minCgpa: 0, maxCgpa: 10, hasBacklogs: false }
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!Array.isArray(state.students) || state.students.length === 0) {
            state.students = MOCK_STUDENTS;
          }
          if (!Array.isArray(state.recycleBin)) {
            state.recycleBin = [];
          }
        }
      },
    }
  )
);
