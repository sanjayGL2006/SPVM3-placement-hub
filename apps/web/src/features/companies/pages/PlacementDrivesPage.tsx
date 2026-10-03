import { useState } from 'react';
import { useCompanyStore } from '../stores/companyStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { PlacementDrive } from '../../../shared/types/company.types';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { formatDate } from '../../../shared/utils/formatters';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import {
  Calendar,
  MapPin,
  Clock,
  Building,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PlacementDrivesPage = () => {
  const { drives, addDrive, updateDrive } = useCompanyStore();
  const { user } = useAuthStore();
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isNewDriveOpen, setIsNewDriveOpen] = useState(false);

  const canManage = user?.role === 'principal' || user?.role === 'hod' || user?.role === 'coordinator';

  const handleAdvanceRound = (drive: PlacementDrive) => {
    const nextRound = drive.currentRound === 'Online Coding Challenge'
      ? 'Technical Interview'
      : drive.currentRound === 'Technical Interview'
      ? 'Partner HR Round'
      : 'Final Offers Issued';

    updateDrive(drive.id, { currentRound: nextRound });
    toast.success(`Drive advanced to "${nextRound}"`);
    if (selectedDrive?.id === drive.id) {
      setSelectedDrive({ ...selectedDrive, currentRound: nextRound });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Calendar className="w-3.5 h-3.5" />
            Recruitment Season 2025-26
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Active Placement Drives & Stage Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Track multi-round shortlists, online assessments, and final offer releases.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => setIsNewDriveOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Schedule New Drive
          </Button>
        )}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drives.map((drv) => (
          <div
            key={drv.id}
            onClick={() => setSelectedDrive(drv)}
            className="bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-pinterest hover:shadow-pinterest-hover dark:hover:shadow-pinterest-dark-hover transition-all cursor-pointer space-y-4"
          >
            {/* Header: Logo, Title, Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={getCompanyLogo(drv.companyName, drv.companyLogo)}
                    alt={drv.companyName}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCompanyLogo(drv.companyName);
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-50">
                    {drv.companyName}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">{drv.role}</p>
                </div>
              </div>

              <Badge
                variant={
                  drv.status === 'Ongoing'
                    ? 'warning'
                    : drv.status === 'Completed'
                    ? 'success'
                    : 'primary'
                }
                size="sm"
                dot={drv.status === 'Ongoing'}
              >
                {drv.status}
              </Badge>
            </div>

            {/* Package & Current Stage Strip */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500">Offered CTC</span>
                <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₹{drv.packageLPA} LPA
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500">Current Round</span>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-100">
                  {drv.currentRound}
                </div>
              </div>
            </div>

            {/* Stages / Rounds Stepper */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Evaluation Pipeline</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {drv.rounds.map((r, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 space-y-0.5"
                  >
                    <div className="text-[10px] text-stone-400 font-bold">Round {r.roundNumber}</div>
                    <div className="font-semibold text-stone-800 dark:text-stone-100 truncate text-[11px]">
                      {r.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {r.totalShortlisted} Selected
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
              <span>📅 {formatDate(drv.driveDate)}</span>
              <span>Min CGPA: <span className="font-bold text-stone-700 dark:text-stone-300">{drv.minCgpa}</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Drive Detail & Advance Modal */}
      {selectedDrive && (
        <Modal
          isOpen={!!selectedDrive}
          onClose={() => setSelectedDrive(null)}
          title={`${selectedDrive.companyName} — ${selectedDrive.role}`}
          description={`Recruitment drive scheduled for ${formatDate(selectedDrive.driveDate)}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                  Current Stage: {selectedDrive.currentRound}
                </span>
                <p className="text-xs text-stone-500 mt-0.5">{selectedDrive.venue}</p>
              </div>
              {canManage && (
                <Button
                  variant="primary"
                  size="sm"
                  pill
                  onClick={() => handleAdvanceRound(selectedDrive)}
                >
                  Advance Stage
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Job Description & Scope
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/40 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                {selectedDrive.jobDescription}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDrive.skillsRequired.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Drive Modal */}
      <Modal
        isOpen={isNewDriveOpen}
        onClose={() => setIsNewDriveOpen(false)}
        title="Schedule Placement Drive"
        description="Configure new on-campus recruitment drive schedule."
        maxWidth="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('Drive scheduled successfully!');
            setIsNewDriveOpen(false);
          }}
          className="space-y-3"
        >
          <Input label="Company Name" required placeholder="e.g. Amazon AWS" />
          <Input label="Job Profile" required placeholder="e.g. Cloud Support Associate" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Package (₹ LPA)" type="number" step="0.1" placeholder="14.0" />
            <Input label="Drive Date" type="date" required />
          </div>
          <Input label="Venue / Link" placeholder="Auditorium & Virtual Meet" />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" pill type="button" onClick={() => setIsNewDriveOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" pill type="submit">
              Publish Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
