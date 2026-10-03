import { usePlacementStore } from '../stores/placementStore';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { Trophy, Award, Download, Building, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const SelectionOfferBoard = () => {
  const { applications } = usePlacementStore();
  const placedApps = applications.filter((a) => a.stage === 'Placed' || a.stage === 'Offered');

  const handleDownloadOffer = (studentName: string, company: string) => {
    toast.success(`Downloaded Offer Verification Letter for ${studentName} (${company})`);
  };

  return (
    <div className="space-y-6">
      {/* Placed Showcase Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" /> Confirmed Selections Ledger
          </div>
          <h2 className="text-2xl font-extrabold">{placedApps.length} Placement Offers Confirmed</h2>
          <p className="text-xs text-emerald-100">
            Official offer letter verification and compensation tracking
          </p>
        </div>
      </div>

      {/* Offers Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {placedApps.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {app.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-50">
                    {app.studentName}
                  </h4>
                  <p className="text-xs text-stone-400">{app.course} · CGPA {app.cgpa}</p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Placed
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                  {app.companyName}
                </span>
                <div className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                  {app.role}
                </div>
              </div>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(app.packageLPA)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
              <span>Date: {formatDate(app.appliedDate)}</span>
              <button
                onClick={() => handleDownloadOffer(app.studentName, app.companyName)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Offer Letter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
