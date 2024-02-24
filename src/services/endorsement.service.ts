import axios from 'axios';
import { API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

export async function getEndorsements(): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/GetEndorSement`);
    return response.data;   
}
export async function getEndorsementPolicy(policy: string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/GetEndorSementPolicy/${policy}`);
    return response.data;   
}
export async function getEndorsementFolio(folio: string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/GetEndorSementFolio/${folio}`);
    return response.data;   
}

export async function getEndorsementsByPolicyFolio(folioOT: string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/GetEndorSementFolioOT/${folioOT}`);
    return response.data;   
}

export async function postEndorsement(obj: object): Promise<ResultObject>{
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PostEndorSement`, obj)
    return response.data
}

export async function putEndorsement(id: string, obj: object): Promise<ResultObject> {
  const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorSementFolio?Folio=${id}`, obj);
  return response.data;
}

export async function putEndorsementOne(id: string, obj: object): Promise<ResultObject> {
  const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorSementOne?Folio=${id}`, obj);
  return response.data;
}

export async function putEndorsementPolicies(endosoFolio: string,folioEndorsement:string,polizaFolio:string, obj: object): Promise<ResultObject> {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorSementPolicies?FolioEndo=${endosoFolio}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${polizaFolio}`, obj);
    return response.data;
  }

const deleteEndorsement = async(Folio: string): Promise<ResultObject> =>{
  const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/DeleteEndorSementFolio/${Folio}`);
  return response.data;
};

export async function postEndorsementPolicie(endosoId:string,poliza: object): Promise<ResultObject>{
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PostEndorSementPolicies?FolioEndo=${endosoId}`,poliza)
    
    return response.data
}

export async function postEndorsementVehicle(folioEndo:string, folioEndorsement:string,folioPolicies:string, vehicle: object): Promise<ResultObject>{
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PostEndorSementVehicle?FolioEndo=${folioEndo}&folioEndorsement=${folioEndorsement}&folioPolicies=${folioPolicies}`,vehicle)
    
    return response.data
}

export async function deleteEndorsementVehicle(folioEndo:string, folioEndorsement:string,folioPolicies:string, folioVehicle: string): Promise<ResultObject>{
  const response = await axios.delete<ResultObject>
(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/DeleteEndorSementVehicle?FolioEndo=${folioEndo}&folioEndorsement=${folioEndorsement}&folioPolicies=${folioPolicies}&folioVehicle=${folioVehicle}`)
  
  return response.data
}
export async function putEndorsementPoliciesCoveragePackage(folioEndo: string,folioEndorsement:string,folioPolicies:string,packageFolio:string): Promise<ResultObject> {
  const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorSementPoliciesCoveragePackage?FolioEndo=${folioEndo}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${folioPolicies}&CoveragePackageFolio=${packageFolio}`);

  return response.data;
}

  export async function patchEndorSementCPackage(folioEndo: string, folioOt:string, packageFolio:string): Promise<ResultObject> {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PatchEndorSementCPackage/${folioEndo}?folioOt=${folioOt}&customPackageFolio=${packageFolio}`);
    return response.data;
  }

  //Vehiculos
  export async function patchVehicleBeneficiaryFolio(folioEndo:string, folioEndorsement:string,folioPolicies:string,folioVehicle:string,beneficiaryFolio:string): Promise<ResultObject> {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PatchVehicleBeneficiaryFolio?FolioEndo=${folioEndo}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${folioPolicies}&FolioVehicle=${folioVehicle}&BeneficiaryFolio=${beneficiaryFolio}`);
    return response.data;
  }

  export async function putEndorSementVehicle(folioEndo: string, folioEndorsement:string ,folioVehicle:string, folioPolicies:string,data:any): Promise<ResultObject> {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorSementVehicle?FolioEndo=${folioEndo}&FolioEndorsement=${folioEndorsement}&FolioVehicle=${folioVehicle}&FolioPolicies=${folioPolicies}`,data);
    return response.data;
  }
//----------------------------------------------------Personas
  export async function postEndorsementPerson(endosoId:string, folioEndorsement:string, folioPolicies:string, persona: object): Promise<ResultObject>{
    const response = await axios.post<ResultObject>
(`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PostEndorsementPerson?FolioEndo=${endosoId}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${folioPolicies}`,persona)
    return response.data
  }
  export async function deleteEndorsementPerson(folioEndo:string, folioEndorsement:string, folioPolicies:string, policiePersonId: string): Promise<ResultObject>{
    const response = await axios.delete<ResultObject>
  (`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/DeleteEndorsementPerson?FolioEndo=${folioEndo}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${folioPolicies}&PoliciePersonId=${policiePersonId}`)
    return response.data
  }
  export async function putEndorsementPerson(folioEndo: string,folioEndorsement:string,folioPolicies:string, policiePersonId:string, object: any): Promise<ResultObject> {
    const response = await axios.put<ResultObject>
    (`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PutEndorsementPerson?FolioEndo=${folioEndo}&FolioEndorsement=${folioEndorsement}&FolioPolicies=${folioPolicies}&PoliciePersonId=${policiePersonId}`,object);
    return response.data;
  }
  //Efectos en la poliza original
  export async function policyEndorsementIssuance(policyFolio:string, obj: any): Promise<ResultObject> {
    const response = 
    await axios.patch<ResultObject>
    (`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PolicyEndorsementIssuance?policyFolio=${policyFolio}`,obj);
    return response.data;
  }
  export async function policyEndorsementPayment(policyFolio:string, obj: any): Promise<ResultObject> {
    const response = 
    await axios.patch<ResultObject> 
    (`${API_URL_INSURANCE}/${Enviroment.apiEndorsement}/PolicyEndorsementPayment?policyFolio=${policyFolio}`,obj);
    return response.data;
  }

export const endorsementService = {
    getEndorsements,
    getEndorsementPolicy,
    getEndorsementFolio,
    getEndorsementsByPolicyFolio,
    postEndorsement,
    postEndorsementVehicle,
    putEndorsementPoliciesCoveragePackage,
    postEndorsementPolicie,
    putEndorsement,
    putEndorsementPolicies,
    deleteEndorsement,
    putEndorsementOne,
    patchEndorSementCPackage,
    deleteEndorsementVehicle,
    patchVehicleBeneficiaryFolio,
    putEndorSementVehicle,
    //Personas
    postEndorsementPerson,
    deleteEndorsementPerson,
    putEndorsementPerson,
    //Poliza original
    policyEndorsementIssuance,
    policyEndorsementPayment,
}