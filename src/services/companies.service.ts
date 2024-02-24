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
    `${API_URL}/${Enviroment.apiCompanies}/GetCompany`
  );
  return response.data;
};

const getCompanyCombo = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/GetCompanyCombo`
  );
  return response.data;
};

const getById = async (id: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/GetCompanyId/${id}`
  );
  return response.data;
};

const getByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/GetCompanyFolio/${folio}`
  );
  return response.data;
};

const getByCompanyType = async (folioCompanyType: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/GetCompanyType/${folioCompanyType}`
  );
  return response.data;
};

const post = async (request: any): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/PostCompany`,
    request,
    axiosConfig
  );
  return response.data;
};

const put = async (id: string, request: any): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/PutCompany?Id=${id}`,
    request,
    axiosConfig
  );
  return response.data;
};

const putFolio = async (
  folio: string,
  request: any
): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/PutCompanyFolio?Folio=${folio}`,
    request,
    axiosConfig
  );
  return response.data;
};

const patch = async (folio: string, request: any): Promise<ResultObject> => {
  const response = await axios.patch<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/${folio}`,
    request,
    axiosConfig
  );
  return response.data;
};

const deleteById = async (id: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/DeleteCompany/${id}`
  );
  return response.data;
};

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiCompanies}/DeleteCompanyFolio/${folio}`
  );
  return response.data;
};

const CompaniesService = {
  getAll,
  getCompanyCombo,
  getById,
  getByFolio,
  getByCompanyType,
  post,
  put,
  putFolio,
  patch,
  deleteById,
  deleteByFolio,
};

export default CompaniesService;
