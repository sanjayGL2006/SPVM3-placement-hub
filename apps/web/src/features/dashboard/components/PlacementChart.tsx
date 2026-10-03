import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../../../shared/components/ui/Card';
import { HISTORICAL_PLACEMENT_TRENDS } from '../../../shared/utils/mockData';
import { TrendingUp } from 'lucide-react';

export const PlacementChart = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1C1C1C] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl text-xs space-y-1">
          <p className="font-bold text-stone-900 dark:text-stone-50">{label}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Placed Students: {payload[0]?.value}
          </p>
          <p className="text-purple-600 dark:text-purple-400 font-semibold">
            Placement Rate: {payload[1]?.value}%
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
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
              5-Year Placement Trend & Growth
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 ml-8">
            Cohort success rate from AY 2021-22 to AY 2025-26
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
          +14.8% 5-Yr CAGR
        </div>
      </div>

      <div className="h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={HISTORICAL_PLACEMENT_TRENDS}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#78716C', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#78716C', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
            />
            <Area
              type="monotone"
              name="Placed Students"
              dataKey="placedStudents"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPlaced)"
            />
            <Area
              type="monotone"
              name="Placement Rate (%)"
              dataKey="placementRate"
              stroke="#8B5CF6"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
