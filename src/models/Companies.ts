export interface Companies {
    companyTypeId: string,
    companyType: string,
    corporateName: string,
    abbreviation: string,
    rfc: string,
    logo: string,
    website: string,
    statusId: string,
    maturities: string,
    proratingId: string,
    financing: number,
    agentId: string,
    commissionsId: string,
    objectStatusId: number,
    addressAux: string,
    address: any[],
    contact: string,
    folio:string,
   

  }

  //  export interface CompanyBranches {
  //     companyId: string,
  //     branchId: [
  //       string
  //     ]
  //   }
   
  
export default Companies

