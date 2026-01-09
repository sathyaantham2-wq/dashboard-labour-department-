
export enum UserRole {
  ADMIN = 'ADMIN',
  ALO = 'ALO', // Assistant Labour Officer
  ACL = 'ACL', // Assistant Commissioner of Labour
  DCL = 'DCL', // Deputy Commissioner of Labour
  JCL = 'JCL', // Joint Commissioner of Labour
  COMMISSIONER = 'COMMISSIONER' // Commissioner of Labour
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  parentId?: string;
  jurisdiction: string;
}

export interface ChildLabourRecord {
  id: string;
  childName: string;
  age: string;
  gender: string;
  caste: string;
  guardianName: string;
  workNature: string;
  cwcDate: string;
  address: string;
  aadhaar: string;
  employerName: string;
  employerPhone: string;
  firNumber: string;
  firDate: string;
  ddDeposited: 'Yes' | 'No';
  minWageStatus: 'Pending' | 'Paid' | 'N/A';
  prosecutionStatus: 'Initiated' | 'Collected' | 'Pending';
  schoolingStatus: 'Never Enrolled' | 'Drop-out' | 'Regular';
  previousSchoolName?: string;
  presentStatus: 'Enrolled in School' | 'Rehabilitation Centre' | 'Shelter Home' | 'Handed over to Parents';
  remarks: string;
}

export interface MonthlySummaryRecord {
  month: string;
  year: string;
  totalIdentified: number;
  nonHazardous: number;
  hazardous: number;
  mcMehtaSettled: number;
  mcMehtaPending: number;
  prosecutionsFiled: number;
  grievanceBeginning: number;
  grievanceReceived: number;
  grievanceDisposed: number;
  grievanceEnd: number;
}

export interface ActWiseRecord {
  actName: string;
  beginningPending: number;
  filedDuringMonth: number;
  disposedDuringMonth: number;
  endPending: number;
  workersBenefitted: number;
  reservedForOrders: number;
}

export interface ACLActSummaryReport {
  month: string;
  year: string;
  acts: ActWiseRecord[];
}

export interface DashboardState {
  role: UserRole;
  jurisdiction: string;
  bocwData: BOCWPendency[];
  shopData: ShopCompliance[];
  caseData: CaseWork[];
  performanceData?: OfficerPerformance[];
  inspections: {
    target: number;
    achieved: number;
    childLabourRescues: number;
  };
}

export interface BOCWPendency {
  scheme: string;
  pending: number;
  processed: number;
  total: number;
}

export interface ShopCompliance {
  category: string;
  registered: number;
  renewalsPending: number;
  returnsCompliance: number;
}

export interface CaseWork {
  type: string;
  filed: number;
  disposed: number;
  pending: number;
}

export interface OfficerPerformance {
  id: string;
  name: string;
  designation: string;
  jurisdiction: string;
  bocwPending: number;
  caseDisposalRate: number;
  inspectionTarget: number;
  inspectionActual: number;
}
