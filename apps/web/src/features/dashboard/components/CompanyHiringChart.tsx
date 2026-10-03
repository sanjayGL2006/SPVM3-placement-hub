import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '../../../shared/components/ui/Card';
import { Layers } from 'lucide-react';
import { Student } from '../../../shared/types/student.types';

export interface CompanyHiringChartProps {
  students: Student[];
}

export const CompanyHiringChart = ({ students }: CompanyHiringChartProps) => {
  // Aggregate department counts
  const depts = [
    'Computer Applications',
    'Business Administration',
    'Commerce',
    'Science',
    'Hotel Management',
  ];

  const deptData = depts.map((d) => {
    const totalInDept = students.filter((s) => s.department === d).length;
    const placedInDept = students.filter((s) => s.department === d && s.placement.status === 'Placed').length;
    const rate = totalInDept > 0 ? Math.round((placedInDept / totalInDept) * 100) : 0;
    return {
      name: d.replace('Computer Applications', 'BCA / Comp App')
             .replace('Business Administration', 'BBA / Mgmt')
             .replace('Hotel Management', 'Hotel Mgmt'),
      placed: placedInDept,
      total: totalInDept,
      rate,
    };
  });

  const colors = ['#6366F1', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#1C1C1C] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl text-xs space-y-1">
          <p className="font-bold text-stone-900 dark:text-stone-50">{data.name}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Placed: {data.placed} / {data.total}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Rate: {data.rate}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              Department-Wise Placement Success
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 ml-8">
            Placed candidate breakdown across academic faculties
          </p>
        </div>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={deptData}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#78716C', fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#78716C', fontSize: 11 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="placed" radius={[0, 8, 8, 0]}>
              {deptData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
