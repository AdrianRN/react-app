export interface IFilter {
   id:string
   folio:string,
   title:string,
   days:string,
   initialExpirationDay:number,
   finalExpirationDay:number,
   initialDayExpired:number,
   finalDayExpired:number,
   companyFolio:string,
   branchFolio:string,
   groupFolio:string,
   creditCustomerFolio:any,
   creditCustomerName:any,
   userFolio: string
  }
  
  export default IFilter;
  