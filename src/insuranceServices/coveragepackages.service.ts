import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

const getByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackage}/${folio}`);
    return response.data;
}

const getByCompanyFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackage}/${folio}/all`);
    return response.data;
}

const getByBranchCompany = async (insuranceCompanyFolio: string, branchFolio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackage}/${insuranceCompanyFolio}/insuranceCompanyFolio/${branchFolio}/branchFolio`);
  return response.data;
}

const postCoveragePackage = async (pack:any) : Promise<ResultObject> => 
 {
    try {
      const response =  await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackage}/`,pack);
      return response.data;
    } catch (error) {
      console.error('Error in postCoveragePackage:', error);
      throw error;
    }
  };
const getByCompanySubBranchFolio = async (insuranceCompanyfolio: any, subBranchFolio: any): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackage}/by-params?insuranceCompanyFolio=${insuranceCompanyfolio}&subBranchFolio=${subBranchFolio}`);
    return response.data;
}

const CoveragePackagesService = {
    getByFolio,
    getByCompanyFolio,
    postCoveragePackage,
    getByCompanySubBranchFolio,
    getByBranchCompany,
}

export default CoveragePackagesService