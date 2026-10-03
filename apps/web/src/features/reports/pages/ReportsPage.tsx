import { useState } from 'react';
import { useStudentStore } from '../../students/stores/studentStore';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { exportStudentsToExcel, exportDataToPdf, exportPlacementTextReport } from '../../../shared/utils/exportHelpers';
import { getCompanyLogo } from '../../../shared/utils/companyLogos';
import {
  FileBarChart,
  Download,
  Printer,
  FileText,
  PieChart as PieIcon,
  TrendingUp,
  Building,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ReportsPage = () => {
  const { students } = useStudentStore();
  const { companies } = useCompanyStore();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState('All');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const filtered = selectedDept === 'All'
    ? students
    : students.filter((s) => s.department === selectedDept);

  const total = filtered.length;
  const placed = filtered.filter((s) => s.placement.status === 'Placed').length;
  const inProcess = filtered.filter((s) => s.placement.status === 'In Process').length;
  const eligible = filtered.filter((s) => s.placement.status !== 'Not Eligible').length;
  const rate = eligible > 0 ? (placed / eligible) * 100 : 0;

  const placedPackages = filtered
    .filter((s) => s.placement.status === 'Placed' && s.placement.packageLPA)
    .map((s) => s.placement.packageLPA as number);

  const highest = placedPackages.length > 0 ? Math.max(...placedPackages) : 0;
  const avg = placedPackages.length > 0 ? placedPackages.reduce((a, b) => a + b, 0) / placedPackages.length : 0;

  // Pie chart data for salary brackets
  const tierPieData = [
    { name: 'Super Dream (> 12 LPA)', value: placedPackages.filter((p) => p > 12).length || 0, color: '#6366F1' },
    { name: 'Dream (7 - 12 LPA)', value: placedPackages.filter((p) => p >= 7 && p <= 12).length || 0, color: '#8B5CF6' },
    { name: 'Core (4 - 7 LPA)', value: placedPackages.filter((p) => p >= 4 && p < 7).length || 0, color: '#3B82F6' },
    { name: 'Mass (< 4 LPA)', value: placedPackages.filter((p) => p < 4).length || 0, color: '#10B981' },
  ];

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    toast.loading('Compiling high-resolution Placement Report PDF...');
    
    setTimeout(() => {
      const headers = ['Register No', 'Student Name', 'Department', 'Course', 'CGPA', 'Placement Status', 'Company', 'Package (LPA)'];
      const rows = filtered.map(s => [
        s.registerNumber,
        s.name,
        s.department,
        s.course,
        s.academic.cgpa.toString(),
        s.placement.status,
        s.placement.companyName || '-',
        s.placement.packageLPA ? s.placement.packageLPA.toString() : '-'
      ]);
      
      exportDataToPdf('Institutional Placement Analytics Report', headers, rows, `Placement_Analytics_Report_${Date.now()}.pdf`);
      
      setIsExportingPdf(false);
      toast.dismiss();
      toast.success('Placement Report PDF exported!');
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1 border border-indigo-200/60 dark:border-indigo-800/60">
            <FileBarChart className="w-3.5 h-3.5" />
            Executive Intelligence & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Institutional Placement Reports & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Generate customized audit reports, salary tier distributions, and board summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => navigate('/reports/annual')}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Annual Report
          </Button>

          <Button
            variant="outline"
            size="sm"
            pill
            onClick={() => {
              exportStudentsToExcel(filtered, 'Custom_Placement_Report.xlsx');
              toast.success('Excel report downloaded');
            }}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            pill
            onClick={handleDownloadPdf}
            isLoading={isExportingPdf}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto bg-stone-100 dark:bg-stone-800/80 p-1 rounded-2xl gap-1 max-w-2xl">
        {[
          'All',
          'Computer Applications',
          'Business Administration',
          'Commerce',
          'Science',
          'Hotel Management',
        ].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedDept === dept
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {dept === 'Computer Applications' ? 'BCA' : dept === 'Business Administration' ? 'BBA' : dept}
          </button>
        ))}
      </div>

      {/* Printable Report Canvas */}
      <div id="placement-report-content" className="space-y-6 bg-transparent">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Cohort</span>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-50 mt-1">
              {total}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">Registered candidates</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400">Placed Count</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {placed}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">{formatPercentage(rate)} conversion</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400">Average CTC</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {formatCurrency(avg)}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">Across verified offers</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-400">Highest Package</span>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {formatCurrency(highest)}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">Super Dream role</p>
          </div>
        </div>

        {/* Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Bracket Distribution Pie */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                <PieIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  Salary Tier Distribution
                </h3>
                <p className="text-xs text-stone-400">Offers grouped by CTC packages</p>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tierPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Department Placement Comparison */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  Recruiter Partner Visits
                </h3>
                <p className="text-xs text-stone-400">Active campus recruiters by industry</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {companies.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getCompanyLogo(c.name, c.logo)}
                      alt={c.name}
                      className="w-7 h-7 object-contain rounded-lg p-0.5 bg-white border border-stone-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getCompanyLogo(c.name);
                      }}
                    />
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{c.name}</div>
                      <div className="text-[10px] text-stone-400">{c.industry}</div>
                    </div>
                  </div>
                  <div className="text-right font-bold text-indigo-600">
                    ₹{c.packageRange.min} - ₹{c.packageRange.max} LPA
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
