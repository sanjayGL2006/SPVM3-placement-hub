import { usePlacementStore } from '../stores/placementStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { ApplicationStage, PlacementApplication } from '../../../shared/types/placement.types';
import { Badge } from '../../../shared/components/ui/Badge';
import { formatCurrency } from '../../../shared/utils/formatters';
import { Briefcase, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const ApplicationKanban = () => {
  const { applications, updateApplicationStage } = usePlacementStore();
  const { user } = useAuthStore();

  const stages: { stage: ApplicationStage; title: string; color: string }[] = [
    { stage: 'Applied', title: 'Applied / In Review', color: 'border-stone-300 dark:border-stone-700' },
    { stage: 'Aptitude Round', title: 'Aptitude / Coding', color: 'border-blue-400 dark:border-blue-700' },
    { stage: 'Technical Interview', title: 'Technical Interview', color: 'border-indigo-400 dark:border-indigo-700' },
    { stage: 'HR Interview', title: 'HR & Fitment', color: 'border-purple-400 dark:border-purple-700' },
    { stage: 'Offered', title: 'Offer Letter Issued', color: 'border-amber-400 dark:border-amber-700' },
    { stage: 'Placed', title: 'Offer Accepted (Placed)', color: 'border-emerald-400 dark:border-emerald-700' },
  ];

  const canMove = user?.role === 'principal' || user?.role === 'hod' || user?.role === 'coordinator';

  const handleMoveToNext = (app: PlacementApplication) => {
    let nextStage: ApplicationStage = 'Aptitude Round';
    if (app.stage === 'Applied') nextStage = 'Aptitude Round';
    else if (app.stage === 'Aptitude Round') nextStage = 'Technical Interview';
    else if (app.stage === 'Technical Interview') nextStage = 'HR Interview';
    else if (app.stage === 'HR Interview') nextStage = 'Offered';
    else if (app.stage === 'Offered') nextStage = 'Placed';
    else return;

    updateApplicationStage(app.id, nextStage);
    toast.success(`${app.studentName} advanced to ${nextStage}`);
  };

  const handleReject = (app: PlacementApplication) => {
    updateApplicationStage(app.id, 'Rejected');
    toast.error(`${app.studentName} marked as Rejected`);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {stages.map((col) => {
          const colApps = applications.filter((a) => a.stage === col.stage);

          return (
            <div
              key={col.stage}
              className="flex-1 bg-stone-100/70 dark:bg-stone-900/50 rounded-3xl p-4 border border-stone-200/70 dark:border-stone-800/70 flex flex-col justify-between"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">
                  {col.title}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1 min-h-[350px]">
                {colApps.length === 0 ? (
                  <div className="py-12 text-center text-xs text-stone-400 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                    No candidates
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white dark:bg-[#1C1C1C] rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm hover:shadow-md transition-all space-y-2.5"
                    >
                      {/* Student info */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {app.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate">
                            {app.studentName}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {app.course} · CGPA {app.cgpa}
                          </div>
                        </div>
                      </div>

                      {/* Company & Role */}
                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                          {app.companyName}
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          ₹{app.packageLPA} LPA
                        </span>
                      </div>

                      {/* Controls to move or reject */}
                      {canMove && col.stage !== 'Placed' && (
                        <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                          <button
                            onClick={() => handleReject(app)}
                            className="text-[10px] text-stone-400 hover:text-red-500 font-semibold p-1"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleMoveToNext(app)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full"
                          >
                            Advance <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
