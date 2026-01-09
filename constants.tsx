
import React from 'react';
import { UserRole } from './types';

export const ROLES_CONFIG = {
  [UserRole.ADMIN]: { label: 'System Administrator', description: 'Manage users and hierarchy', color: 'bg-rose-600' },
  [UserRole.ALO]: { label: 'Assistant Labour Officer', description: 'Field monitoring and entry', color: 'bg-emerald-500' },
  [UserRole.ACL]: { label: 'Assistant Commissioner', description: 'Circle oversight', color: 'bg-blue-500' },
  [UserRole.DCL]: { label: 'Deputy Commissioner', description: 'Division analytics', color: 'bg-indigo-500' },
  [UserRole.JCL]: { label: 'Joint Commissioner', description: 'Regional strategy', color: 'bg-violet-500' },
  [UserRole.COMMISSIONER]: { label: 'Commissioner of Labour', description: 'State-wide integrated view', color: 'bg-slate-800' }
};

export const ROLE_HIERARCHY = {
  [UserRole.ALO]: UserRole.ACL,
  [UserRole.ACL]: UserRole.DCL,
  [UserRole.DCL]: UserRole.JCL,
  [UserRole.JCL]: UserRole.COMMISSIONER,
  [UserRole.COMMISSIONER]: null,
  [UserRole.ADMIN]: null,
};

export const CHILD_LABOUR_CONFIG = {
  genders: ['Boy', 'Girl', 'Other'],
  castes: ['SC', 'ST', 'BC', 'General', 'Minority'],
  workNatures: ['Hotel/Eatery', 'Construction', 'Brick Kiln', 'Factory', 'Domestic', 'Agriculture', 'Other'],
  presentStatuses: ['Enrolled in School', 'Rehabilitation Centre', 'Shelter Home', 'Handed over to Parents'],
  schoolingStatuses: ['Never Enrolled', 'Drop-out', 'Regular'],
  legalStatuses: ['Pending', 'Paid', 'N/A', 'Initiated', 'Collected']
};

export const ACL_ACTS = [
  "U/s 48(1) – Telangana Shops & Establishments Act",
  "U/s 50 – Telangana Shops & Establishments Act",
  "Payment of Gratuity Act",
  "Employees’ Compensation Act",
  "Minimum Wages Act",
  "Payment of Wages Act"
];

export const MOCK_BOCW_SCHEMES = ['Natural Death', 'Accidental Death', 'Marriage Gift', 'Maternity Benefit', 'Education Assistance', 'Funeral Expenses'];
export const MOCK_CASE_TYPES = ['Minimum Wages Act', 'Payment of Gratuity Act', 'Workmens Compensation', 'Payment of Wages Act'];
