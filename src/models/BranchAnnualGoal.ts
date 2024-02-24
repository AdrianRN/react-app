export interface BranchesAnnualGoal {
  annualGoalId?: string;
  folio?: string;
  companyId: string;
  branchId: string;
  amount: number;
  superGoal: number,
  statusProjection?: string;
  objectStatusId?: number;
}

export default BranchesAnnualGoal;
