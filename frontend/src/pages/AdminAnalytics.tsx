import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const costData = [
  { name: 'Jan', Cost: 450000 },
  { name: 'Feb', Cost: 480000 },
  { name: 'Mar', Cost: 520000 },
  { name: 'Apr', Cost: 510000 },
  { name: 'May', Cost: 550000 },
  { name: 'Jun', Cost: 600000 },
  { name: 'Jul', Cost: 610000 },
  { name: 'Aug', Cost: 640000 },
];

const departmentSplit = [
  { name: 'Engineering', value: 45, color: '#0f766e' },
  { name: 'Product', value: 15, color: '#4f46e5' },
  { name: 'Sales', value: 25, color: '#f59e0b' },
  { name: 'HR/Ops', value: 10, color: '#ec4899' },
  { name: 'Finance', value: 5, color: '#6b7280' },
];

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Quick summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="premium-card p-5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Retention Rate</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-2 block">94.8%</span>
          <span className="text-xs text-teal-600 font-semibold flex items-center gap-1 mt-3">
            <TrendingUp className="h-4 w-4" />
            <span>+1.2% over past quarter</span>
          </span>
        </div>

        <div className="premium-card p-5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Monthly Cost</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-2 block">$640,000</span>
          <span className="text-xs text-slate-500 mt-3 block">Salary + Benefit Allowance</span>
        </div>

        <div className="premium-card p-5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Daily Attendance</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-2 block">93.4%</span>
          <span className="text-xs text-slate-500 mt-3 block">Office: 62% | Remote: 38%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend */}
        <div className="premium-card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monthly Expenditure Trend</h3>
            <p className="text-xs text-slate-400">Total company operational expense</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Cost" stroke="#0f766e" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Split */}
        <div className="premium-card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Department Headcount Split</h3>
            <p className="text-xs text-slate-400">Employee distribution across departments</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentSplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
