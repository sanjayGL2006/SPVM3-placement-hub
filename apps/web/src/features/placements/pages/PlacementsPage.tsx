import { useState } from 'react';
import { usePlacementStore } from '../stores/placementStore';
import { useAuthStore } from '../../auth/stores/authStore';
import { ApplicationKanban } from '../components/ApplicationKanban';
import { SelectionOfferBoard } from '../components/SelectionOfferBoard';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import {
  Briefcase,
  Kanban,
  Calendar,
  Trophy,
  Plus,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';

export const PlacementsPage = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'interviews' | 'offers'>('kanban');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { interviews, scheduleInterview, updateInterviewStatus } = usePlacementStore();
  const { user } = useAuthStore();

  const [interviewForm, setInterviewForm] = useState({
    studentName: 'Rahul Kumar',
    companyName: 'Deloitte',
    roundName: 'Round 2: Technical Interview',
    dateTime: '2026-03-25 10:30 AM',
    interviewType: 'Virtual (Google Meet)' as any,
    meetingLink: 'https://meet.google.com/xyz-placement',
    interviewerName: 'Senior Engineering Panel',
  });

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview({
      applicationId: 'APP-2026-999',
      studentId: 'STU-2026-001',
      studentName: interviewForm.studentName,
      companyName: interviewForm.companyName,
      companyLogo: getCompanyLogo(interviewForm.companyName),
      roundName: interviewForm.roundName,
      interviewType: interviewForm.interviewType,
      meetingLink: interviewForm.meetingLink,
      dateTime: interviewForm.dateTime,
      durationMinutes: 45,
      interviewerName: interviewForm.interviewerName,
      status: 'Scheduled',
    });
    toast.success('Interview scheduled successfully!');
    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <Briefcase className="w-3.5 h-3.5" />
            Recruitment Pipelines & Rounds
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Placement Applications & Interview Matrix
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Track student application stages from online coding to confirmed job offers.
          </p>
        </div>

        {/* Tab Switcher & Schedule Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex items-center gap-1 border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Pipeline Board
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'interviews'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Interview Schedule ({interviews.length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'offers'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Offers Confirmed
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => setIsScheduleOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'kanban' && <ApplicationKanban />}
      {activeTab === 'offers' && <SelectionOfferBoard />}
      {activeTab === 'interviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-50">
                    {item.studentName}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {item.companyName}
                  </p>
                </div>
                <Badge variant={item.status === 'Completed' ? 'success' : 'primary'} size="sm">
                  {item.status}
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 text-xs space-y-1">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  {item.roundName}
                </div>
                <div className="text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {item.dateTime} ({item.durationMinutes} mins)
                </div>
                <div className="text-stone-500 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> {item.interviewType}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                {item.meetingLink ? (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Join Meet Link
                  </a>
                ) : (
                  <span className="text-stone-400">{item.room || 'In-Person Lab'}</span>
                )}

                {item.status !== 'Completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    pill
                    onClick={() => {
                      updateInterviewStatus(item.id, 'Completed');
                      toast.success('Interview marked completed');
                    }}
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        title="Schedule Interview Round"
        description="Assign candidate interview slot with recruiter panel."
        maxWidth="md"
      >
        <form onSubmit={handleCreateInterview} className="space-y-3">
          <Input
            label="Candidate Name"
            required
            value={interviewForm.studentName}
            onChange={(e) => setInterviewForm({ ...interviewForm, studentName: e.target.value })}
          />
          <Input
            label="Company"
            required
            value={interviewForm.companyName}
            onChange={(e) => setInterviewForm({ ...interviewForm, companyName: e.target.value })}
          />
          <Input
            label="Round Title"
            required
            value={interviewForm.roundName}
            onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
          />
          <Input
            label="Date & Time"
            required
            value={interviewForm.dateTime}
            onChange={(e) => setInterviewForm({ ...interviewForm, dateTime: e.target.value })}
          />
          <Input
            label="Meeting URL / Room"
            value={interviewForm.meetingLink}
            onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" pill type="button" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" pill type="submit">
              Confirm Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
