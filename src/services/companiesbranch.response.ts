export interface GetCompaniesBranchesCompanyIdResponse {
  branch: PartialBranchResponse;
  branchId: string;
  companyBranchId: string;
  companyId: string;
  folio: string;
  
}
interface PartialBranchResponse {
  catalogValue: PartialCatalogValueResponse;
  catalogValueId: string;
  expirationDates: number;
  folio: string;
  description: string;
  issuingCost: number;
  paymentMethods: PaymentMethodsResponse;
}
interface PartialCatalogValueResponse {
  description: string;
  folio: string;
}
interface PaymentMethodsResponse{
  folio: string;
  paymentMethod: string;
  description: string;
  surcharge :number;
}