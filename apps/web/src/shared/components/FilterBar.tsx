import { Search, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../features/auth/stores/authStore';
import { Button } from './ui/Button';

export interface FilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  department: string;
  onDepartmentChange: (dept: string) => void;
  course: string;
  onCourseChange: (course: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  academicYear?: string;
  onAcademicYearChange?: (year: string) => void;
  placeholder?: string;
}

const DEPARTMENTS = [
  'All Departments',
  'Computer Applications',
  'Business Administration',
  'Commerce',
  'Science',
  'Hotel Management',
];

const COURSES_BY_DEPT: Record<string, string[]> = {
  'Computer Applications': ['BCA'],
  'Business Administration': ['BBA'],
  'Commerce': ['B.Com'],
  'Science': ['B.Sc Computer Science'],
  'Hotel Management': ['BBA Hotel Management'],
};

const PLACEMENT_STATUSES = [
  'All Statuses',
  'Placed',
  'In Process',
  'Eligible',
  'Opted Out',
  'Not Eligible',
];

export const FilterBar = ({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  course,
  onCourseChange,
  status,
  onStatusChange,
  onReset,
  academicYear = '2025-26',
  onAcademicYearChange,
  placeholder = 'Search by student name, reg no, or skills...',
}: FilterBarProps) => {
  const { user } = useAuthStore();
  const isDeptLocked = (user?.role === 'hod' || user?.role === 'coordinator') && !!user.department;

  // Available courses based on selected department
  const availableCourses = department && department !== 'All Departments'
    ? COURSES_BY_DEPT[department] || []
    : ['All Courses', 'BCA', 'BBA', 'B.Com', 'B.Sc Computer Science', 'BBA Hotel Management'];

  return (
    <div className="w-full bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search input with pill styling */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full pl-10 pr-4 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Cascading Filter Selects */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        {/* Department */}
        <select
          value={isDeptLocked ? user.department : department || 'All Departments'}
          onChange={(e) => {
            onDepartmentChange(e.target.value);
            onCourseChange('All Courses');
          }}
          disabled={isDeptLocked}
          className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Course */}
        <select
          value={course || 'All Courses'}
          onChange={(e) => onCourseChange(e.target.value)}
          className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {availableCourses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Placement Status */}
        <select
          value={status || 'All Statuses'}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {PLACEMENT_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Academic Year */}
        {onAcademicYearChange && (
          <select
            value={academicYear}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
            <option value="2023-24">AY 2023-24</option>
          </select>
        )}

        {/* Reset Filter Button */}
        <Button
          variant="ghost"
          size="sm"
          pill
          onClick={onReset}
          className="text-stone-500 hover:text-stone-700 p-2"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
