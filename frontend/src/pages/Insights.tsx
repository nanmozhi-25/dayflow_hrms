import { BrainCircuit, AlertTriangle, Lightbulb } from 'lucide-react';

export const Insights = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-teal-400">
            <BrainCircuit className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI HR Analytics engine</span>
          </div>
          <h2 className="text-xl font-bold">Predictive Team Health & Workplace Insights</h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xl">
            Machine learning models evaluate check-in times, leave history, and output rates to suggest scheduling alignments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insight Card 1 */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/50 text-[10px] font-bold uppercase tracking-wider">
              Retention Analytics
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Updated 2h ago</span>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-950 text-sm">Overtime Fatigue Risk</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Engineering team work logs show consistent 9.2-hour workdays for 4 consecutive weeks. Model predicts a 15% increase in exhaustion indicators if scheduling remains unadjusted.
              </p>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[11px] text-slate-500">
                <strong>Recommendation:</strong> Distribute support ticket assignments and encourage Friday early log-offs.
              </div>
            </div>
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200/50 text-[10px] font-bold uppercase tracking-wider">
              Attendance Flow
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Updated 1d ago</span>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-950 text-sm">Leave Concurrency Clash</h4>
              <p className="text-xs text-slate-600 leading-normal">
                A high density of overlapping leave requests is detected for the second week of September across the Product department. Project deliverable schedules could encounter delays.
              </p>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[11px] text-slate-500">
                <strong>Recommendation:</strong> Coordinate with team leads to shift approval windows or confirm support backups.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
