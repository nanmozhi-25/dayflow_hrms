import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const AdminPayroll = () => {
  const [slips, setSlips] = useState([
    { id: 1, name: 'Sarah Jenkins', month: '2026-08', basic: 7500, allowances: 800, deductions: 250, net: 8050, status: 'Paid' },
    { id: 2, name: 'Alex Rivera', month: '2026-08', basic: 5200, allowances: 1200, deductions: 200, net: 6200, status: 'Paid' },
    { id: 3, name: 'Daniel Carter', month: '2026-08', basic: 4800, allowances: 600, deductions: 150, net: 5250, status: 'Draft' },
    { id: 4, name: 'Emily Watson', month: '2026-08', basic: 4000, allowances: 1500, deductions: 100, net: 5400, status: 'Draft' },
  ]);

  const handleProcess = (id: number) => {
    setSlips(slips.map(s => s.id === id ? { ...s, status: 'Paid' } : s));
  };

  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Payroll Management Console</h3>
          <p className="text-xs text-slate-400">Review salaries, calculate allowances/deductions, and release payslips</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-colors">
          <RefreshCw className="h-4 w-4" />
          <span>Generate August Payroll</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-2">Employee</th>
              <th className="py-2.5 px-2">Month</th>
              <th className="py-2.5 px-2">Basic Salary</th>
              <th className="py-2.5 px-2">Allowances</th>
              <th className="py-2.5 px-2">Deductions</th>
              <th className="py-2.5 px-2">Net Pay</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {slips.map((s) => (
              <tr key={s.id}>
                <td className="py-3.5 px-2 font-semibold text-slate-950">{s.name}</td>
                <td className="py-3.5 px-2">{s.month}</td>
                <td className="py-3.5 px-2">${s.basic}</td>
                <td className="py-3.5 px-2">${s.allowances}</td>
                <td className="py-3.5 px-2">${s.deductions}</td>
                <td className="py-3.5 px-2 font-bold text-slate-950">${s.net}</td>
                <td className="py-3.5 px-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                    s.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  {s.status === 'Draft' ? (
                    <button
                      onClick={() => handleProcess(s.id)}
                      className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      Process & Disburse
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Disbursed</span>
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
