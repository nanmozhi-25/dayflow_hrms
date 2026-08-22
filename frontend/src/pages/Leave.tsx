import { useState } from 'react';
import { CalendarRange, ClipboardList } from 'lucide-react';

export const Leave = () => {
  const [leaveBalance] = useState({
    annual: { total: 15, used: 4, remaining: 11 },
    sick: { total: 10, used: 2, remaining: 8 },
    casual: { total: 5, used: 1, remaining: 4 },
  });

  const [requests, setRequests] = useState([
    { type: 'Casual Leave', start: '2026-08-28', end: '2026-08-28', days: 1, status: 'Pending', reason: 'Personal errands' },
    { type: 'Annual Leave', start: '2026-07-10', end: '2026-07-14', days: 5, status: 'Approved', reason: 'Family vacation' },
    { type: 'Sick Leave', start: '2026-06-03', end: '2026-06-04', days: 2, status: 'Approved', reason: 'Fever recovery' },
  ]);

  const [formType, setFormType] = useState('Annual Leave');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formReason, setFormReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStart || !formEnd) return;
    const newReq = {
      type: formType,
      start: formStart,
      end: formEnd,
      days: 2, // mock value
      status: 'Pending',
      reason: formReason,
    };
    setRequests([newReq, ...requests]);
    setFormStart('');
    setFormEnd('');
    setFormReason('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Leave Balance Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="premium-card p-5 border-l-4 border-l-teal-600">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Annual Leave</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{leaveBalance.annual.remaining}</span>
            <span className="text-xs text-slate-500">/ {leaveBalance.annual.total} days left</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${(leaveBalance.annual.remaining / leaveBalance.annual.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="premium-card p-5 border-l-4 border-l-indigo-600">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sick Leave</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{leaveBalance.sick.remaining}</span>
            <span className="text-xs text-slate-500">/ {leaveBalance.sick.total} days left</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(leaveBalance.sick.remaining / leaveBalance.sick.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="premium-card p-5 border-l-4 border-l-amber-600">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Casual Leave</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{leaveBalance.casual.remaining}</span>
            <span className="text-xs text-slate-500">/ {leaveBalance.casual.total} days left</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${(leaveBalance.casual.remaining / leaveBalance.casual.total) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <CalendarRange className="h-5 w-5 text-teal-600" />
            <span>Apply for Leave</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Leave Type</label>
              <select
                value={formType}
                onChange={e => setFormType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Start Date</label>
                <input
                  type="date"
                  required
                  value={formStart}
                  onChange={e => setFormStart(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">End Date</label>
                <input
                  type="date"
                  required
                  value={formEnd}
                  onChange={e => setFormEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason</label>
              <textarea
                rows={3}
                placeholder="Brief description..."
                value={formReason}
                onChange={e => setFormReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer">
              Submit Application
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 premium-card p-6 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ClipboardList className="h-5 w-5 text-teal-600" />
            <span>Application Status History</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-2">Leave Type</th>
                  <th className="py-2.5 px-2">Dates</th>
                  <th className="py-2.5 px-2">Days</th>
                  <th className="py-2.5 px-2">Reason</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {requests.map((req, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 font-semibold text-slate-950">{req.type}</td>
                    <td className="py-3 px-2">{req.start} to {req.end}</td>
                    <td className="py-3 px-2">{req.days} days</td>
                    <td className="py-3 px-2 truncate max-w-xs">{req.reason}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                          : 'bg-red-50 text-red-700 border-red-200/50'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
