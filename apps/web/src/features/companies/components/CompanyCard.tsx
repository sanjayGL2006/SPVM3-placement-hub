import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../../shared/types/company.types';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import { MapPin, Users, Edit, Trash2, Eye, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';

export interface CompanyCardProps {
  company: Company;
  onView: (company: Company) => void;
  onEdit?: (company: Company) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

export const CompanyCard = ({
  company,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
}: CompanyCardProps) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const getTierVariant = (tier: string) => {
    if (tier.includes('Super Dream')) return 'primary';
    if (tier.includes('Dream')) return 'warning';
    if (tier.includes('Core')) return 'info';
    return 'neutral';
  };

  const avgPackage = company.avgPackage || Number(((company.packageRange.min + company.packageRange.max) / 2).toFixed(1));
  const interestedCount = company.totalInterestedCount || 45;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/companies/${company.id}/drive`)}
      className="group relative bg-white dark:bg-[#1C1C1C] rounded-3xl border border-stone-200/80 dark:border-stone-800/80 p-6 transition-all duration-300 shadow-pinterest hover:shadow-pinterest-hover dark:hover:shadow-pinterest-dark-hover hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Strip: Logo & Tier */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 dark:border-stone-700 p-2 flex items-center justify-center shadow-xs">
            <img
              src={getCompanyLogo(company.name, company.logo)}
              alt={company.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCompanyLogo(company.name);
              }}
            />
          </div>
          <Badge variant={getTierVariant(company.tier)} size="sm">
            {company.tier.split('(')[0].trim()}
          </Badge>
        </div>

        {/* Company Title & Industry */}
        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {company.name}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          {company.industry}
        </p>

        {/* Location & Interested Count */}
        <div className="flex items-center justify-between text-xs text-stone-400 mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[130px]">{company.location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
            <Users className="w-3.5 h-3.5" />
            <span>{interestedCount} Interested</span>
          </div>
        </div>

        {/* Package Offered Highlight Strip */}
        <div className="mt-3.5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Average CTC</span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
              ₹{avgPackage} LPA
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Package Range</span>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              ₹{company.packageRange.min} - ₹{company.packageRange.max} LPA
            </span>
          </div>
        </div>

        {/* Target Courses Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {company.eligibleCourses.slice(0, 3).map((c) => (
            <span
              key={c}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              {c}
            </span>
          ))}
          {company.eligibleCourses.length > 3 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-stone-400">
              +{company.eligibleCourses.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Metrics & Actions with View Button */}
      <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
        <span className="text-stone-400 font-medium">
          {company.totalHiredCount} Hired to date
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="primary"
            size="sm"
            pill
            onClick={() => navigate(`/companies/${company.id}/drive`)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            className="text-xs font-bold px-3 py-1 shadow-sm hover:shadow-md"
          >
            View
          </Button>

          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(company)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Edit Partner"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(company.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Delete Partner"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
