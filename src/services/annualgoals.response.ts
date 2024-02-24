export interface GetBranchesProfileAllByYearResponse {
  year: number;
  dateGoals: string;
  editingReason: string;
  companies: Partial_GetBranchesProfileAllByYearResponse_Company[];
  objectStatusId: number;
}

export interface Partial_GetBranchesProfileAllByYearResponse_Company {
  companyId: string;
  company: Partial_GetBranchesProfileAllByYearResponse_Company_Company;
  branches: Partial_GetBranchesProfileAllByYearResponse_Companies_Branch[];
}

interface Partial_GetBranchesProfileAllByYearResponse_Company_Company {
  companyTypeId: string;
  companyType: Partial_GetBranchesProfileAllByYearResponse_Companies_Company_CompanyType;
  corporateName: string;
  abbreviation: string;
  logo: string;
  website: string;
}
interface Partial_GetBranchesProfileAllByYearResponse_Companies_Company_CompanyType {
  description: string;
}
export interface Partial_GetBranchesProfileAllByYearResponse_Companies_Branch {
  branchId: string;
  branch: Partial_GetBranchesProfileAllByYearResponse_Companies_Branch_Branch;
  amount: number;
  branchAnnualGoalId?: string;
  superGoal: number;
}
interface Partial_GetBranchesProfileAllByYearResponse_Companies_Branch_Branch {
  catalogValueId: string;
  //catalogValue: Partial_GetBranchesProfileAllByYearResponse_Companies_Branch_Branch_CatalogValue;
  expirationDates: number;
  description: string;
}
interface Partial_GetBranchesProfileAllByYearResponse_Companies_Branch_Branch_CatalogValue {
  description: string;
}
