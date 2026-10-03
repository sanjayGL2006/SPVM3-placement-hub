import { useState, useMemo } from 'react';
import { useStudentStore } from '../stores/studentStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { StudentCard } from '../components/StudentCard';
import { StudentDrawer } from '../components/StudentDrawer';
import { AddEditStudentModal } from '../components/AddEditStudentModal';
import { ExcelImportModal } from '../components/ExcelImportModal';
import { BulkActionsBar } from '../components/BulkActionsBar';
import { AssignCandidateToDriveModal } from '../components/AssignCandidateToDriveModal';
import { FilterBar } from '../../../shared/components/FilterBar';
import { MasonryGrid } from '../../../shared/components/MasonryGrid';
import { DataTable, Column } from '../../../shared/components/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Student, PlacementStatus } from '../../../shared/types/student.types';
import { formatCurrency } from '../../../shared/utils/formatters';
import { exportStudentsToExcel, exportStudentsToCSV } from '../../../shared/utils/exportHelpers';
import {
  LayoutGrid,
  Table as TableIcon,
  UserPlus,
  Upload,
  Download,
  GraduationCap,
  Sparkles,
  Trash2,
  Edit,
  Eye,
  Briefcase,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentDirectoryPage = () => {
  const { user } = useAuthStore();
  const {
    students,
    selectedStudent,
    viewMode,
    selectedStudentIds,
    setViewMode,
    setSelectedStudent,
    toggleSelectStudentId,
    selectAllStudentIds,
    clearSelectedStudentIds,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    bulkUpdatePlacementStatus,
    importStudents,
  } = useStudentStore();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(
    (user?.role === 'hod' || user?.role === 'coordinator') && user.department ? user.department : 'All Departments'
  );
  const [course, setCourse] = useState('All Courses');
  const [status, setStatus] = useState('All Statuses');
  const [academicYear, setAcademicYear] = useState('2025-26');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAssignDriveOpen, setIsAssignDriveOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canEdit = user?.role !== 'faculty';
  const canDelete = user?.role === 'principal' || user?.role === 'hod';

  // Filter students based on role and filters
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

  const handleResetFilters = () => {
    setSearch('');
    if (user?.role !== 'hod' && user?.role !== 'coordinator') {
      setDepartment('All Departments');
    }
    setCourse('All Courses');
    setStatus('All Statuses');
  };

  const handleExportAll = () => {
    exportStudentsToExcel(filteredStudents, `Students_Cohort_${academicYear}.xlsx`);
    toast.success('Students exported to Excel successfully!');
  };

  const handleExportSelected = () => {
    const selected = students.filter((s) => selectedStudentIds.includes(s.id));
    exportStudentsToExcel(selected, `Selected_Students_${selected.length}.xlsx`);
    toast.success(`Exported ${selected.length} students to Excel.`);
  };

  // Columns definition for Table view (Line by line display)
  const tableColumns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (s) => (
        <div>
          <div className="font-bold text-stone-900 dark:text-stone-100">{s.name}</div>
          <div className="text-[11px] text-stone-400">{s.email}</div>
        </div>
      ),
    },
    {
      key: 'registerNumber',
      header: 'Register No',
      sortable: true,
      render: (s) => (
        <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">
          {s.registerNumber}
        </span>
      ),
    },
    {
      key: 'course',
      header: 'Course & Dept',
      sortable: true,
      render: (s) => (
        <div className="text-xs">
          <span className="font-semibold text-stone-800 dark:text-stone-200">{s.course}</span>
          <span className="text-stone-400 block text-[11px]">{s.department} · Sec {s.section}</span>
        </div>
      ),
    },
    {
      key: 'cgpa',
      header: 'CGPA',
      sortable: true,
      render: (s) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
          {s.academic.cgpa.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'company',
      header: 'Which Company / Placed',
      sortable: true,
      render: (s) => (
        <div className="text-xs">
          {s.placement.status === 'Placed' && s.placement.companyName ? (
            <div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                {s.placement.companyName}
              </div>
              {s.placement.packageLPA && (
                <div className="text-[11px] text-stone-500 font-medium">
                  {formatCurrency(s.placement.packageLPA)} CTC
                </div>
              )}
            </div>
          ) : s.placement.companyName ? (
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {s.placement.companyName}
            </span>
          ) : (
            <span className="text-stone-400 italic text-xs">Not Placed</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Process Status',
      sortable: true,
      render: (s) => (
        <Badge
          variant={
            s.placement.status === 'Placed'
              ? 'success'
              : s.placement.status === 'In Process'
              ? 'warning'
              : s.placement.status === 'Eligible'
              ? 'info'
              : 'neutral'
          }
          size="sm"
        >
          {s.placement.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedStudent(s)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canEdit && (
            <button
              onClick={() => {
                setStudentToEdit(s);
                setIsAddEditOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center gap-1 transition-colors"
              title="Update Student Account"
            >
              <Edit className="w-3.5 h-3.5" />
              Update
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteTargetId(s.id)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200/80 dark:border-red-800/60 flex items-center gap-1 transition-colors"
              title="Delete Student Account"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Accounts & Directory ({filteredStudents.length} Students)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Student Placement Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Manage student register numbers, CGPA, recruitment process status, and placed company details.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex items-center gap-1 border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Line Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'masonry'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            pill
            onClick={handleExportAll}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>

          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                pill
                onClick={() => setIsImportOpen(true)}
                leftIcon={<Upload className="w-3.5 h-3.5" />}
              >
                Import
              </Button>

              <Button
                variant="primary"
                size="sm"
                pill
                onClick={() => {
                  setStudentToEdit(null);
                  setIsAddEditOpen(true);
                }}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                className="font-bold shadow-md hover:shadow-lg"
              >
                Create New Account
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
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

      {/* Active Selection Top Action Bar */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/60 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs animate-slide-up shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0"></span>
            <div>
              <span className="font-extrabold text-sm text-indigo-950 dark:text-indigo-100">
                {selectedStudentIds.length === 1
                  ? '1 Student Selected'
                  : `${selectedStudentIds.length} Students Selected`}
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Execute bulk actions across selected candidate profiles
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Company Drive Button */}
            <Button
              variant="primary"
              size="sm"
              pill
              onClick={() => setIsAssignDriveOpen(true)}
              leftIcon={<Briefcase className="w-3.5 h-3.5" />}
              className="font-bold shadow-sm hover:shadow-md"
            >
              Company Drive
            </Button>

            {/* 2. Download Excel Button */}
            <Button
              variant="outline"
              size="sm"
              pill
              onClick={handleExportSelected}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="bg-white dark:bg-stone-900 font-semibold"
            >
              Download Excel
            </Button>

            {/* 3. Bulk Delete Button */}
            {canDelete && (
              <Button
                variant="danger"
                size="sm"
                pill
                onClick={() => {
                  bulkDeleteStudents(selectedStudentIds);
                  toast.success(`Moved ${selectedStudentIds.length} students to Recycle Bin`);
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Bulk Delete
              </Button>
            )}

            <button
              onClick={clearSelectedStudentIds}
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors ml-1"
              title="Deselect All"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Student Directory Display */}
      {filteredStudents.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1C1C1C] rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
          <GraduationCap className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No students matching your filter criteria
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Try resetting your department or status filters to view the full cohort.
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" pill onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      ) : viewMode === 'masonry' ? (
        /* Pinterest Masonry Grid */
        <MasonryGrid>
          {filteredStudents.map((stu) => (
            <StudentCard
              key={stu.id}
              student={stu}
              isSelected={selectedStudentIds.includes(stu.id)}
              onSelect={toggleSelectStudentId}
              onView={(s) => setSelectedStudent(s)}
              onEdit={(s) => {
                setStudentToEdit(s);
                setIsAddEditOpen(true);
              }}
              onDelete={(id) => setDeleteTargetId(id)}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))}
        </MasonryGrid>
      ) : (
        /* Dense Data Table View */
        <DataTable
          data={filteredStudents}
          columns={tableColumns}
          keyExtractor={(s) => s.id}
          selectedIds={selectedStudentIds}
          onSelectRow={toggleSelectStudentId}
          onSelectAll={selectAllStudentIds}
          onRowClick={(s) => setSelectedStudent(s)}
          pageSize={12}
        />
      )}

      {/* Student Slide-Over Detail Drawer */}
      <StudentDrawer
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={(s) => {
          setStudentToEdit(s);
          setIsAddEditOpen(true);
        }}
        canEdit={canEdit}
      />

      {/* Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={(data) => {
          if (studentToEdit) {
            updateStudent(studentToEdit.id, data);
            toast.success('Student profile updated successfully!');
          } else {
            addStudent(data);
            toast.success('New student added to cohort!');
          }
        }}
        studentToEdit={studentToEdit}
      />

      {/* Excel / CSV Import Modal */}
      <ExcelImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(imported) => {
          const res = importStudents(imported);
          return res;
        }}
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteStudent(deleteTargetId);
            toast.success('Student record deleted');
            setDeleteTargetId(null);
          }
        }}
        title="Delete Student Record?"
        message="Are you sure you want to delete this student? All placement applications and history will be permanently deleted."
        confirmText="Delete"
        variant="danger"
      />

      {/* Bulk Floating Actions Toolbar */}
      <BulkActionsBar
        selectedCount={selectedStudentIds.length}
        onClearSelection={clearSelectedStudentIds}
        onBulkDelete={() => {
          bulkDeleteStudents(selectedStudentIds);
          toast.success(`Deleted ${selectedStudentIds.length} students`);
        }}
        onBulkStatusUpdate={(stat, comp, pkg) => {
          bulkUpdatePlacementStatus(selectedStudentIds, stat, comp, pkg);
          toast.success(`Updated status for ${selectedStudentIds.length} students`);
        }}
        onAssignToDrive={() => setIsAssignDriveOpen(true)}
        onBulkExport={handleExportSelected}
      />
      <AssignCandidateToDriveModal
        isOpen={isAssignDriveOpen}
        onClose={() => setIsAssignDriveOpen(false)}
        selectedStudentIds={selectedStudentIds}
      />
    </div>
  );
};
