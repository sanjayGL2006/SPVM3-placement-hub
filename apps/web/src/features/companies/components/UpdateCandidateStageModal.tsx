import { useState, useEffect } from 'react';
import { X, CheckCircle2, UserCheck, AlertCircle, Clock, Sparkles, Award } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { CandidatePipelineItem, PipelineStage, PipelineStatus } from '../../../shared/types/company.types';
import toast from 'react-hot-toast';

export interface UpdateCandidateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  onSave: (
    candidateId: string,
    stage: PipelineStage,
    status: PipelineStatus,
    packageLPA?: number,
    offerLetterStatus?: 'Pending' | 'Issued' | 'Accepted' | 'Rejected' | 'Joined',
    note?: string
  ) => void;
}

const STAGES: { stage: PipelineStage; label: string; icon?: any }[] = [
  { stage: 'Aptitude Test', label: 'Aptitude Test' },
  { stage: 'Technical Interview', label: 'Technical Interview' },
  { stage: 'Group Discussion', label: 'Group Discussion' },
  { stage: 'HR Round', label: 'HR Round' },
  { stage: 'Selected', label: 'Selected' },
  { stage: 'IR', label: 'IR (Review)' },
  { stage: 'Offer Letter Request', label: 'Offer Letter Request' },
  { stage: 'Joined Company Request', label: 'Joined Company Request' },
];

const STATUS_OPTIONS: { status: PipelineStatus; label: string; color: string }[] = [
  { status: 'Passed Round', label: 'Passed Round', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { status: 'Pending Review', label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { status: 'Processing', label: 'Processing', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { status: 'Completed', label: 'Completed', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { status: 'Failed or Rejected', label: 'Failed or Rejected', color: 'text-red-600 bg-red-50 border-red-200' },
];

export const UpdateCandidateStageModal = ({
  isOpen,
  onClose,
  candidate,
  onSave,
}: UpdateCandidateStageModalProps) => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>('Technical Interview');
  const [selectedStatus, setSelectedStatus] = useState<PipelineStatus>('Passed Round');
  const [packageLPA, setPackageLPA] = useState<number>(6.5);
  const [activityNote, setActivityNote] = useState<string>('');

  useEffect(() => {
    if (candidate) {
      setSelectedStage(candidate.hiringStage || 'Technical Interview');
      setSelectedStatus('Passed Round');
      setPackageLPA(candidate.packageLPA || 6.5);
      setActivityNote('');
    }
  }, [candidate]);

  if (!isOpen || !candidate) return null;

  const handleSave = () => {
    const offerStatus =
      selectedStage === 'Offer Letter Request' || selectedStage === 'Selected'
        ? 'Issued'
        : selectedStage === 'Joined Company Request'
        ? 'Joined'
        : selectedStatus === 'Failed or Rejected'
        ? 'Rejected'
        : candidate.offerLetterStatus;

    onSave(
      candidate.id,
      selectedStage,
      selectedStatus,
      packageLPA,
      offerStatus,
      activityNote || `Moved to ${selectedStage} (${selectedStatus})`
    );

    toast.success(`Updated status for ${candidate.candidateName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-xl w-full shadow-2xl space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base ring-2 ring-indigo-500/20">
              {candidate.candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-50">
                Update Candidate Pipeline Activity
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {candidate.candidateName} · {candidate.registerNumber} ({candidate.department} - Sec {candidate.section})
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

        {/* Current State Summary Card */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Current Stage</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{candidate.hiringStage}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Offer Letter</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{candidate.offerLetterStatus}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Academic CGPA</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{candidate.cgpa} CGPA</span>
          </div>
        </div>

        {/* Stage Selection Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            1. Select Hiring Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STAGES.map(({ stage, label }) => {
              const isSelected = selectedStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  className={`p-2.5 rounded-2xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="truncate w-full">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Options */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            2. Evaluation Round Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATUS_OPTIONS.map(({ status, label }) => {
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 dark:border-white shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <span>{label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Package & Activity Note Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Offered Package (₹ LPA)
            </label>
            <input
              type="number"
              step="0.1"
              value={packageLPA}
              onChange={(e) => setPackageLPA(Number(e.target.value))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Activity Remarks / Notes
            </label>
            <input
              type="text"
              value={activityNote}
              onChange={(e) => setActivityNote(e.target.value)}
              placeholder="e.g. Scored 92% in technical test"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
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
            onClick={handleSave}
            className="font-bold shadow-md hover:shadow-lg"
          >
            Save Pipeline Status
          </Button>
        </div>
      </div>
    </div>
  );
};
