import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  CalendarCheck,
  CalendarDays,
  ListFilter,
  Layers,
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { PlacementDrive } from '../../../shared/types/company.types';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import { formatDate } from '../../../shared/utils/formatters';

export interface PlacementCalendarProps {
  drives: PlacementDrive[];
}

export const PlacementCalendar = ({ drives }: PlacementCalendarProps) => {
  const navigate = useNavigate();

  // Anchor to September 2026 by default
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 8, 18));
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-22');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeModalDrive, setActiveModalDrive] = useState<PlacementDrive | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 8 = September

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Compute month layout
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon, 2: Tue, ...
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 30 for Sept
  const daysInPrevMonth = new Date(year, month, 0).getDate(); // 31 for Aug

  // Previous month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Next month navigation
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Jump to today (September 2026 anchor)
  const handleToday = () => {
    const today = new Date(2026, 8, 18);
    setCurrentDate(today);
    setSelectedDateStr('2026-09-22');
  };

  // Filter drives in current displayed month
  const drivesInSelectedMonth = useMemo(() => {
    return drives.filter((d) => {
      if (!d.driveDate) return false;
      const [dYear, dMonth] = d.driveDate.split('-').map(Number);
      return dYear === year && dMonth === month + 1;
    });
  }, [drives, year, month]);

  // Map drives by date string 'YYYY-MM-DD'
  const drivesByDateMap = useMemo(() => {
    const map = new Map<string, PlacementDrive[]>();
    drives.forEach((drv) => {
      if (!drv.driveDate) return;
      const existing = map.get(drv.driveDate) || [];
      existing.push(drv);
      map.set(drv.driveDate, existing);

      // Also map individual round dates if present
      drv.rounds?.forEach((r) => {
        if (r.date && r.date !== drv.driveDate) {
          const rExisting = map.get(r.date) || [];
          if (!rExisting.some((x) => x.id === drv.id)) {
            rExisting.push(drv);
            map.set(r.date, rExisting);
          }
        }
      });
    });
    return map;
  }, [drives]);

  // Selected date drives
  const selectedDrives = useMemo(() => {
    return drivesByDateMap.get(selectedDateStr) || [];
  }, [drivesByDateMap, selectedDateStr]);

  // Calendar cells generation (7-day columns: S M T W T F S)
  const calendarCells = useMemo(() => {
    const cells = [];

    // Previous month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        drives: drivesByDateMap.get(dateStr) || [],
      });
    }

    // Current month days (1 to daysInMonth)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
        drives: drivesByDateMap.get(dateStr) || [],
      });
    }

    // Next month padding to complete 7-day grid
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      cells.push({
        dayNum: n,
        dateStr,
        isCurrentMonth: false,
        drives: drivesByDateMap.get(dateStr) || [],
      });
    }

    return cells;
  }, [year, month, firstDayOfWeek, daysInMonth, daysInPrevMonth, drivesByDateMap]);

  const weekdays = [
    { label: 'S', title: 'Sunday' },
    { label: 'M', title: 'Monday' },
    { label: 'T', title: 'Tuesday' },
    { label: 'W', title: 'Wednesday' },
    { label: 'T', title: 'Thursday' },
    { label: 'F', title: 'Friday' },
    { label: 'S', title: 'Saturday' },
  ];

  return (
    <Card className="p-5 sm:p-6 bg-white dark:bg-[#1C1C1C] border border-stone-200/80 dark:border-stone-800/80 shadow-pinterest hover:shadow-pinterest-hover dark:hover:shadow-pinterest-dark-hover transition-all space-y-5">
      {/* Header with Title, Month Switcher & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-stone-100 dark:border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
                Placement Calendar
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Live Scheduler
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Interactive campus recruitment schedule & active hiring drives
            </p>
          </div>
        </div>

        {/* Month Navigation & View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle View */}
          <div className="flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/60 dark:border-stone-700/60 text-xs font-semibold">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/70 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-50 px-2 min-w-[120px] text-center tracking-tight">
              {monthName} {year}
            </span>

            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Required Placement Calendar Info Notification Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-blue-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/40 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-between gap-3 animate-fade-in shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </span>
          <div className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
            <span className="font-extrabold text-indigo-700 dark:text-indigo-400">
              {drivesInSelectedMonth.length} Placement Drive(s)
            </span>{' '}
            scheduled in{' '}
            <span className="font-bold text-stone-900 dark:text-stone-100">
              {monthName} {year}
            </span>
            . Click a highlighted date to view details.
          </div>
        </div>

        {drivesInSelectedMonth.length > 0 && (
          <Badge variant="primary" size="sm" className="hidden sm:inline-flex shrink-0 font-bold">
            {drivesInSelectedMonth.length} Active
          </Badge>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          {/* Weekday Headers: S M T W T F S */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((w, idx) => (
              <div
                key={idx}
                title={w.title}
                className="py-2 text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-400 border-b border-stone-200/60 dark:border-stone-800/60"
              >
                {w.label}
              </div>
            ))}
          </div>

          {/* Calendar Grid (Days 1 to 30 with padding) */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const hasDrives = cell.drives.length > 0;
              const isToday = cell.dateStr === '2026-09-18';

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDateStr(cell.dateStr);
                    if (cell.drives.length > 0) {
                      setActiveModalDrive(cell.drives[0]);
                    }
                  }}
                  className={`relative min-h-[58px] sm:min-h-[68px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-start transition-all text-left group border ${
                    !cell.isCurrentMonth
                      ? 'opacity-35 bg-stone-50/40 dark:bg-stone-900/20 border-transparent text-stone-400 dark:text-stone-600'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/40 scale-[1.02] z-10'
                      : hasDrives
                      ? 'bg-gradient-to-br from-indigo-50 via-purple-50/80 to-amber-50/50 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-amber-950/30 border-indigo-300 dark:border-indigo-600/80 text-stone-900 dark:text-stone-50 font-bold hover:shadow-md hover:border-indigo-500'
                      : isToday
                      ? 'bg-stone-100/90 dark:bg-stone-800/90 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold'
                      : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/50 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60 hover:border-stone-300'
                  }`}
                >
                  {/* Day Number and Today indicator */}
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm ${
                        isSelected
                          ? 'font-black text-white'
                          : hasDrives
                          ? 'font-black text-indigo-900 dark:text-indigo-200'
                          : isToday
                          ? 'font-black text-indigo-600 dark:text-indigo-400'
                          : 'font-semibold'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {isToday && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-900" />
                    )}

                    {hasDrives && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-amber-300' : 'bg-indigo-600 dark:bg-indigo-400 animate-pulse'
                        }`}
                      />
                    )}
                  </div>

                  {/* Drive Badge / Indicator */}
                  {hasDrives && (
                    <div className="w-full mt-1">
                      <div
                        className={`px-1 py-0.5 rounded-md text-[10px] font-extrabold truncate w-full flex items-center gap-1 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}
                      >
                        <span className="truncate">{cell.drives[0].companyName.split(' ')[0]}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Detail Card */}
          <div className="pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100">
                  <CalendarCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Scheduled for {formatDate(selectedDateStr)}</span>
                </div>

                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {selectedDrives.length} Event(s) Found
                </span>
              </div>

              {selectedDrives.length === 0 ? (
                <div className="py-4 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    No placement recruitment drives or tests scheduled on this date.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    pill
                    onClick={() => navigate('/drives')}
                    leftIcon={<CalendarIcon className="w-3.5 h-3.5" />}
                  >
                    View Season Schedule
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDrives.map((drv) => (
                    <div
                      key={drv.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#151515] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={getCompanyLogo(drv.companyName, drv.companyLogo)}
                          alt={drv.companyName}
                          className="w-12 h-12 object-contain rounded-2xl p-1.5 bg-white border border-stone-200 dark:border-stone-700 shrink-0 shadow-xs"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getCompanyLogo(drv.companyName);
                          }}
                        />

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-stone-900 dark:text-stone-50">
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
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                              ₹{drv.packageLPA} LPA
                            </span>
                          </div>

                          <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                            {drv.role}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 flex-wrap pt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" /> {drv.venue}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" /> 09:30 AM - 04:30 PM
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-stone-400" /> {drv.totalShortlisted} Shortlisted
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          pill
                          onClick={() => setActiveModalDrive(drv)}
                        >
                          Quick View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          pill
                          onClick={() => navigate(`/companies/${drv.companyId}/drive`)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Drive Pipeline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View of All Drives */
        <div className="space-y-3">
          {drives.map((drv) => (
            <div
              key={drv.id}
              onClick={() => setActiveModalDrive(drv)}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all cursor-pointer flex items-center justify-between gap-3"
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
      )}

      {/* Drive Details Quick Inspection Modal */}
      {activeModalDrive && (
        <Modal
          isOpen={!!activeModalDrive}
          onClose={() => setActiveModalDrive(null)}
          title={`Placement Drive Details — ${activeModalDrive.companyName}`}
          maxWidth="lg"
        >
          <div className="space-y-5 p-1">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <img
                src={getCompanyLogo(activeModalDrive.companyName, activeModalDrive.companyLogo)}
                alt={activeModalDrive.companyName}
                className="w-14 h-14 object-contain rounded-2xl p-2 bg-white border border-stone-200 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-50">
                    {activeModalDrive.companyName}
                  </h4>
                  <Badge variant="primary" size="sm">
                    ₹{activeModalDrive.packageLPA} LPA
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  {activeModalDrive.role}
                </p>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-3">
                  <span>📅 Drive Date: {formatDate(activeModalDrive.driveDate)}</span>
                  <span>📍 {activeModalDrive.venue}</span>
                </div>
              </div>
            </div>

            {/* Rounds Overview */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Recruitment Assessment Stages
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeModalDrive.rounds?.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-1"
                  >
                    <div className="font-bold text-stone-900 dark:text-stone-100">
                      Round {r.roundNumber}: {r.name}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      📅 {r.date} ({r.mode})
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                      {r.totalShortlisted} candidates
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button
                variant="outline"
                size="sm"
                pill
                onClick={() => setActiveModalDrive(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                pill
                onClick={() => {
                  const compId = activeModalDrive.companyId;
                  setActiveModalDrive(null);
                  navigate(`/companies/${compId}/drive`);
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Full Candidate Pipeline
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
