import axios from "axios";
import { API_URL_INSURANCE, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;",
    accept: "*",
  },
};

const getAllClaims = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL_INSURANCE}/${Enviroment.apiClaims}/GetClaims`
  );
  return response.data;
};

const getClaimsClientById = async (id: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL_INSURANCE}/${Enviroment.apiClaims}/GetclaimsClientId/${id}`
  );
  return response.data;
};

const getClaimsClientByFolio = async(folio:string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL_INSURANCE}/${Enviroment.apiClaims}/GetclaimsClientId/${folio}`
  );
  return response.data;
}

const getClaimsPolicyByPolicy = async (Policy: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL_INSURANCE}/${Enviroment.apiClaims}/GetClaimsPolicy/${Policy}`
  );
  return response.data;
};

export async function postClaims(obj:object): Promise<ResultObject>{
  const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiClaims}/PostClaims`,obj)
  return response.data;
};

export async function putClaims(folio: string, obj: object): Promise<ResultObject> {
  const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiClaims}/PutClaimsFolio?Folio=${folio}`, obj);
  return response.data;
};


const deleteClaimsByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL_INSURANCE}/${Enviroment.apiClaims}/DeleteClaimsFolio/${folio}`
  );
  return response.data;
};

const postClaimsLogs = async (claimsFolio:string, request: any): Promise<ResultObject> => { //           api/receipts
  const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiAccidents}`, request, axiosConfig);
  return response.data;
};

const patchFlags = async (claimsFolio: string, flagType: string, flagValue: boolean): Promise<ResultObject> => {
  const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiClaims}/flags?claimsFolio=${claimsFolio}&flagType=${flagType}&flagValue=${flagValue}`);
  return response.data;
};

const deleteClaimLog = async (claimsFolio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiAccidents}/${claimsFolio}`);
  return response.data;
};

const getReceiptsLogs = async (claimsFolio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiAccidents}/logs/claims/${claimsFolio}`);
  return response.data;
};

const postClaimsEmail = async (request:any) : Promise<ResultObject> => { //           api/receipts
  const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiClaims}/sendMail/`, request, axiosConfig);
  return response.data;
};

export const ClaimsService = {
    getAllClaims,
    getClaimsClientById,
    getClaimsClientByFolio,
    getClaimsPolicyByPolicy,
    postClaims,
    putClaims,
    deleteClaimsByFolio,
    postClaimsLogs,
    patchFlags,
    deleteClaimLog,
    getReceiptsLogs,
    postClaimsEmail
};

