
import React, { useState } from 'react';
import { UserAccount, ACLActSummaryReport, ActWiseRecord } from '../types';
import { ACL_ACTS } from '../constants';

interface Props {
  user: UserAccount;
  onSubmit: (report: ACLActSummaryReport) => void;
  onCancel: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = ["2024", "2025", "2026"];

const INITIAL_ACT_RECORD = (name: string): ActWiseRecord => ({
  actName: name,
  beginningPending: 0,
  filedDuringMonth: 0,
  disposedDuringMonth: 0,
  endPending: 0,
  workersBenefitted: 0,
  reservedForOrders: 0
});

export const ACLActSummaryForm: React.FC<Props> = ({ user, onSubmit, onCancel }) => {
  const [report, setReport] = useState<ACLActSummaryReport>({
    month: MONTHS[new Date().getMonth()],
    year: "2024",
    acts: ACL_ACTS.map(name => INITIAL_ACT_RECORD(name))
  });

  const updateActField = (index: number, field: keyof ActWiseRecord, value: any) => {
    const numericValue = Number(value);
    const newActs = [...report.acts];
    const targetAct = { ...newActs[index], [field]: numericValue };

    // Auto-calculate endPending
    if (['beginningPending', 'filedDuringMonth', 'disposedDuringMonth'].includes(field)) {
      const end = (targetAct.beginningPending || 0) + (targetAct.filedDuringMonth || 0) - (targetAct.disposedDuringMonth || 0);
      targetAct.endPending = Math.max(0, end);
    }

    newActs[index] = targetAct;
    setReport({ ...report, acts: newActs });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Dynamic Header Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100 p-8 sticky top-20 z-20 backdrop-blur-md bg-white/90">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Act-Wise Summary</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1 italic">
                ACL Portal • {user.name} • {user.jurisdiction}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button onClick={onCancel} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
            <button 
              onClick={() => onSubmit(report)}
              className="flex-1 lg:flex-none bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Submit Act Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Period Selector Section */}
      <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row gap-8 items-center shadow-2xl">
        <div className="flex-1">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Reporting Period</h3>
          <p className="text-slate-400 text-xs">Ensure correct selection for monthly compliance data synchronization.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:w-48 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:text-slate-900 transition-all outline-none"
            value={report.month}
            onChange={(e) => setReport({ ...report, month: e.target.value })}
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            className="flex-1 md:w-32 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:text-slate-900 transition-all outline-none"
            value={report.year}
            onChange={(e) => setReport({ ...report, year: e.target.value })}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* ACT CARDS */}
      <div className="grid grid-cols-1 gap-10">
        {report.acts.map((act, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-slate-200">{idx + 1}</span>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{act.actName}</h3>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uniform Reporting Format v2.1</span>
              </div>
            </div>

            <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Col 1: Beginning & End */}
              <div className="space-y-6">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">01. Beginning of Month (Pending)</label>
                    <input 
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-lg font-black focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                      value={act.beginningPending}
                      onChange={(e) => updateActField(idx, 'beginningPending', e.target.value)}
                    />
                 </div>
                 <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">04. End of Month (Auto-Calc)</label>
                    <div className="text-2xl font-black text-indigo-950 flex items-center justify-between px-2">
                       {act.endPending}
                       <span className="text-[10px] text-indigo-400 italic font-medium">Synced Status</span>
                    </div>
                 </div>
              </div>

              {/* Col 2: Activity Fields */}
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">02. Cases Filed (This Month)</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base font-bold focus:bg-white transition-all outline-none"
                      value={act.filedDuringMonth}
                      onChange={(e) => updateActField(idx, 'filedDuringMonth', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">03. Cases Disposed Off</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-base font-bold focus:bg-white transition-all outline-none"
                      value={act.disposedDuringMonth}
                      onChange={(e) => updateActField(idx, 'disposedDuringMonth', e.target.value)}
                    />
                 </div>
              </div>

              {/* Col 3: Outcomes */}
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 ml-1">05. Workers Benefitted</label>
                    <input 
                      type="number"
                      className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 text-base font-bold focus:bg-white transition-all outline-none"
                      value={act.workersBenefitted}
                      onChange={(e) => updateActField(idx, 'workersBenefitted', e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 ml-1">06. Reserved for Orders</label>
                    <input 
                      type="number"
                      className="w-full bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 text-base font-bold focus:bg-white transition-all outline-none"
                      value={act.reservedForOrders}
                      onChange={(e) => updateActField(idx, 'reservedForOrders', e.target.value)}
                    />
                 </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50/50 flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Formula: {act.beginningPending} (Beginning) + {act.filedDuringMonth} (Filed) - {act.disposedDuringMonth} (Disposed) = {act.endPending}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-10">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] italic opacity-50">
          Departmental Uniform Structure (Uniform-6) • Labour Dept Telangana
        </p>
      </div>
    </div>
  );
};
