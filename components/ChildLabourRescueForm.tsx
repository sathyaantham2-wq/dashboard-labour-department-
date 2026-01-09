
import React, { useState } from 'react';
import { ChildLabourRecord } from '../types';
import { CHILD_LABOUR_CONFIG } from '../constants';

interface Props {
  onSubmit: (records: ChildLabourRecord[]) => void;
  onCancel: () => void;
}

const EMPTY_RECORD = (): ChildLabourRecord => ({
  id: Math.random().toString(36).substr(2, 9),
  childName: '',
  age: '',
  gender: 'Boy',
  caste: 'General',
  guardianName: '',
  workNature: 'Hotel/Eatery',
  cwcDate: new Date().toISOString().split('T')[0],
  address: '',
  aadhaar: '',
  employerName: '',
  employerPhone: '',
  firNumber: '',
  firDate: new Date().toISOString().split('T')[0],
  ddDeposited: 'No',
  minWageStatus: 'Pending',
  prosecutionStatus: 'Pending',
  schoolingStatus: 'Never Enrolled',
  presentStatus: 'Enrolled in School',
  remarks: ''
});

export const ChildLabourRescueForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [records, setRecords] = useState<ChildLabourRecord[]>([EMPTY_RECORD()]);

  const addRow = () => setRecords([...records, EMPTY_RECORD()]);
  
  const removeRow = (index: number) => {
    if (records.length > 1) {
      const newRecords = [...records];
      newRecords.splice(index, 1);
      setRecords(newRecords);
    }
  };

  const updateField = (index: number, field: keyof ChildLabourRecord, value: any) => {
    const newRecords = [...records];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setRecords(newRecords);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-20 z-20">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Case Registration</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Field-Level Data Entry Portal</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={addRow}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Add Case
          </button>
          <button 
            onClick={() => onSubmit(records)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
          >
            Submit All Records
          </button>
        </div>
      </div>

      {/* Vertical List of Child Entry Cards */}
      <div className="space-y-6">
        {records.map((record, idx) => (
          <div key={record.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
            {/* Card Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  {record.childName || 'New Entry'}
                </h3>
              </div>
              <button 
                onClick={() => removeRow(idx)}
                disabled={records.length === 1}
                className="text-slate-300 hover:text-rose-600 disabled:opacity-0 transition-colors p-2"
                title="Remove Entry"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Section 1: Demographic Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-indigo-600"></span> Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Full Name *</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all font-semibold"
                      placeholder="Enter full name"
                      value={record.childName}
                      onChange={(e) => updateField(idx, 'childName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Age</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                        placeholder="Yrs"
                        value={record.age}
                        onChange={(e) => updateField(idx, 'age', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Gender</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                        value={record.gender}
                        onChange={(e) => updateField(idx, 'gender', e.target.value)}
                      >
                        {CHILD_LABOUR_CONFIG.genders.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Parent / Guardian</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      placeholder="Father/Mother/Guardian"
                      value={record.guardianName}
                      onChange={(e) => updateField(idx, 'guardianName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Residential Address</label>
                    <textarea 
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none"
                      placeholder="Complete address details"
                      value={record.address}
                      onChange={(e) => updateField(idx, 'address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Employer & Occupation */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-amber-600"></span> Occupation Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Employer / Establishment</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      placeholder="Name and location details"
                      value={record.employerName}
                      onChange={(e) => updateField(idx, 'employerName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Work Nature</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      value={record.workNature}
                      onChange={(e) => updateField(idx, 'workNature', e.target.value)}
                    >
                      {CHILD_LABOUR_CONFIG.workNatures.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Employer Phone</label>
                    <input 
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      placeholder="10-digit mobile"
                      value={record.employerPhone}
                      onChange={(e) => updateField(idx, 'employerPhone', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">FIR Number</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                        placeholder="FIR No."
                        value={record.firNumber}
                        onChange={(e) => updateField(idx, 'firNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">FIR Date</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                        value={record.firDate}
                        onChange={(e) => updateField(idx, 'firDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Legal, Schooling & Rehab */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-emerald-600"></span> Compliance & Rehab
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">₹20k DD Paid?</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                        value={record.ddDeposited}
                        onChange={(e) => updateField(idx, 'ddDeposited', e.target.value)}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Education Status</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
                        value={record.schoolingStatus}
                        onChange={(e) => updateField(idx, 'schoolingStatus', e.target.value)}
                      >
                        {CHILD_LABOUR_CONFIG.schoolingStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {record.schoolingStatus === 'Drop-out' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-bold text-indigo-600 mb-1.5 ml-1">Last School Attended</label>
                      <input 
                        className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm"
                        placeholder="Enter school name"
                        value={record.previousSchoolName}
                        onChange={(e) => updateField(idx, 'previousSchoolName', e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Present Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      value={record.presentStatus}
                      onChange={(e) => updateField(idx, 'presentStatus', e.target.value)}
                    >
                      {CHILD_LABOUR_CONFIG.presentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Internal Remarks</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      placeholder="Observations..."
                      value={record.remarks}
                      onChange={(e) => updateField(idx, 'remarks', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Add Button below cards */}
      <div className="flex justify-center py-10">
        <button 
          onClick={addRow}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add Another Entry
        </button>
      </div>

      {/* Footer Branding */}
      <div className="flex justify-center pb-10">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">
            Certified Field Entry • Labour Department Government of Telangana
         </p>
      </div>
    </div>
  );
};
