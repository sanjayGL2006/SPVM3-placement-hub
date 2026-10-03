import { useState, useMemo } from 'react';
import { X, Briefcase, Building2, Search, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { useStudentStore } from '../stores/studentStore';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import { PipelineStage } from '../../../shared/types/company.types';
import toast from 'react-hot-toast';

export interface AssignCandidateToDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
}

export const AssignCandidateToDriveModal = ({
  isOpen,
  onClose,
  selectedStudentIds,
}: AssignCandidateToDriveModalProps) => {
  const { companies, drives, assignStudentsToCompanyDrive } = useCompanyStore();
  const { students } = useStudentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedDriveId, setSelectedDriveId] = useState<string>('');
  const [targetStage, setTargetStage] = useState<PipelineStage>('Assigned');

  const selectedStudents = useMemo(() => {
    return students.filter((s) => selectedStudentIds.includes(s.id));
  }, [students, selectedStudentIds]);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    const q = searchQuery.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.tier.toLowerCase().includes(q)
    );
  }, [companies, searchQuery]);

  if (!isOpen) return null;

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    const matchedDrive = drives.find((d) => d.companyId === companyId);
    if (matchedDrive) {
      setSelectedDriveId(matchedDrive.id);
    } else {
      setSelectedDriveId(`DRV-${companyId}`);
    }
  };

  const handleSubmit = () => {
    if (!selectedCompanyId) {
      toast.error('Please select a target hiring company drive');
      return;
    }

    const company = companies.find((c) => c.id === selectedCompanyId);
    assignStudentsToCompanyDrive(
      selectedCompanyId,
      selectedDriveId || `DRV-${selectedCompanyId}`,
      selectedStudentIds,
      targetStage
    );

    toast.success(
      `Successfully pushed ${selectedStudentIds.length} candidate${
        selectedStudentIds.length > 1 ? 's' : ''
      } into ${company?.name || 'Company'} Drive pipeline!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-xl w-full shadow-2xl space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-50">
                Push Candidates to Company Drive
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Assign {selectedStudentIds.length} selected candidate
                {selectedStudentIds.length > 1 ? 's' : ''} to active recruitment pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Candidates Preview Pill */}
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-indigo-900 dark:text-indigo-200">
              {selectedStudentIds.length} Students Selected
            </span>
          </div>
          <span className="text-indigo-700 dark:text-indigo-300 truncate max-w-[240px]">
            {selectedStudents.slice(0, 3).map((s) => s.name).join(', ')}
            {selectedStudents.length > 3 ? ` +${selectedStudents.length - 3} more` : ''}
          </span>
        </div>

        {/* Company Search Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            1. Select Hiring Partner / Drive
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, tier, or industry..."
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Searchable / Selectable Company List */}
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredCompanies.map((c) => {
            const isSelected = selectedCompanyId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectCompany(c.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/70 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
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
                    <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {c.tier.split('(')[0].trim()} · Avg ₹{c.avgPackage || 6.5} LPA
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {c.totalInterestedCount || 45} Candidates
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Selection Dropdown */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            2. Initial Hiring Pipeline Stage
          </label>
          <select
            value={targetStage}
            onChange={(e) => setTargetStage(e.target.value as PipelineStage)}
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Assigned">Assigned (Initial Batch Push)</option>
            <option value="Interested">Interested Candidate</option>
            <option value="Aptitude Test">Aptitude Test Attended</option>
            <option value="Technical Interview">Technical Interview</option>
            <option value="Group Discussion">Group Discussion</option>
            <option value="HR Round">HR Round Attended</option>
            <option value="Selected">Selected for Offer</option>
            <option value="IR">IR (Internal Recommendation)</option>
          </select>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
          <Button variant="outline" size="sm" pill onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={handleSubmit}
            disabled={!selectedCompanyId}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="font-bold shadow-md hover:shadow-lg"
          >
            Submit & Push to Drive
          </Button>
        </div>
      </div>
    </div>
  );
};
