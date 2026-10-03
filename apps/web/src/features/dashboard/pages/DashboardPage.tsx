import { useState, useMemo } from 'react';
import { useAuthStore } from '../../auth/stores/authStore';
import { useStudentStore } from '../../students/stores/studentStore';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { KpiCards } from '../components/KpiCards';
import { PlacementChart } from '../components/PlacementChart';
import { CompanyHiringChart } from '../components/CompanyHiringChart';
import { RecentActivity } from '../components/RecentActivity';
import { UpcomingDrives } from '../components/UpcomingDrives';
import { PlacementCalendar } from '../components/PlacementCalendar';
import { StudentDashboardView } from '../components/StudentDashboardView';
import { FilterBar } from '../../../shared/components/FilterBar';
import { Button } from '../../../shared/components/ui/Button';
import { Plus, UserPlus, Building, Briefcase, Sparkles, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportStudentsToExcel } from '../../../shared/utils/exportHelpers';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { students } = useStudentStore();
  const { companies, drives } = useCompanyStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(
    (user?.role === 'hod' || user?.role === 'coordinator') && user.department ? user.department : 'All Departments'
  );
  const [course, setCourse] = useState('All Courses');
  const [status, setStatus] = useState('All Statuses');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [fabOpen, setFabOpen] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    if (user?.role !== 'hod' && user?.role !== 'coordinator') {
      setDepartment('All Departments');
    }
    setCourse('All Courses');
    setStatus('All Statuses');
  };

  // Filter students based on role and active filters
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Department isolation
      if (user?.role === 'hod' || user?.role === 'coordinator') {
        if (user.department && s.department !== user.department) return false;
      }

      if (department !== 'All Departments' && s.department !== department) return false;
      if (course !== 'All Courses' && s.course !== course) return false;
      if (status !== 'All Statuses' && s.placement.status !== status) return false;

      if (search) {
        const query = search.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesReg = s.registerNumber.toLowerCase().includes(query);
        const matchesSkills = s.skills.some((sk) => sk.toLowerCase().includes(query));
        if (!matchesName && !matchesReg && !matchesSkills) return false;
      }

      return true;
    });
  }, [students, user, department, course, status, search]);

  const handleExport = () => {
    exportStudentsToExcel(filteredStudents, `Placement_Metrics_${academicYear}.xlsx`);
    toast.success('Placement dataset exported to Excel successfully!');
  };

  // If Student role, render tailored Student Dashboard
  if (user?.role === 'student') {
    return <StudentDashboardView currentUser={user} />;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Banner with Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            {user?.department ? `${user.department} Portal` : 'Campus-Wide Overview'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Placement Operations & Executive Insights
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Real-time analytics for Academic Year {academicYear} cohort
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => navigate('/students')}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Manage Students
          </Button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        course={course}
        onCourseChange={setCourse}
        status={status}
        onStatusChange={setStatus}
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        onReset={handleResetFilters}
      />

      {/* KPI Cards Grid */}
      <KpiCards students={filteredStudents} companies={companies} />

      {/* Visual Analytics Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlacementChart />
        <CompanyHiringChart students={filteredStudents} />
      </div>

      {/* Bottom Section: Placement Calendar & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlacementCalendar drives={drives} />
        <RecentActivity />
      </div>

      {/* Floating Action Button (FAB) for quick operations */}
      <div className="fixed bottom-6 left-6 z-30 hidden md:block">
        <div className="relative">
          {fabOpen && (
            <div className="absolute bottom-16 left-0 bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-2 space-y-1 w-48 animate-slide-up">
              <button
                onClick={() => {
                  setFabOpen(false);
                  navigate('/students');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <UserPlus className="w-4 h-4 text-indigo-500" />
                Add Student
              </button>
              <button
                onClick={() => {
                  setFabOpen(false);
                  navigate('/companies');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Building className="w-4 h-4 text-emerald-500" />
                Add Company
              </button>
              <button
                onClick={() => {
                  setFabOpen(false);
                  navigate('/placements');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <Briefcase className="w-4 h-4 text-amber-500" />
                Schedule Drive
              </button>

            </div>
          )}

          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="p-3.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 shadow-xl hover:scale-105 transition-all flex items-center justify-center"
            title="Quick Operations"
          >
            <Plus className={`w-5 h-5 transition-transform ${fabOpen ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
