export interface AnnualGoal {
  annualGoalId?: string;
  folio?: string;
  year: string;
  dateGoals: string;
  statusAnnualGoalId: string;
  statusAnnualGoal?: { description: string; folio: string };
  editingReason: {
    reason: string,
    updatedAt: string,
    updatedBy: string
  }[];
  approvingReason: {
    reason: string,
    updatedAt: string,
    updatedBy: string
  }[];
  objectStatusId?: number;
}

export default AnnualGoal;
