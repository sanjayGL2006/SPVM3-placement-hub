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
  Clock,
  Building,
  Plus,
  ArrowRight,
  CheckCircle2,
  Users,
  MapPin,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PlacementDrivesPage = () => {
  const { drives, addDrive, updateDrive, pipelineCandidates } = useCompanyStore();
  const { user } = useAuthStore();
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isNewDriveOpen, setIsNewDriveOpen] = useState(false);

  // Form State for Create Drive (replaces per-candidate scheduling)
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [campusVisitDate, setCampusVisitDate] = useState('');
  const [campusVisitTime, setCampusVisitTime] = useState('09:00');
  const [packageLPA, setPackageLPA] = useState('');
  const [venue, setVenue] = useState('');

  const isSuperUser = user?.role === 'developer' || user?.role === 'principal' || user?.role === 'admin';
  const canManage = isSuperUser || user?.role === 'hod' || user?.role === 'coordinator';
  const userDept = user?.department;

  // Filter drives for HOD / Coordinator to only their department
  const filteredDrives = drives.filter((drv) => {
    if (isSuperUser || !userDept) return true;
    return drv.eligibleDepartments.includes(userDept);
  });

  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobRole.trim() || !campusVisitDate) {
      toast.error('Please fill in required fields (Company Name, Role, Campus Visit Date).');
      return;
    }

    addDrive({
      companyId: `CMP-${Date.now()}`,
      companyName: companyName.trim(),
      companyLogo: getCompanyLogo(companyName.trim()),
      role: jobRole.trim(),
      packageLPA: packageLPA ? parseFloat(packageLPA) : 6.0,
      driveDate: campusVisitDate,
      deadlineDate: campusVisitDate,
      venue: venue.trim() || 'Main Campus Auditorium & Placement Cell',
      status: 'Upcoming',
      currentRound: 'Aptitude Test',
      rounds: [
        { roundNumber: 1, name: 'Aptitude Test', date: campusVisitDate, mode: 'Online', totalShortlisted: 0 },
        { roundNumber: 2, name: 'Technical Interview', date: campusVisitDate, mode: 'Online', totalShortlisted: 0 },
        { roundNumber: 3, name: 'HR Fit', date: campusVisitDate, mode: 'Offline', totalShortlisted: 0 },
      ],
      eligibleDepartments: userDept ? [userDept] : ['Computer Applications', 'Business Administration', 'Commerce', 'Science'],
      eligibleCourses: ['BCA', 'BBA', 'B.Com', 'B.Sc Computer Science'],
      minCgpa: 6.0,
      totalRegistered: 0,
      totalShortlisted: 0,
      totalSelected: 0,
      jobDescription: `${jobRole} on-campus placement drive organized for ${campusVisitDate} at ${campusVisitTime}.`,
      skillsRequired: ['Communication', 'Core Fundamentals', 'Problem Solving'],
    });

    toast.success(`Drive for ${companyName} (${jobRole}) scheduled successfully!`);
    setIsNewDriveOpen(false);

    // Reset Form
    setCompanyName('');
    setJobRole('');
    setCampusVisitDate('');
    setCampusVisitTime('09:00');
    setPackageLPA('');
    setVenue('');
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
            Active Placement Drives & Campus Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Company-centric drive scheduling, dynamic student opt-ins, and stage tracking.
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
            Create Company Drive
          </Button>
        )}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drv) => {
          const driveCandidates = pipelineCandidates.filter((c) => c.driveId === drv.id);

          return (
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

              {/* Package & Schedule Strip */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500">Package CTC</span>
                  <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                    ₹{drv.packageLPA} LPA
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Campus Visit</span>
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    {formatDate(drv.driveDate)}
                  </div>
                </div>
              </div>

              {/* Opt-in Candidates Count */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  {driveCandidates.length} Student(s) Opted-in
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {drv.venue || 'Auditorium'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drive Detail Modal */}
      {selectedDrive && (
        <Modal
          isOpen={!!selectedDrive}
          onClose={() => setSelectedDrive(null)}
          title={`${selectedDrive.companyName} — ${selectedDrive.role}`}
          description={`Campus Visit Date: ${formatDate(selectedDrive.driveDate)}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">
                  Offered CTC: ₹{selectedDrive.packageLPA} LPA
                </span>
                <p className="text-xs text-stone-500 mt-0.5">Venue: {selectedDrive.venue}</p>
              </div>
              {user?.role === 'student' && (
                <Button
                  variant="primary"
                  size="sm"
                  pill
                  onClick={() => {
                    toast.success(`You have opted in for ${selectedDrive.companyName} drive!`);
                  }}
                >
                  Opt-In for Drive
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Job Profile Overview
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/40 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                {selectedDrive.jobDescription}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Drive Modal (Replaces per-candidate scheduling) */}
      <Modal
        isOpen={isNewDriveOpen}
        onClose={() => setIsNewDriveOpen(false)}
        title="Schedule Company Drive"
        description="Create a company-centric recruitment drive for students to opt-in."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
          <Input
            label="Company Name"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Infosys, Microsoft, Amazon"
          />

          <Input
            label="Role / Job Title"
            required
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Systems Engineer / Full Stack Developer"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Campus Visit Date"
              type="date"
              required
              value={campusVisitDate}
              onChange={(e) => setCampusVisitDate(e.target.value)}
            />
            <Input
              label="Campus Visit Time"
              type="time"
              required
              value={campusVisitTime}
              onChange={(e) => setCampusVisitTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Offered Package (₹ LPA)"
              type="number"
              step="0.1"
              placeholder="e.g. 8.5"
              value={packageLPA}
              onChange={(e) => setPackageLPA(e.target.value)}
            />
            <Input
              label="Venue (Optional)"
              placeholder="e.g. Main Auditorium"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
            ℹ️ Students in eligible departments will be able to opt-in to this drive from their dashboard.
          </div>

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
