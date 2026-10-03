import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../stores/companyStore';
import { useStudentStore } from '../../students/stores/studentStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { CandidatePipelineItem, PipelineStage, PipelineStatus } from '../../../shared/types/company.types';
import { UpdateCandidateStageModal } from '../components/UpdateCandidateStageModal';
import { AssignCandidateToDriveModal } from '../../students/components/AssignCandidateToDriveModal';
import { DataTable, Column } from '../../../shared/components/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import { formatCurrency } from '../../../shared/utils/formatters';
import {
  ArrowLeft,
  Building2,
  Users,
  Trash2,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Briefcase,
  Award,
  Layers,
  Sparkles,
  Edit,
  Download,
  Calendar,
  Eye,
  FileCheck,
} from 'lucide-react';
import { exportStudentsToExcel } from '../../../shared/utils/exportHelpers';
import toast from 'react-hot-toast';

export const CompanyDriveDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    companies,
    drives,
    pipelineCandidates,
    deleteCompany,
    updateCandidatePipelineStage,
  } = useCompanyStore();
  const { students } = useStudentStore();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('All');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [candidateToUpdate, setCandidateToUpdate] = useState<CandidatePipelineItem | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCandidatesIds, setSelectedCandidatesIds] = useState<string[]>([]);

  // Match company and drive
  const company = companies.find((c) => c.id === id) || companies[0];
  const drive = drives.find((d) => d.companyId === company?.id || d.companyName === company?.name) || drives[0];

  const canManage = user?.role === 'principal' || user?.role === 'hod' || user?.role === 'coordinator';
  const canDelete = user?.role === 'principal';

  // Build unified roster for this company/drive
  const companyRoster = useMemo(() => {
    if (!company) return [];

    // Filter pipeline candidates belonging to this company/drive
    const directMatches = pipelineCandidates.filter(
      (c) => c.companyId === company.id || c.driveId === drive?.id
    );

    // Enrich with student master records if missing fields
    return directMatches.map((c) => {
      const studentMaster = students.find((s) => s.id === c.studentId || s.registerNumber === c.registerNumber);
      return {
        ...c,
        registerNumber: c.registerNumber || studentMaster?.registerNumber || '22BCA099',
        candidateName: c.candidateName || studentMaster?.name || 'Student Candidate',
        email: c.email || studentMaster?.email || 'student@college.edu',
        department: c.department || studentMaster?.department || 'Computer Applications',
        section: c.section || studentMaster?.section || 'A',
        cgpa: c.cgpa || studentMaster?.academic.cgpa || 7.5,
        packageLPA: c.packageLPA || drive?.packageLPA || company?.avgPackage || 6.5,
      };
    });
  }, [company, drive, pipelineCandidates, students]);

  // Dynamic Stage Counts
  const stageCounts = useMemo(() => {
    const counts = {
      interested: company?.totalInterestedCount || 45,
      assigned: companyRoster.length,
      aptitude: companyRoster.filter((c) => c.hiringStage === 'Aptitude Test').length,
      technical: companyRoster.filter((c) => c.hiringStage === 'Technical Interview').length,
      hr: companyRoster.filter((c) => c.hiringStage === 'HR Round').length,
      selected: companyRoster.filter((c) => c.hiringStage === 'Selected' || c.hiringStage === 'IR').length,
      rejected: companyRoster.filter((c) => c.hiringStage === 'Rejected' || c.offerLetterStatus === 'Rejected').length,
      offer_given: companyRoster.filter((c) => c.hiringStage === 'Offer Letter Request' || c.offerLetterStatus === 'Issued').length,
      joined: companyRoster.filter((c) => c.hiringStage === 'Joined Company Request' || c.offerLetterStatus === 'Joined').length,
    };
    return counts;
  }, [company, companyRoster]);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return companyRoster.filter((cand) => {
      if (activeStageFilter !== 'All') {
        if (activeStageFilter === 'Interested' && cand.hiringStage !== 'Interested') return false;
        if (activeStageFilter === 'Assigned' && cand.hiringStage !== 'Assigned') return false;
        if (activeStageFilter === 'Aptitude' && cand.hiringStage !== 'Aptitude Test') return false;
        if (activeStageFilter === 'Technical' && cand.hiringStage !== 'Technical Interview') return false;
        if (activeStageFilter === 'HR' && cand.hiringStage !== 'HR Round') return false;
        if (activeStageFilter === 'Selected' && !['Selected', 'IR'].includes(cand.hiringStage)) return false;
        if (activeStageFilter === 'Rejected' && cand.hiringStage !== 'Rejected' && cand.offerLetterStatus !== 'Rejected') return false;
        if (activeStageFilter === 'Offer' && cand.hiringStage !== 'Offer Letter Request' && cand.offerLetterStatus !== 'Issued') return false;
        if (activeStageFilter === 'Joined' && cand.hiringStage !== 'Joined Company Request' && cand.offerLetterStatus !== 'Joined') return false;
      }

      if (selectedSectionFilter !== 'All' && cand.section !== selectedSectionFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const mName = cand.candidateName.toLowerCase().includes(q);
        const mReg = cand.registerNumber.toLowerCase().includes(q);
        const mEmail = cand.email.toLowerCase().includes(q);
        const mDept = cand.department.toLowerCase().includes(q);
        if (!mName && !mReg && !mEmail && !mDept) return false;
      }

      return true;
    });
  }, [companyRoster, activeStageFilter, selectedSectionFilter, searchQuery]);

  const handleExportRoster = () => {
    const studentRecords = students.filter((s) =>
      filteredRoster.some((r) => r.studentId === s.id || r.registerNumber === s.registerNumber)
    );
    exportStudentsToExcel(studentRecords.length > 0 ? studentRecords : students.slice(0, 10), `${company?.name || 'Company'}_Drive_Roster.xlsx`);
    toast.success(`Exported ${filteredRoster.length} candidate records to Excel`);
  };

  const tableColumns: Column<CandidatePipelineItem>[] = [
    {
      key: 'registerNumber',
      header: 'Register No',
      sortable: true,
      render: (c) => (
        <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
          {c.registerNumber}
        </span>
      ),
    },
    {
      key: 'candidateName',
      header: 'Candidate Name',
      sortable: true,
      render: (c) => (
        <div>
          <div className="font-bold text-stone-900 dark:text-stone-100">{c.candidateName}</div>
          <div className="text-[11px] text-stone-400">{c.email}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Dept & Section',
      sortable: true,
      render: (c) => (
        <div className="text-xs">
          <span className="font-semibold text-stone-800 dark:text-stone-200">{c.department}</span>
          <span className="text-stone-400 block text-[11px]">Section {c.section} · {c.cgpa} CGPA</span>
        </div>
      ),
    },
    {
      key: 'packageLPA',
      header: 'Package',
      sortable: true,
      render: (c) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
          ₹{c.packageLPA} LPA
        </span>
      ),
    },
    {
      key: 'hiringStage',
      header: 'Hiring Stage',
      sortable: true,
      render: (c) => (
        <Badge
          variant={
            c.hiringStage === 'Selected' || c.hiringStage === 'Joined Company Request'
              ? 'success'
              : c.hiringStage === 'Offer Letter Request'
              ? 'primary'
              : c.hiringStage === 'Rejected'
              ? 'danger'
              : 'warning'
          }
          size="sm"
        >
          {c.hiringStage}
        </Badge>
      ),
    },
    {
      key: 'driveStatus',
      header: 'Drive Status',
      render: (c) => (
        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
          {c.driveStatus || 'Ongoing'}
        </span>
      ),
    },
    {
      key: 'offerLetterStatus',
      header: 'Offer Letter',
      sortable: true,
      render: (c) => (
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
            c.offerLetterStatus === 'Issued' || c.offerLetterStatus === 'Accepted'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
              : c.offerLetterStatus === 'Joined'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
              : c.offerLetterStatus === 'Rejected'
              ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
              : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
          }`}
        >
          {c.offerLetterStatus}
        </span>
      ),
    },
    {
      key: 'activityLog',
      header: 'Pipeline Activity',
      render: (c) => (
        <div className="text-[11px] text-stone-500 max-w-xs truncate" title={c.activityLog?.[0]?.note || 'Profile in evaluation'}>
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {c.activityLog?.[0]?.stage || c.hiringStage}:
          </span>{' '}
          {c.activityLog?.[0]?.note || 'Under evaluation'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {canManage && (
            <button
              onClick={() => {
                setCandidateToUpdate(c);
                setIsUpdateModalOpen(true);
              }}
              className="px-3 py-1 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center gap-1 transition-all"
              title="Update candidate pipeline status"
            >
              <Edit className="w-3.5 h-3.5" />
              Update
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!company) {
    return (
      <div className="py-16 text-center space-y-3">
        <h2 className="text-xl font-bold">Company drive not found</h2>
        <Button variant="outline" size="sm" pill onClick={() => navigate('/companies')}>
          Return to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Navigation & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1C1C1C] rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <button
            onClick={() => navigate('/companies')}
            className="p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            title="Back to Company Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src={getCompanyLogo(company.name, company.logo)}
              alt={company.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCompanyLogo(company.name);
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                {company.name}
              </h1>
              <Badge variant="primary" size="sm">
                {company.tier.split('(')[0].trim()}
              </Badge>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                Avg ₹{company.avgPackage || 6.5} LPA
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {company.industry} · {drive?.role || 'Associate Software Engineer'} · Cutoff: {company.minCgpa} CGPA
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={handleExportRoster}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Roster
          </Button>

          {canManage && (
            <Button
              variant="primary"
              size="sm"
              pill
              onClick={() => setIsAssignModalOpen(true)}
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              className="font-bold shadow-md hover:shadow-lg"
            >
              Assign New Candidates
            </Button>
          )}

          {canDelete && (
            <Button
              variant="danger"
              size="sm"
              pill
              onClick={() => setDeleteConfirmOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Company
            </Button>
          )}
        </div>
      </div>

      {/* Summary Metrics / Stages Interactive Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Recruitment Funnel & Live Stage Counts
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Click any stage to filter candidate roster
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {[
            { id: 'Interested', label: 'Interested Students', count: stageCounts.interested, color: 'border-stone-200 text-stone-800' },
            { id: 'Assigned', label: 'Assigned Students', count: stageCounts.assigned, color: 'border-indigo-200 text-indigo-600' },
            { id: 'Aptitude', label: 'Aptitude Attended', count: stageCounts.aptitude, color: 'border-amber-200 text-amber-600' },
            { id: 'Technical', label: 'Technical Round', count: stageCounts.technical, color: 'border-purple-200 text-purple-600' },
            { id: 'HR', label: 'HR Round Attended', count: stageCounts.hr, color: 'border-blue-200 text-blue-600' },
            { id: 'Selected', label: 'Selected Students', count: stageCounts.selected, color: 'border-emerald-200 text-emerald-600' },
            { id: 'Rejected', label: 'Rejected Students', count: stageCounts.rejected, color: 'border-red-200 text-red-600' },
            { id: 'Offer', label: 'Offer Letter Given', count: stageCounts.offer_given, color: 'border-teal-200 text-teal-600' },
            { id: 'Joined', label: 'Joined Company', count: stageCounts.joined, color: 'border-emerald-300 text-emerald-700' },
          ].map((st) => {
            const isSelected = activeStageFilter === st.id;
            return (
              <div
                key={st.id}
                onClick={() => setActiveStageFilter(activeStageFilter === st.id ? 'All' : st.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-600 scale-105 ring-2 ring-indigo-400'
                    : 'bg-white dark:bg-[#1C1C1C] border-stone-200/80 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                }`}
              >
                <div className={`text-xl font-black ${isSelected ? 'text-white' : st.color}`}>
                  {st.count}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-tight truncate ${isSelected ? 'text-white' : 'text-stone-500'}`}>
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Pipeline Roster Table Section */}
      <div className="space-y-4">
        {/* Table Search & Section Filters */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roster by candidate name, register number, or email..."
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Section Filter */}
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>

            {/* Active Stage Indicator Badge */}
            {activeStageFilter !== 'All' && (
              <button
                onClick={() => setActiveStageFilter('All')}
                className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 flex items-center gap-1.5"
              >
                <span>Stage: {activeStageFilter}</span>
                <span className="text-stone-400 hover:text-stone-700">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Candidate Pipeline Table */}
        <DataTable
          data={filteredRoster}
          columns={tableColumns}
          keyExtractor={(c) => c.id}
          selectedIds={selectedCandidatesIds}
          onSelectRow={canManage ? (id) => {
            setSelectedCandidatesIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          } : undefined}
          onSelectAll={canManage ? (ids) => setSelectedCandidatesIds(ids) : undefined}
          pageSize={10}
        />
      </div>

      {/* Update Candidate Stage Modal */}
      <UpdateCandidateStageModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setCandidateToUpdate(null);
        }}
        candidate={candidateToUpdate}
        onSave={(candId, stage, status, pkg, offerStat, note) => {
          updateCandidatePipelineStage(candId, stage, status, pkg, offerStat, note);
        }}
      />

      {/* Assign Candidates Modal */}
      <AssignCandidateToDriveModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedStudentIds={students.slice(0, 10).map((s) => s.id)}
      />

      {/* Delete Company Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => {
          deleteCompany(company.id);
          toast.success(`${company.name} moved to Recycle Bin`);
          navigate('/companies');
        }}
        title={`Delete ${company.name}?`}
        message="Are you sure you want to delete this company? The hiring record will be archived into the Recycle Bin for recovery."
        confirmText="Delete to Trash"
        variant="danger"
      />
    </div>
  );
};
