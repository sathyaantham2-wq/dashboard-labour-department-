
import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { ROLES_CONFIG } from '../constants';

interface Props {
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export const LoginPage: React.FC<Props> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Simple password check (demo uses 'password' or specific passwords from INITIAL_USERS)
    if (user && (user.password === password || password === '123456')) {
      onLogin(user);
    } else if (email.toLowerCase() === 'admin@telangana.gov.in' && password === 'admin123') {
      onLogin({
        id: 'admin-id',
        name: 'System Admin',
        email: 'admin@telangana.gov.in',
        role: UserRole.ADMIN,
        jurisdiction: 'State-wide'
      });
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-slate-900 text-white p-4 rounded-2xl inline-block mb-4 shadow-xl">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Labour Department</h1>
          <p className="text-slate-500 font-medium">Government of Telangana</p>
          <div className="mt-2 text-xs uppercase tracking-widest text-indigo-600 font-bold">Unified Monitoring Dashboard</div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Officer Secure Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Official Email Address</label>
              <input 
                type="email"
                required
                placeholder="officer@labour.ts.gov.in"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-lg font-medium border border-rose-100 animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50">
            <h3 className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Access for Demo</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => { setEmail('alo.area1@labour.ts.gov.in'); setPassword('123456'); }}
                className="text-[10px] text-left p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-bold text-slate-700">ALO Venkat</div>
                <div className="text-slate-400">Pass: 123456</div>
              </button>
              <button 
                onClick={() => { setEmail('admin@telangana.gov.in'); setPassword('admin123'); }}
                className="text-[10px] text-left p-2 border border-rose-100 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <div className="font-bold text-rose-700">System Admin</div>
                <div className="text-slate-400">Pass: admin123</div>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs">
          By logging in, you agree to the Departmental Security Policy. <br/>
          Internal portal for authorized personnel only.
        </p>
      </div>
    </div>
  );
};
