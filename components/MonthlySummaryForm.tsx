
import React, { useState, useEffect } from 'react';
import { MonthlySummaryRecord, UserAccount } from '../types';

interface Props {
  user: UserAccount;
  onSubmit: (record: MonthlySummaryRecord) => void;
  onCancel: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = ["2024", "2025", "2026"];

export const MonthlySummaryForm: React.FC<Props> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MonthlySummaryRecord>({
    month: MONTHS[new Date().getMonth()],
    year: "2024",
    totalIdentified: 0,
    nonHazardous: 0,
    hazardous: 0,
    mcMehtaSettled: 0,
    mcMehtaPending: 0,
    prosecutionsFiled: 0,
    grievanceBeginning: 0,
    grievanceReceived: 0,
    grievanceDisposed: 0,
    grievanceEnd: 0,
  });

  // Auto-calculate End Pending for Grievances
  useEffect(() => {
    const end = (Number(formData.grievanceBeginning) || 0) + 
                (Number(formData.grievanceReceived) || 0) - 
                (Number(formData.grievanceDisposed) || 0);
    setFormData(prev => ({ ...prev, grievanceEnd: Math.max(0, end) }));
  }, [formData.grievanceBeginning, formData.grievanceReceived, formData.grievanceDisposed]);

  const updateField = (field: keyof MonthlySummaryRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validations
  const isWorkNatureValid = (Number(formData.nonHazardous) + Number(formData.hazardous)) <= Number(formData.totalIdentified);
  const isCompensationValid = (Number(formData.mcMehtaSettled) + Number(formData.mcMehtaPending)) <= Number(formData.totalIdentified);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Sticky Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-20 z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="bg-slate-900 text-white p-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </span>
              Monthly Summary Report
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              <span>ALO: {user.name}</span>
              <span>•</span>
              <span>Mandal: {user.jurisdiction}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <button onClick={onCancel} className="flex-1 md:flex-none px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
             <button 
               disabled={!isWorkNatureValid || !isCompensationValid}
               onClick={() => onSubmit(formData)}
               className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-slate-200"
             >
               Finalize Monthly Submission
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Period Selection */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-6 h-0.5 bg-indigo-600"></span> Reporting Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Reporting Month</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.month}
                onChange={(e) => updateField('month', e.target.value)}
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Reporting Year</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.year}
                onChange={(e) => updateField('year', e.target.value)}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* MERGED: Child Labour Identification & Compensation/Legal */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-4">
            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-6 h-0.5 bg-amber-600"></span> Child Labour (Monthly Aggregate Data)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter mt-2 md:mt-0">Sections A, B & C Combined</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Identification Sub-section */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-slate-200 pl-3">I. Identification</h4>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-600 ml-1">Total Children Identified (Aggregate)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xl font-black focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={formData.totalIdentified}
                    onChange={(e) => updateField('totalIdentified', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Non-Hazardous</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                      value={formData.nonHazardous}
                      onChange={(e) => updateField('nonHazardous', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">Hazardous</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                      value={formData.hazardous}
                      onChange={(e) => updateField('hazardous', e.target.value)}
                    />
                  </div>
                </div>
                {!isWorkNatureValid && (
                  <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 italic">
                    Validation Error: Nature of work counts cannot exceed total identified.
                  </p>
                )}
              </div>
            </div>

            {/* Compensation & Legal Sub-section */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-slate-200 pl-3">II. Compensation & Legal Action</h4>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">₹20k Settled</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                      value={formData.mcMehtaSettled}
                      onChange={(e) => updateField('mcMehtaSettled', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase">₹20k Pending</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                      value={formData.mcMehtaPending}
                      onChange={(e) => updateField('mcMehtaPending', e.target.value)}
                    />
                  </div>
                </div>
                {!isCompensationValid && (
                  <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-100 italic">
                    Validation Error: Sum of compensation cases cannot exceed total identified.
                  </p>
                )}
                
                <div className="pt-4 border-t border-slate-50">
                  <label className="text-xs font-bold text-slate-600 ml-1">Prosecutions Filed (CL Act)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.prosecutionsFiled}
                    onChange={(e) => updateField('prosecutionsFiled', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Individual Grievances */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-6 h-0.5 bg-rose-600"></span> Individual Grievances (Monthly Status)
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase leading-tight">Opening Pending</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                  value={formData.grievanceBeginning}
                  onChange={(e) => updateField('grievanceBeginning', e.target.value)}
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase leading-tight">Received</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                  value={formData.grievanceReceived}
                  onChange={(e) => updateField('grievanceReceived', e.target.value)}
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase leading-tight">Disposed</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                  value={formData.grievanceDisposed}
                  onChange={(e) => updateField('grievanceDisposed', e.target.value)}
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-rose-600 ml-1 uppercase leading-tight">Closing Pending</label>
                <div className="w-full bg-rose-50 border border-rose-100 text-rose-900 rounded-xl px-4 py-3 text-lg font-black flex items-center justify-center">
                   {formData.grievanceEnd}
                </div>
             </div>
          </div>
          <div className="pt-4 flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                Rule: Beginning Pending + Received − Disposed = End Pending. Closing balance is auto-derived by the system.
             </p>
          </div>
        </div>
      </div>

      <div className="text-center italic opacity-40">
        <p className="text-[10px] font-bold tracking-widest uppercase">Labour Monitoring System • Government of Telangana</p>
      </div>
    </div>
  );
};
