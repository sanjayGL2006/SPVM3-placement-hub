import { Company } from '../../../shared/types/company.types';
import { Drawer } from '../../../shared/components/ui/Drawer';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency } from '../../../shared/utils/formatters';
import { Building2, Globe, MapPin, Mail, Phone, User, CheckCircle, Edit, Briefcase, Download, FileText } from 'lucide-react';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import { useCompanyStore } from '../stores/companyStore';
import { usePlacementStore } from '../../placements/stores/placementStore';
import { exportCompanyDriveToExcel, exportCompanyDriveToPdf } from '../../../shared/utils/exportCompanyData';

export interface CompanyDrawerProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (company: Company) => void;
  canEdit?: boolean;
}

export const CompanyDrawer = ({
  company,
  isOpen,
  onClose,
  onEdit,
  canEdit = true,
}: CompanyDrawerProps) => {
  const { drives } = useCompanyStore();
  const { applications } = usePlacementStore();

  if (!company) return null;

  const companyDrives = drives.filter((d) => d.companyName === company.name);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={company.name}
      subtitle={company.industry}
      width="xl"
      headerActions={
        canEdit && onEdit ? (
          <Button
            variant="outline"
            size="sm"
            pill
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => {
              onEdit(company);
              onClose();
            }}
          >
            Edit
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Company Header Card */}
        <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 p-2 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={getCompanyLogo(company.name, company.logo)}
              alt={company.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCompanyLogo(company.name);
              }}
            />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                {company.name}
              </h3>
              <Badge variant="primary" size="sm">
                {company.tier}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {company.location}
              </span>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> {company.website.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">About Company</h4>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800/60">
            {company.description}
          </p>
        </div>

        {/* Package & Eligibility Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">
              CTC Package Range
            </span>
            <div className="text-base font-extrabold text-indigo-900 dark:text-indigo-100 mt-0.5">
              ₹{company.packageRange.min} - ₹{company.packageRange.max} LPA
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400">
              Minimum CGPA Cutoff
            </span>
            <div className="text-base font-extrabold text-stone-800 dark:text-stone-100 mt-0.5">
              {company.minCgpa} CGPA (Max {company.maxBacklogsAllowed} Backlogs)
            </div>
          </div>
        </div>

        {/* Hiring Roles & Courses */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Hiring Profiles</h4>
            <div className="flex flex-wrap gap-2">
              {company.hiringRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Eligible Academic Courses</h4>
            <div className="flex flex-wrap gap-2">
              {company.eligibleCourses.map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* University Talent Lead Contact Card */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Recruiter & Talent Partner
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-stone-900 dark:text-stone-100">
                {company.contactPerson.name}
              </div>
              <div className="text-stone-500">{company.contactPerson.designation}</div>
              <div className="text-stone-400 flex items-center gap-3 pt-0.5">
                <span>{company.contactPerson.email}</span>
                <span>{company.contactPerson.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Drives & Rounds */}
        <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            Active Placement Drives ({companyDrives.length})
          </h4>
          
          <div className="space-y-4">
            {companyDrives.length === 0 ? (
              <p className="text-xs text-stone-500">No active drives for this company.</p>
            ) : (
              companyDrives.map(drive => {
                const driveApps = applications.filter(a => a.driveId === drive.id);
                return (
                  <div key={drive.id} className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div>
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{drive.role}</div>
                        <div className="text-xs text-stone-500 mt-1">Drive Date: {drive.driveDate} · Package: ₹{drive.packageLPA} LPA</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => exportCompanyDriveToExcel(drive, driveApps)}
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                        >
                          Excel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => exportCompanyDriveToPdf(drive, driveApps)}
                          leftIcon={<FileText className="w-3.5 h-3.5" />}
                        >
                          PDF
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                       <div className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
                         <span className="text-stone-500">Total Applicants:</span> <span className="font-bold">{driveApps.length}</span>
                       </div>
                       <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-700 dark:text-emerald-400">
                         <span className="opacity-80">Placed:</span> <span className="font-bold">{driveApps.filter(a => a.stage === 'Placed').length}</span>
                       </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </Drawer>
  );
};
