import { Info, CheckCircle2, AlertTriangle, CalendarRange } from 'lucide-react';

export const Notifications = () => {
  const list = [
    { title: 'Leave Application Approved', msg: 'Your casual leave request for Aug 28 has been approved by Sarah Jenkins.', type: 'leave', time: '1 hour ago' },
    { title: 'August Payslip Released', msg: 'Your payslip for the month of August has been successfully generated and compiled.', type: 'payroll', time: 'Yesterday' },
    { title: 'Workspace Update', msg: 'HQ Office schedules will be aligned with summer holiday hours beginning next week.', type: 'info', time: '3 days ago' },
    { title: 'Action Required: Verify Profile Details', msg: 'Please review and verify your tax profile configurations under settings before the end of the month.', type: 'warning', time: '4 days ago' },
  ];

  return (
    <div className="premium-card p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">System Notification Feed</h3>
          <p className="text-xs text-slate-400">Updates, requests status, and workplace reports</p>
        </div>
        <button className="text-xs font-bold text-teal-600 hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={idx} className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
            <div className={`p-2 rounded-lg h-fit ${
              item.type === 'leave' ? 'bg-indigo-50 text-indigo-600' :
              item.type === 'payroll' ? 'bg-emerald-50 text-emerald-600' :
              item.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
            }`}>
              {item.type === 'leave' ? <CalendarRange className="h-4.5 w-4.5" /> :
               item.type === 'payroll' ? <CheckCircle2 className="h-4.5 w-4.5" /> :
               item.type === 'warning' ? <AlertTriangle className="h-4.5 w-4.5" /> : <Info className="h-4.5 w-4.5" />}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">{item.title}</p>
              <p className="text-[11px] text-slate-500 leading-normal">{item.msg}</p>
              <span className="text-[9px] text-slate-400 block mt-1">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
