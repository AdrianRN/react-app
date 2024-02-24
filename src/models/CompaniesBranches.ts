export interface CompaniesBranches {
  companyBranchFolio: string,
  companyId: string,
  branchId: string,
  branch: {
    description: string,
    folio: string,
    issuingCost: number,
    paymentMethods: [
      {
        folio: string,
        paymentMethod: string,
        description: string,
        surcharge: number
      }
    ]
  }
}

export default CompaniesBranches;