import { useState } from 'react';
import { Student } from '../../../shared/types/student.types';
import { Badge } from '../../../shared/components/ui/Badge';
import { Eye, Edit, Trash2, Award, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatters';
import { cn } from '../../../shared/utils/cn';

export interface StudentCardProps {
  student: Student;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const StudentCard = ({
  student,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: StudentCardProps) => {
  const [hovered, setHovered] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'success';
      case 'In Process':
        return 'warning';
      case 'Eligible':
        return 'info';
      case 'Opted Out':
        return 'neutral';
      default:
        return 'danger';
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(student)}
      className={cn(
        'group relative bg-white dark:bg-[#1C1C1C] rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer shadow-pinterest hover:shadow-pinterest-hover dark:hover:shadow-pinterest-dark-hover hover:-translate-y-1',
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
          : 'border-stone-200/80 dark:border-stone-800/80'
      )}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(student.id);
          }}
          className={cn(
            'absolute top-3.5 left-3.5 z-20 p-1.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm',
            isSelected
              ? 'bg-indigo-600 text-white opacity-100 ring-2 ring-indigo-400'
              : 'bg-white/90 dark:bg-stone-800/90 text-stone-400 hover:text-indigo-600 border border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100 group-hover:opacity-100'
          )}
          title={isSelected ? 'Deselect student' : 'Select student'}
        >
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-0 cursor-pointer pointer-events-none block"
          />
        </div>
      )}

      {/* Top Banner & Profile Area */}
      <div className="relative pt-6 pb-4 px-6 flex flex-col items-center text-center bg-gradient-to-b from-stone-50/80 to-transparent dark:from-stone-900/30">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xl flex items-center justify-center ring-4 ring-white dark:ring-stone-800 shadow-sm transition-transform group-hover:scale-105">
            {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          {student.placement.status === 'Placed' && (
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-white dark:ring-stone-900" title="Placed Candidate">
              <Award className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <h3 className="font-bold text-base text-stone-900 dark:text-stone-50 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {student.name}
        </h3>

        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          {student.course} · Sec {student.section}
        </p>

        <span className="font-mono text-[10px] text-stone-400 mt-0.5">
          {student.registerNumber}
        </span>
      </div>

      {/* Details & Status Strip */}
      <div className="px-5 pb-5 space-y-3">
        {/* Status Badge & CGPA */}
        <div className="flex items-center justify-between pt-1">
          <Badge variant={getStatusVariant(student.placement.status)} size="sm">
            {student.placement.status}
          </Badge>

          <div className="flex items-center gap-1 text-xs font-bold text-stone-800 dark:text-stone-200">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span>{student.academic.cgpa} CGPA</span>
          </div>
        </div>

        {/* Company & Package Tag (If Placed) */}
        {student.placement.status === 'Placed' && student.placement.companyName ? (
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold truncate">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{student.placement.companyName}</span>
            </div>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {formatCurrency(student.placement.packageLPA)}
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-xs text-stone-500">
            <span>ATS Resume Score</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {student.atsScore || 85}%
            </span>
          </div>
        )}

        {/* Skills Tag Cloud Preview */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {student.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              {skill}
            </span>
          ))}
          {student.skills.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-stone-400">
              +{student.skills.length - 3}
            </span>
          )}
        </div>

        {/* Hover Quick Actions Bar */}
        <div
          className={cn(
            'pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-end gap-1.5 transition-opacity',
            hovered ? 'opacity-100' : 'opacity-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onView(student)}
            className="p-1.5 rounded-lg text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            title="View Full Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canEdit && (
            <button
              onClick={() => onEdit(student)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
              title="Edit Record"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(student.id)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
