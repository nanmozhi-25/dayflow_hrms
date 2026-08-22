import { useState } from 'react';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  Clock,
  Sparkles,
  TrendingUp,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const adminAttendanceData = [
  { name: 'Engineering', Present: 54, Late: 3, Absent: 1 },
  { name: 'Product', Present: 18, Late: 1, Absent: 0 },
  { name: 'Sales', Present: 32, Late: 4, Absent: 2 },
  { name: 'HR/Ops', Present: 12, Late: 0, Absent: 1 },
  { name: 'Finance', Present: 8, Late: 1, Absent: 0 },
];

const leaveSplitData = [
  { name: 'Annual Leave', value: 12, color: '#0f766e' },
  { name: 'Sick Leave', value: 5, color: '#4f46e5' },
  { name: 'Casual Leave', value: 3, color: '#f59e0b' },
  { name: 'Maternity', value: 2, color: '#ec4899' },
];

export const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Daniel Carter', type: 'Medical Leave', duration: 'Aug 24 - Aug 26 (3 Days)', reason: 'Dental extraction', status: 'Pending' },
    { id: 2, name: 'Emily Watson', type: 'Casual Leave', duration: 'Sep 01 - Sep 03 (3 Days)', reason: 'Family travel', status: 'Pending' },
    { id: 3, name: 'Marcus Aurelius', type: 'Annual Leave', duration: 'Sep 10 - Sep 15 (5 Days)', reason: 'Philosophical retreat', status: 'Pending' },
  ]);

  const handleAction = (id: number, status: 'Approved' | 'Rejected') => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
  };

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">HR Command Center</h2>
          <p className="text-xs text-slate-400">Real-time indicators, employee check-ins, and leave processing</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 text-xs text-slate-600 font-semibold">
          <span>Today: <strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Headcount</span>
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">142</h3>
          <span className="text-[10px] text-teal-600 font-bold flex items-center gap-0.5 mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+4 this month</span>
          </span>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present Today</span>
            <UserCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">124</h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-2">Checked in office/remote</span>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Leave</span>
            <CalendarDays className="h-5 w-5 text-rose-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">10</h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-2">Approved active departures</span>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Leaves</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{pendingCount}</h3>
          <span className="text-[10px] text-amber-600 font-bold block mt-2">{pendingCount} applications waiting</span>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <CalendarCheck className="h-5 w-5 text-teal-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">94.2%</h3>
          <span className="text-[10px] text-teal-600 font-bold block mt-2">Above 90% benchmark</span>
        </div>

        <div className="premium-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Cost</span>
            <DollarSign className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">$640k</h3>
          <span className="text-[10px] text-slate-400 font-semibold block mt-2">Salaries + allowances</span>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Bar Chart */}
        <div className="lg:col-span-2 premium-card p-5">
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 text-sm">Attendance Rate by Department</h4>
            <p className="text-[11px] text-slate-400">Headcount distributions check-ins today</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminAttendanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Present" fill="#0f766e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave categories split */}
        <div className="premium-card p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Active Leave Split</h4>
            <p className="text-[11px] text-slate-400">Distribution of approved leaves this month</p>
          </div>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leaveSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER GRID: RECENT LEAVES & AI INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending approvals table */}
        <div className="lg:col-span-2 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-900 text-sm">Action Required: Leave Requests</h4>
            <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wider">
              {pendingCount} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-2">Employee</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Duration</th>
                  <th className="py-2 px-2">Reason</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td className="py-3 px-2 font-semibold text-slate-950">{l.name}</td>
                    <td className="py-3 px-2">{l.type}</td>
                    <td className="py-3 px-2">{l.duration}</td>
                    <td className="py-3 px-2 truncate max-w-xs">{l.reason}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                        l.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                        'bg-red-50 text-red-700 border-red-200/50'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {l.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(l.id, 'Approved')}
                            className="p-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleAction(l.id, 'Rejected')}
                            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Actioned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="premium-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700 border-b border-slate-100 pb-2.5">
              <Sparkles className="h-5 w-5" />
              <h4 className="font-bold text-slate-900 text-sm">AI Workday Observations</h4>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed text-slate-600">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg space-y-1">
                <span className="font-bold text-indigo-950 text-xs block">Overtime Fatigue Risk</span>
                <p>Engineering department is clocking 9.5h daily avg. Retention risk increases by 12% if sustained.</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg space-y-1">
                <span className="font-bold text-amber-950 text-xs block">Leaves Overload Warning</span>
                <p>6 employees requested leave on Sep 1-5. Project pipeline schedule conflicts detected.</p>
              </div>
            </div>
          </div>

          <button className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer border-t border-slate-100 pt-3">
            View Analytics Insights
          </button>
        </div>

      </div>
    </div>
  );
};
