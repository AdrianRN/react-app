export interface BranchCommission {
  folio: string;
  branch: string;
  branchDescription: string;
  percentage: number;
}
  
export interface Commission {
  commissionId: string;
  folio: string;
  typePerson: string;
  personId: string;
  branchCommission: BranchCommission[];
}
  
export interface People {
  sector: string
  folio: string,
  name: string,
  lastName: string,
  maternalLastName: string,
  rfc: string,
  curp: string,
  birthPlace: number,
  birthDay: string,
  genderId: string,
  email: string,
  password: string,
  groupId: string,
  originId: string,
  financialProfile: 1,
  paymentTerm: true,
  vip: boolean,
  politicallyExposed: true,
  nationality: string,
  nationalities:{
    description:string
  }
  collectionReminde: true,
  initials: string,
  signature: string,
  profileId: string,
  objectStatusId: 1,
  taskss: [],
  //companies: [],
  message: [],
  address: [],
  typePersonId: string,
  companyId: string,
  isSeller: boolean,
  healt: number,
  branch: string,
  leader: boolean,
  bondsExecutive: boolean,
  commissionSeller?: Commission[],
  isBeneficiary: boolean,
}

export default People