
import React, { useState } from 'react';
import { UserRole, UserAccount } from '../types';
import { ROLES_CONFIG, ROLE_HIERARCHY } from '../constants';

interface Props {
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<Props> = ({ users, onAddUser, onDeleteUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserAccount>>({
    role: UserRole.ALO,
    jurisdiction: 'Hyderabad Central'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.email && newUser.role) {
      onAddUser({
        ...newUser as UserAccount,
        id: `usr-${Date.now()}`,
      });
      setShowAddModal(false);
      setNewUser({ role: UserRole.ALO, jurisdiction: 'Hyderabad Central' });
    }
  };

  const getSupervisorOptions = (role: UserRole) => {
    const parentRole = ROLE_HIERARCHY[role];
    if (!parentRole) return [];
    return users.filter(u => u.role === parentRole);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-slate-900 font-bold uppercase tracking-tight text-sm">User & Hierarchy Management</h3>
          <p className="text-xs text-slate-500">Configure officer logins and reporting structures</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
        >
          Create New Login
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-3">Officer Details</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Reports To (Mapping)</th>
              <th className="px-6 py-3">Jurisdiction</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const supervisor = users.find(u => u.id === user.parentId);
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 text-sm">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${ROLES_CONFIG[user.role].color} text-white`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {supervisor ? (
                      <div>
                        <div className="text-xs font-semibold text-slate-700">{supervisor.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{supervisor.role}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None (Top Level)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{user.jurisdiction}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                    >
                      Revoke Access
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Provision New Officer Account</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designated Role</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole, parentId: undefined})}
                    >
                      {Object.values(UserRole).filter(r => r !== UserRole.ADMIN).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jurisdiction</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      value={newUser.jurisdiction}
                      onChange={(e) => setNewUser({...newUser, jurisdiction: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Map to Supervisor (Hierarchy)</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    value={newUser.parentId || ''}
                    onChange={(e) => setNewUser({...newUser, parentId: e.target.value})}
                  >
                    <option value="">Select Supervisor...</option>
                    {getSupervisorOptions(newUser.role as UserRole).map(sup => (
                      <option key={sup.id} value={sup.id}>{sup.name} ({sup.role})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Mapping logic: {newUser.role} reports to {ROLE_HIERARCHY[newUser.role as UserRole] || 'None'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-200"
                >
                  Create & Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
