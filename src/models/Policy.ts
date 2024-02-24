export interface IPolicie {
    insurancecompany: string,
    insuranceId: string,
    branchId: string,
    subBranchId: string,
    policy: string,
    clientId: string,

    /** */
    

    

}
  
  
  
  
export class Policie implements IPolicie {
    insurancecompany: string="";
    insuranceId: string="";
    branchId: string="";
    subBranchId: string="";
    policy: string="";
    clientId: string="";
    
}
  
  
  export default Policie;
  