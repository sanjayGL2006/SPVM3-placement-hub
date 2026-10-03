import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../stores/companyStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { CompanyCard } from '../components/CompanyCard';
import { CompanyDrawer } from '../components/CompanyDrawer';
import { AddEditCompanyModal } from '../components/AddEditCompanyModal';
import { MasonryGrid } from '../../../shared/components/MasonryGrid';
import { DataTable, Column } from '../../../shared/components/DataTable';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Company } from '../../../shared/types/company.types';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import {
  Building2,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CompanyDirectoryPage = () => {
  const { user } = useAuthStore();
  const {
    companies,
    selectedCompany,
    searchQuery,
    selectedTier,
    setSearchQuery,
    setSelectedTier,
    setSelectedCompany,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useCompanyStore();

  const [viewMode, setViewMode] = useState<'masonry' | 'table'>('masonry');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const canEdit = user?.role === 'principal' || user?.role === 'hod' || user?.role === 'coordinator';
  const canDelete = user?.role === 'principal';

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (selectedTier && selectedTier !== 'All Tiers' && !c.tier.includes(selectedTier)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesInd = c.industry.toLowerCase().includes(q);
        const matchesRole = c.hiringRoles.some((r) => r.toLowerCase().includes(q));
        if (!matchesName && !matchesInd && !matchesRole) return false;
      }
      return true;
    });
  }, [companies, searchQuery, selectedTier]);

  const navigate = useNavigate();

  const tableColumns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Recruiter Partner',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0">
            <img
              src={getCompanyLogo(c.name, c.logo)}
              alt={c.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCompanyLogo(c.name);
              }}
            />
          </div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100">{c.name}</div>
            <div className="text-[11px] text-stone-400">{c.industry}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      sortable: true,
      render: (c) => (
        <Badge
          variant={
            c.tier.includes('Super Dream')
              ? 'primary'
              : c.tier.includes('Dream')
              ? 'warning'
              : 'info'
          }
          size="sm"
        >
          {c.tier.split('(')[0].trim()}
        </Badge>
      ),
    },
    {
      key: 'package',
      header: 'Average CTC',
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs block">
            ₹{c.avgPackage || Number(((c.packageRange.min + c.packageRange.max) / 2).toFixed(1))} LPA
          </span>
          <span className="text-[10px] text-stone-400">
            Range: ₹{c.packageRange.min} - ₹{c.packageRange.max}
          </span>
        </div>
      ),
    },
    {
      key: 'interested',
      header: 'Interested Students',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Users className="w-3.5 h-3.5" />
          <span>{c.totalInterestedCount || 45} Candidates</span>
        </div>
      ),
    },
    {
      key: 'cutoff',
      header: 'Eligibility',
      render: (c) => (
        <span className="text-xs text-stone-600 dark:text-stone-300">
          {c.minCgpa} CGPA · Max {c.maxBacklogsAllowed} Backlog
        </span>
      ),
    },
    {
      key: 'hired',
      header: 'Total Hired',
      sortable: true,
      render: (c) => (
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
          {c.totalHiredCount} placed
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => navigate(`/companies/${c.id}/drive`)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            className="text-xs font-bold px-2.5 py-1"
          >
            View
          </Button>
          {canEdit && (
            <button
              onClick={() => {
                setCompanyToEdit(c);
                setIsAddEditOpen(true);
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Edit Partner"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteTargetId(c.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Delete Partner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Building2 className="w-3.5 h-3.5" />
            Corporate Relations ({filteredCompanies.length} Partners)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Recruiter Directory & Tier Matrix
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Super Dream, Dream, and Core hiring partners with package benchmarks.
          </p>
        </div>

        {/* View Mode & Add Action */}
        <div className="flex items-center gap-2.5">
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex items-center gap-1 border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'masonry'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Masonry View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {canEdit && (
            <Button
              variant="primary"
              size="sm"
              pill
              onClick={() => {
                setCompanyToEdit(null);
                setIsAddEditOpen(true);
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Partner
            </Button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company by name, industry domain, or hiring role..."
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedTier || 'All Tiers'}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-full px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All Tiers">All Tiers</option>
            <option value="Super Dream">Super Dream (&gt; 12 LPA)</option>
            <option value="Dream">Dream (7 - 12 LPA)</option>
            <option value="Core">Core (4 - 7 LPA)</option>
            <option value="Mass">Mass (&lt; 4 LPA)</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={() => {
              setSearchQuery('');
              setSelectedTier('');
            }}
            className="p-2 text-stone-400 hover:text-stone-600"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Directory Content */}
      {filteredCompanies.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1C1C1C] rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
          <Building2 className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            No hiring partners found
          </h3>
          <p className="text-xs text-stone-500 mt-1">Try adjusting your tier or keyword search.</p>
        </div>
      ) : viewMode === 'masonry' ? (
        <MasonryGrid>
          {filteredCompanies.map((comp) => (
            <CompanyCard
              key={comp.id}
              company={comp}
              onView={(c) => setSelectedCompany(c)}
              onEdit={(c) => {
                setCompanyToEdit(c);
                setIsAddEditOpen(true);
              }}
              onDelete={(id) => setDeleteTargetId(id)}
              canEdit={canEdit}
            />
          ))}
        </MasonryGrid>
      ) : (
        <DataTable
          data={filteredCompanies}
          columns={tableColumns}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => setSelectedCompany(c)}
          pageSize={10}
        />
      )}

      {/* Detail Drawer */}
      <CompanyDrawer
        company={selectedCompany}
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onEdit={(c) => {
          setCompanyToEdit(c);
          setIsAddEditOpen(true);
        }}
        canEdit={canEdit}
      />

      {/* Add / Edit Modal */}
      <AddEditCompanyModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={(data) => {
          if (companyToEdit) {
            updateCompany(companyToEdit.id, data);
            toast.success('Hiring partner updated!');
          } else {
            addCompany(data);
            toast.success('New hiring partner registered!');
          }
        }}
        companyToEdit={companyToEdit}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteCompany(deleteTargetId);
            toast.success('Partner deleted from portal');
            setDeleteTargetId(null);
          }
        }}
        title="Delete Hiring Partner?"
        message="Are you sure you want to delete this company? Associated historical drives will be archived."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
