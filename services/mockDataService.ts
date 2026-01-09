
import { UserRole, DashboardState, BOCWPendency, ShopCompliance, CaseWork, OfficerPerformance } from '../types';
import { MOCK_BOCW_SCHEMES, MOCK_CASE_TYPES } from '../constants';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateDashboardData = (role: UserRole, jurisdiction: string): DashboardState => {
  const isHighLevel = [UserRole.DCL, UserRole.JCL, UserRole.COMMISSIONER, UserRole.ADMIN].includes(role);
  const multiplier = isHighLevel ? 15 : 2;

  const bocwData: BOCWPendency[] = MOCK_BOCW_SCHEMES.map(scheme => ({
    scheme,
    pending: randomInt(10 * multiplier, 50 * multiplier),
    processed: randomInt(100 * multiplier, 300 * multiplier),
    total: 0 // Will calculate
  })).map(d => ({ ...d, total: d.pending + d.processed }));

  const shopData: ShopCompliance[] = [
    { category: 'Shops', registered: 1200 * multiplier, renewalsPending: 150 * multiplier, returnsCompliance: 82 },
    { category: 'Commercial Establishments', registered: 800 * multiplier, renewalsPending: 90 * multiplier, returnsCompliance: 75 },
    { category: 'Hotels/Theatres', registered: 200 * multiplier, renewalsPending: 20 * multiplier, returnsCompliance: 90 },
  ];

  const caseData: CaseWork[] = MOCK_CASE_TYPES.map(type => ({
    type,
    filed: randomInt(20 * multiplier, 60 * multiplier),
    disposed: randomInt(15 * multiplier, 50 * multiplier),
    pending: randomInt(5 * multiplier, 25 * multiplier)
  }));

  let performanceData: OfficerPerformance[] | undefined;
  
  const subRoles: Partial<Record<UserRole, { sub: string; count: number }>> = {
    [UserRole.ACL]: { sub: 'ALO', count: 5 },
    [UserRole.DCL]: { sub: 'ACL', count: 3 },
    [UserRole.JCL]: { sub: 'DCL', count: 4 },
    [UserRole.COMMISSIONER]: { sub: 'JCL', count: 6 }
  };

  const config = subRoles[role];
  if (config) {
    performanceData = Array.from({ length: config.count }).map((_, i) => ({
      id: `off-${i}`,
      name: `Officer ${String.fromCharCode(65 + i)}`,
      designation: config.sub,
      jurisdiction: `${jurisdiction} - Circle ${i + 1}`,
      bocwPending: randomInt(20, 100),
      caseDisposalRate: randomInt(60, 95),
      inspectionTarget: 40,
      inspectionActual: randomInt(30, 45)
    }));
  }

  return {
    role,
    jurisdiction,
    bocwData,
    shopData,
    caseData,
    performanceData,
    inspections: {
      target: 50 * multiplier,
      achieved: 42 * multiplier,
      childLabourRescues: randomInt(2, 10) * multiplier
    }
  };
};
