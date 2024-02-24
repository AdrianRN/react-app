import axios from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;",
    accept: "*",
  },
};

const getAll = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/GetCompaniesBranch`
  );
  return response.data;
};

const getById = async (id: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/GetCompaniesBranch/${id}`
  );
  return response.data;
};

const getByFolioCompany = async (folio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/GetCompaniesBranchesCompanyId/${folio}`
  );
  return response.data;
};

const post = async (request: any): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/companiesBranch`,
    request,
    axiosConfig
  );
  return response.data;
};

const postCompanyListBranches = async (request: any): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/PostCompaniesListBranches`,
    request,
    axiosConfig
  );
  return response.data;
};

const put = async (id: string, request: any): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/Folio?Id=${id}`,
    request,
    axiosConfig
  );
  return response.data;
};
///PutCompaniesSurchargeBranch
const putCompaniesSurchargeBranch = async (companyBranchFolio: string, 
  branchFolio:string, surchargeAmount:string): Promise<ResultObject> => {
  const response = await axios.patch<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/companiesSurchargeBranch?companyBranchFolio=${companyBranchFolio}&paymentMethodFolio=${branchFolio}&surchargeAmount=${surchargeAmount}`,
    axiosConfig
  );
  return response.data;
};
//PutCompaniesIssuingCost
const putCompaniesIssuingCost = async (companyBranchFolio: string, 
  branchFolio:string, issuingCost:string,commissionPercentage: number): Promise<ResultObject> => {
  const response = await axios.patch<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/companiesIssuingCost?companyBranchFolio=${companyBranchFolio}&branchFolio=${branchFolio}&issuingCost=${issuingCost}&commissionPercentage=${commissionPercentage}`,
    axiosConfig
  );
  return response.data;
};
///companiesBranchPaymentMethod
const companiesBranchPaymentMethod = async (companyBranchFolio: string, 
  branchFolio:string, paymentMethodFolio:string): Promise<ResultObject> => {
    //console.log(`${API_URL}/${Enviroment.apiCompaniesBranches}/companiesBranchPaymentMethod?companyBranchFolio=${companyBranchFolio}&branchFolio=${branchFolio}&paymentMethodFolio=${paymentMethodFolio}`)
  const response = await axios.patch<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/companiesBranchPaymentMethod?companyBranchFolio=${companyBranchFolio}&branchFolio=${branchFolio}&paymentMethodFolio=${paymentMethodFolio}`,
    axiosConfig
  );
  return response.data;
};
///companyBranchPaymentMethod
const companyBranchPaymentMethod = async (companyBranchFolio: string, 
  branchFolio:string, request:any): Promise<ResultObject> => {
    // console.log(`${API_URL}/${Enviroment.apiCompaniesBranches}/companyBranchPaymentMethod?branchFolio=${branchFolio}&companyBranchFolio=${companyBranchFolio}`)
    // console.log(request)
  const response = await axios.patch<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/companyBranchPaymentMethod?branchFolio=${branchFolio}&companyBranchFolio=${companyBranchFolio}`, request,
    axiosConfig
  );
  return response.data;
};


const deleteById = async (id: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/DeleteCompaniesBranch/${id}`
  );
  return response.data;
};

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/DeleteCompaniesBranchFolio/${folio}`
  );
  return response.data;
};

const getBranchesByCompanyFolio = async (
  folio: string
): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompaniesBranches}/GetCompaniesBranchesCompanyId/${folio}`
  );
  
  return response.data;
};

const CompaniesBranchesService = {
  getAll,
  getById,
  getByFolioCompany,
  post,
  postCompanyListBranches,
  put,
  putCompaniesSurchargeBranch,
  putCompaniesIssuingCost,
  deleteById,
  getBranchesByCompanyFolio,
  deleteByFolio,
  companyBranchPaymentMethod,
  companiesBranchPaymentMethod
};

export default CompaniesBranchesService;
