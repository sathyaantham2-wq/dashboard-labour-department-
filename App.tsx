
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, DashboardState, UserAccount, ChildLabourRecord, MonthlySummaryRecord, ACLActSummaryReport } from './types';
import { ROLES_CONFIG } from './constants';
import { generateDashboardData } from './services/mockDataService';
import { DashboardCard } from './components/DashboardCard';
import { BOCWPieChart, ComplianceBarChart } from './components/Charts';
import { GeminiIntelligence } from './components/GeminiIntelligence';
import { UserManagement } from './components/UserManagement';
import { LoginPage } from './components/LoginPage';
import { MonthlySummaryForm } from './components/MonthlySummaryForm';
import { ACLActSummaryForm } from './components/ACLActSummaryForm';

const INITIAL_USERS: UserAccount[] = [
  { id: 'usr-1', name: 'Commissioner Rajesh', email: 'col@labour.ts.gov.in', password: 'password', role: UserRole.COMMISSIONER, jurisdiction: 'State-wide' },
  { id: 'usr-2', name: 'JCL Srinivas', email: 'jcl.hyd@labour.ts.gov.in', password: 'password', role: UserRole.JCL, parentId: 'usr-1', jurisdiction: 'Hyderabad Region' },
  { id: 'usr-3', name: 'DCL Anitha', email: 'dcl.south@labour.ts.gov.in', password: 'password', role: UserRole.DCL, parentId: 'usr-2', jurisdiction: 'South Zone' },
  { id: 'usr-4', name: 'ACL Mahesh', email: 'acl.circle1@labour.ts.gov.in', password: 'password', role: UserRole.ACL, parentId: 'usr-3', jurisdiction: 'Circle 1' },
  { id: 'usr-5', name: 'ALO Venkat', email: 'alo.area1@labour.ts.gov.in', password: 'password', role: UserRole.ALO, parentId: 'usr-4', jurisdiction: 'Area 1' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('labour_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Session load error:", e);
      return null;
    }
  });
  
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('labour_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      console.error("User list load error:", e);
      return INITIAL_USERS;
    }
  });

  const [data, setData] = useState<DashboardState | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'form'>('dashboard');

  useEffect(() => {
    localStorage.setItem('labour_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('labour_session', JSON.stringify(currentUser));
      const fetchedData = generateDashboardData(currentUser.role, currentUser.jurisdiction);
      setData(fetchedData);
      
      if (currentUser.role === UserRole.ADMIN) {
        setActiveTab('users');
      } else if (activeTab === 'users') {
        setActiveTab('dashboard');
      }
    } else {
      localStorage.removeItem('labour_session');
      setData(null);
    }
  }, [currentUser]);

  const stats = useMemo(() => {
    if (!data) return [];
    
    // Safeguard division by zero for shop compliance
    const shopCount = data.shopData.length;
    const avgCompliance = shopCount > 0 
      ? Math.round(data.shopData.reduce((acc, d) => acc + d.returnsCompliance, 0) / shopCount) 
      : 0;

    return [
      { 
        title: 'BOCW Pendency', 
        value: data.bocwData.reduce((acc, d) => acc + d.pending, 0),
        subtitle: 'Applications at ALO level',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
        trend: { value: 12, isUp: false }
      },
      { 
        title: 'Shops Registered', 
        value: data.shopData.reduce((acc, d) => acc + d.registered, 0).toLocaleString(),
        subtitle: 'Total active registrations',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
        trend: { value: 3, isUp: true }
      },
      { 
        title: 'Compliance Rate', 
        value: `${avgCompliance}%`,
        subtitle: 'Average returns filed',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
      },
      { 
        title: 'Inspections', 
        value: `${data.inspections.achieved}/${data.inspections.target}`,
        subtitle: 'Against monthly target',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
        colorClass: "bg-emerald-50"
      }
    ];
  }, [data]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleMonthlySummarySubmit = (record: MonthlySummaryRecord) => {
    alert(`Monthly Summary for ${record.month} ${record.year} submitted successfully.`);
    setActiveTab('dashboard');
  };

  const handleACLActSummarySubmit = (report: ACLActSummaryReport) => {
    alert(`Act-wise Summary for ${report.month} ${report.year} submitted successfully.`);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <LoginPage users={users} onLogin={setCurrentUser} />;
  }

  if (!data && currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div>
        <p className="font-bold text-slate-900 uppercase tracking-widest text-xs">Departmental Data Synchronization Active</p>
      </div>
    );
  }

  const isDataEntryEnabled = currentUser.role === UserRole.ALO || currentUser.role === UserRole.ACL;

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-white p-2 rounded-lg ${ROLES_CONFIG[currentUser.role]?.color || 'bg-slate-600'}`}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Labour Dept Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Government of Telangana</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg mr-4">
              {currentUser.role !== UserRole.ADMIN && (
                <>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Dashboard
                  </button>
                  {isDataEntryEnabled && (
                    <button 
                      onClick={() => setActiveTab('form')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {currentUser.role === UserRole.ALO ? 'Monthly Summary' : 'Act-Wise Summary'}
                    </button>
                  )}
                </>
              )}
              {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COMMISSIONER) && (
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Admin Panel
                </button>
              )}
            </nav>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-bold text-slate-900 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{ROLES_CONFIG[currentUser.role]?.label}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-600 transition-colors p-2 ml-2"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {activeTab === 'users' ? (
          <UserManagement 
            users={users} 
            onAddUser={(u) => setUsers([...users, u])} 
            onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))} 
          />
        ) : activeTab === 'form' ? (
          <>
            {currentUser.role === UserRole.ALO && (
              <MonthlySummaryForm 
                user={currentUser}
                onSubmit={handleMonthlySummarySubmit}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}
            {currentUser.role === UserRole.ACL && (
              <ACLActSummaryForm 
                user={currentUser}
                onSubmit={handleACLActSummarySubmit}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}
          </>
        ) : data && (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Departmental Intelligence</h2>
                <p className="text-slate-500 font-medium">{currentUser.jurisdiction} • {ROLES_CONFIG[currentUser.role]?.label}</p>
              </div>
              <div className="flex gap-2">
                {isDataEntryEnabled && (
                  <button 
                    onClick={() => setActiveTab('form')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    New Summary Entry
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <DashboardCard key={i} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <BOCWPieChart data={data.bocwData} title="BOCW Welfare Schemes: Application Pendency" />
              <ComplianceBarChart data={data.shopData} title="Compliance Snapshot: Return Filings" />
            </div>

            <GeminiIntelligence data={data} />

            {data.performanceData && (
              <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-slate-900 font-black uppercase tracking-widest text-[10px]">
                    {currentUser.role === UserRole.COMMISSIONER ? 'State-Wide Command Centre (Regional Performance)' : 'Subordinate Officer Monitoring'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Sync</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                        <th className="px-8 py-5">Officer Details</th>
                        <th className="px-8 py-5">Jurisdiction</th>
                        <th className="px-8 py-5">BOCW Backlog</th>
                        <th className="px-8 py-5">Efficiency</th>
                        <th className="px-8 py-5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.performanceData.map((officer) => (
                        <tr key={officer.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-bold text-slate-900 text-sm">{officer.name}</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase">{officer.designation}</div>
                          </td>
                          <td className="px-8 py-5 text-xs font-semibold text-slate-500">{officer.jurisdiction}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-sm font-black ${officer.bocwPending > 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                                {officer.bocwPending}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">FILES</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${officer.caseDisposalRate > 85 ? 'bg-emerald-500' : officer.caseDisposalRate > 70 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                                  style={{ width: `${officer.caseDisposalRate}%` }}
                                />
                              </div>
                              <span className="text-xs font-black text-slate-700">{officer.caseDisposalRate}%</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ${officer.caseDisposalRate > 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {officer.caseDisposalRate > 75 ? 'Optimal' : 'Review Required'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          <div className="flex gap-6">
            <span className="text-slate-900">© 2024 Labour Dept, Telangana</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Gateway Integrated
            </span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-600 cursor-help transition-colors font-mono tracking-tight">V3.2-STABLE-DEPLOY</span>
            <span className="hover:text-slate-600 cursor-help transition-colors font-mono tracking-tight">LATENCY: 120ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
