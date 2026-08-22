import { useState } from 'react';
import { Check, X } from 'lucide-react';

export const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Daniel Carter', type: 'Medical Leave', start: '2026-08-24', end: '2026-08-26', days: 3, status: 'Pending', reason: 'Dental extraction' },
    { id: 2, name: 'Emily Watson', type: 'Casual Leave', start: '2026-09-01', end: '2026-09-03', days: 3, status: 'Pending', reason: 'Family event travel' },
    { id: 3, name: 'Alex Rivera', type: 'Sick Leave', start: '2026-08-10', end: '2026-08-10', days: 1, status: 'Approved', reason: 'Common cold' },
  ]);

  const handleAction = (id: number, status: 'Approved' | 'Rejected') => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Leave Approvals Management</h3>
          <p className="text-xs text-slate-400">Review, approve or reject pending employee leave requests</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-2">Employee</th>
              <th className="py-2.5 px-2">Leave Type</th>
              <th className="py-2.5 px-2">Duration</th>
              <th className="py-2.5 px-2">Days</th>
              <th className="py-2.5 px-2">Reason</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {leaves.map((l) => (
              <tr key={l.id}>
                <td className="py-3.5 px-2 font-semibold text-slate-950">{l.name}</td>
                <td className="py-3.5 px-2">{l.type}</td>
                <td className="py-3.5 px-2">{l.start} to {l.end}</td>
                <td className="py-3.5 px-2">{l.days} days</td>
                <td className="py-3.5 px-2 truncate max-w-xs">{l.reason}</td>
                <td className="py-3.5 px-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                    l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' :
                    l.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                    'bg-red-50 text-red-700 border-red-200/50'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  {l.status === 'Pending' ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(l.id, 'Approved')}
                        className="p-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-600 hover:text-teal-700 cursor-pointer"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(l.id, 'Rejected')}
                        className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 cursor-pointer"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
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
  );
};
