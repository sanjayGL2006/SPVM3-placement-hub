import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card';
import { Badge } from '../../../shared/components/ui/Badge';
import { PlacementDrive } from '../../../shared/types/company.types';
import { formatDate } from '../../../shared/utils/formatters';
import { useNavigate } from 'react-router-dom';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';

export interface UpcomingDrivesProps {
  drives: PlacementDrive[];
}

export const UpcomingDrives = ({ drives }: UpcomingDrivesProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Active & Upcoming Drives
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Campus recruitment rounds schedule
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/companies')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {drives.slice(0, 4).map((drv) => (
          <div
            key={drv.id}
            onClick={() => navigate('/companies')}
            className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={getCompanyLogo(drv.companyName, drv.companyLogo)}
                alt={drv.companyName}
                className="w-10 h-10 object-contain rounded-xl p-1 bg-white border border-stone-200 shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCompanyLogo(drv.companyName);
                }}
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {drv.companyName}
                  </span>
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
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {drv.role} · <span className="font-semibold text-stone-700 dark:text-stone-200">₹{drv.packageLPA} LPA</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-0.5">
                  <span>📅 {formatDate(drv.driveDate)}</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {drv.venue.split('&')[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {drv.currentRound}
              </span>
              <div className="text-[10px] text-stone-400">
                {drv.totalShortlisted} Shortlisted
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
