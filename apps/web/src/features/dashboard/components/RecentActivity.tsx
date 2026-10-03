import { Activity, CheckCircle, Clock, Sparkles, Building, UserPlus } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card';

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      title: 'Rahul Kumar placed at Deloitte',
      desc: 'Offer Letter generated for ₹8.5 LPA (Technology Analyst role)',
      time: '25 mins ago',
      icon: CheckCircle,
      iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
    {
      id: 2,
      title: 'Google Placement Drive Round 1 Shortlist',
      desc: '45 candidates selected for Technical Interview 1',
      time: '2 hours ago',
      icon: Building,
      iconColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
    },
    {
      id: 3,
      title: 'AI Resume Analyzer Batch Completed',
      desc: 'ATS score evaluated for 38 new BCA batch student uploads',
      time: '4 hours ago',
      icon: Sparkles,
      iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
    },
    {
      id: 4,
      title: 'HDFC Bank Interview Slots Assigned',
      desc: '14 BBA students scheduled for Round 2 managerial panel',
      time: 'Yesterday',
      icon: Clock,
      iconColor: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      id: 5,
      title: 'New Student Batch Registered',
      desc: 'Prof. Sunita Reddy imported 24 Commerce student records',
      time: '2 days ago',
      icon: UserPlus,
      iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Recent Placement Activity
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Live updates across drives, offers, and AI evaluations
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800/60">
        {activities.map((act) => (
          <div key={act.id} className="pt-3 first:pt-0 flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${act.iconColor}`}>
              <act.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">
                  {act.title}
                </span>
                <span className="text-[10px] text-stone-400">{act.time}</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {act.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
