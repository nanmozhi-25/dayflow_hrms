import { DollarSign, FileText, CheckCircle2 } from 'lucide-react';

export const Payroll = () => {
  const currentSlip = {
    month: 'August 2026',
    basic: 5200.0,
    allowances: 1200.0,
    deductions: 200.0,
    tax: 450.0,
    net: 5750.0,
    status: 'Paid',
    paidDate: 'Aug 21, 2026',
  };

  const history = [
    { month: 'July 2026', net: 5750.0, status: 'Paid', paidDate: 'Jul 21, 2026' },
    { month: 'June 2026', net: 5500.0, status: 'Paid', paidDate: 'Jun 21, 2026' },
    { month: 'May 2026', net: 5500.0, status: 'Paid', paidDate: 'May 21, 2026' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Current Month Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Breakdown */}
        <div className="premium-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Statement for {currentSlip.month}</h3>
              <p className="text-xs text-slate-400">Monthly compensation summary</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200/50 text-[10px] font-bold uppercase tracking-wider">
              {currentSlip.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Earnings</h4>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Basic Salary</span>
                <span className="font-bold text-slate-900">${currentSlip.basic.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Allowances (HRA, Travel)</span>
                <span className="font-bold text-slate-900">${currentSlip.allowances.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Deductions & Taxes</h4>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Taxes (State/Fed)</span>
                <span className="font-bold text-slate-900">${currentSlip.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>PF / Health Insurance</span>
                <span className="font-bold text-slate-900">${currentSlip.deductions.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-teal-50/50 border border-teal-100 p-4 rounded-xl mt-4">
            <div>
              <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider">Net Take-Home Pay</span>
              <p className="text-3xl font-extrabold text-slate-950 mt-1">${currentSlip.net.toFixed(2)}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold flex items-center gap-1.5 justify-end text-emerald-600">
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Paid via Direct Deposit</span>
              </p>
              <p className="mt-0.5">Disbursed on {currentSlip.paidDate}</p>
            </div>
          </div>
        </div>

        {/* Bank info placeholder */}
        <div className="premium-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="h-5 w-5 text-teal-600" />
              <span>Payment Method</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Bank Name</span>
                <p className="font-bold text-slate-900">JP Morgan Chase Bank</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Account Number</span>
                <p className="font-bold text-slate-900">•••• •••• ••88 94</p>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Download Payslip PDF</span>
          </button>
        </div>
      </div>

      {/* History table */}
      <div className="premium-card p-6">
        <h3 className="font-bold text-slate-900 mb-4">Historical Pay Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-2">Month</th>
                <th className="py-2.5 px-2">Net Salary</th>
                <th className="py-2.5 px-2">Paid Date</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 px-2 text-right">Statements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {history.map((slip, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-2 font-semibold text-slate-900">{slip.month}</td>
                  <td className="py-3.5 px-2">${slip.net.toFixed(2)}</td>
                  <td className="py-3.5 px-2">{slip.paidDate}</td>
                  <td className="py-3.5 px-2">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button className="text-teal-600 hover:text-teal-700 font-bold hover:underline cursor-pointer">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
