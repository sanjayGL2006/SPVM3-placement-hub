import { Users, UserCheck, Percent, Clock, Building2, Trophy, IndianRupee, Briefcase } from 'lucide-react';
import { StatCard } from '../../../shared/components/StatCard';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { Student } from '../../../shared/types/student.types';
import { Company } from '../../../shared/types/company.types';

export interface KpiCardsProps {
  students: Student[];
  companies: Company[];
}

export const KpiCards = ({ students, companies }: KpiCardsProps) => {
  const totalStudents = students.length;
  const placedStudents = students.filter((s) => s.placement.status === 'Placed').length;
  const inProcessStudents = students.filter((s) => s.placement.status === 'In Process').length;
  const eligibleStudents = students.filter((s) => s.placement.status === 'Eligible' || s.placement.status === 'Placed' || s.placement.status === 'In Process').length;
  
  const placementRate = eligibleStudents > 0 ? (placedStudents / eligibleStudents) * 100 : 0;

  // Calculate highest, average, and lowest package
  const placedPackages = students
    .filter((s) => s.placement.status === 'Placed' && s.placement.packageLPA)
    .map((s) => ({ lpa: s.placement.packageLPA as number, company: s.placement.companyName }));

  const highestOffer = placedPackages.length > 0 
    ? placedPackages.reduce((max, p) => p.lpa > max.lpa ? p : max, placedPackages[0]) 
    : { lpa: 0, company: null };
    
  const highestPackage = highestOffer.lpa;
  const highestCompany = highestOffer.company;
  
  const avgPackage = placedPackages.length > 0 
    ? placedPackages.reduce((a, b) => a + b.lpa, 0) / placedPackages.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered"
          value={totalStudents.toLocaleString()}
          icon={Users}
          iconColor="indigo"
          subtitle="Active academic cohort"
        />

        <StatCard
          title="Students Placed"
          value={placedStudents.toLocaleString()}
          icon={UserCheck}
          iconColor="emerald"
          subtitle="Offers confirmed & accepted"
        />

        <StatCard
          title="Placement Rate"
          value={formatPercentage(placementRate)}
          icon={Percent}
          iconColor="purple"
          subtitle="Based on eligible candidates"
        />

        <StatCard
          title="In Pipeline"
          value={inProcessStudents.toLocaleString()}
          icon={Clock}
          iconColor="amber"
          subtitle="Rounds in progress"
        />
      </div>

      {/* Secondary Package & Company KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Highest Package"
          value={highestPackage > 0 ? formatCurrency(highestPackage) : '₹0'}
          change={highestCompany || undefined}
          isPositive={true}
          icon={Trophy}
          iconColor="amber"
          subtitle="Super Dream tier CTC"
        />

        <StatCard
          title="Average Package"
          value={avgPackage > 0 ? formatCurrency(avgPackage) : '₹0'}
          icon={IndianRupee}
          iconColor="blue"
          subtitle="Across all departments"
        />

        <StatCard
          title="Hiring Partners"
          value={companies.length.toLocaleString()}
          icon={Building2}
          iconColor="indigo"
          subtitle="Global enterprise recruiters"
        />
      </div>
    </div>
  );
};
