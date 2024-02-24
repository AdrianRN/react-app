export interface Company {
  folio: string,
  companyTypeId: string,
  companyType: {
    description: string,
    folio: string
  },
  corporateName: string,
  abbreviation: string,
  logo: string,
  statusId: string,
  proratingId: string,
  prorating: {
    description: string,
    folio: string
  },
  financing: number,
  maturities: string,
  agent: string,
  commissions: number,
  companyNumber?: string,
  objectStatusId: number
}

export default Company