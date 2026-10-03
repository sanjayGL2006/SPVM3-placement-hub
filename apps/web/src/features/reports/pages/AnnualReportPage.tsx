import { useStudentStore } from '../../students/stores/studentStore';
import { useCompanyStore } from '../../companies/stores/companyStore';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { exportDataToPdf } from '../../../shared/utils/exportHelpers';
import { ArrowLeft, Printer, Download, GraduationCap, ShieldCheck, Trophy, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AnnualReportPage = () => {
  const { students } = useStudentStore();
  const { companies } = useCompanyStore();
  const navigate = useNavigate();

  const total = students.length;
  const placed = students.filter((s) => s.placement.status === 'Placed').length;
  const placementRate = (placed / total) * 100;
  const packages = students.filter((s) => s.placement.packageLPA).map((s) => s.placement.packageLPA as number);
  const highest = packages.length > 0 ? Math.max(...packages) : 0;
  const avg = packages.length > 0 ? packages.reduce((a, b) => a + b, 0) / packages.length : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.loading('Generating Executive Annual Placement Report PDF...');
    setTimeout(() => {
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Students Registered', total.toString()],
        ['Total Students Placed', placed.toString()],
        ['Placement Rate', `${placementRate.toFixed(1)}%`],
        ['Highest Package (LPA)', `₹ ${highest.toFixed(2)} Lakhs`],
        ['Average Package (LPA)', `₹ ${avg.toFixed(2)} Lakhs`],
        ['Number of Hiring Partners', companies.length.toString()]
      ];
      exportDataToPdf('Annual Placement Report 2025-26', headers, rows, 'Annual_Placement_Report_2025_26.pdf');
      toast.dismiss();
      toast.success('Annual Placement Report exported successfully!');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Reports
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" pill onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Document
          </Button>
          <Button variant="primary" size="sm" pill onClick={handleDownloadPdf} leftIcon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Printable Annual Report Sheet */}
      <div
        id="annual-report-printable"
        className="p-10 sm:p-12 rounded-3xl bg-white text-stone-900 border border-stone-200 shadow-xl space-y-8"
      >
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">
                Premier University Placement Cell
              </h1>
              <p className="text-xs font-semibold text-stone-600">
                Annual Institutional Placement Report · Academic Year 2025-26
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-stone-500">
            <div>Doc Ref: UP-2026-AR</div>
            <div>Date: March 2026</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-indigo-700">
            1. Executive Summary
          </h2>
          <p className="text-xs text-stone-700 leading-relaxed text-justify">
            The 2025-26 campus recruitment season witnessed unprecedented participation from Tier-1 tech giants, Fortune 500 multinationals, and leading financial institutions. With comprehensive AI preparation engines, ATS resume optimization, and skill matrix benchmarking, over {placed} candidates have secured confirmed offers, recording an overall placement success rate of {formatPercentage(placementRate)}.
          </p>
        </div>

        {/* Core KPI Matrix Table */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-indigo-700">
            2. Core Placement Benchmarks
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Total Registered</span>
              <div className="text-xl font-black text-stone-900 mt-0.5">{total}</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Placed Candidates</span>
              <div className="text-xl font-black text-emerald-600 mt-0.5">{placed}</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Highest CTC</span>
              <div className="text-xl font-black text-amber-600 mt-0.5">{formatCurrency(highest)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500">Average CTC</span>
              <div className="text-xl font-black text-indigo-600 mt-0.5">{formatCurrency(avg)}</div>
            </div>
          </div>
        </div>

        {/* Key Hiring Partners */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-indigo-700">
            3. Premier Recruiting Partners
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {companies.slice(0, 8).map((c) => (
              <div key={c.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="font-bold">{c.name} ({c.industry})</span>
                <span className="font-mono text-indigo-600">₹{c.packageRange.min} - ₹{c.packageRange.max} LPA</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-12 border-t border-stone-300 grid grid-cols-2 text-xs">
          <div>
            <div className="font-bold">Prof. Placement Director</div>
            <div className="text-stone-500">University Placement & Training Cell</div>
          </div>
          <div className="text-right">
            <div className="font-bold">Dr. Rajesh Sharma</div>
            <div className="text-stone-500">Principal & Chief Executive Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};
