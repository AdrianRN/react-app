import axios from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import AnnualGoal from "../models/AnnualGoal";
import BranchesAnnualGoal from "../models/BranchAnnualGoal";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;",
    accept: "*",
  },
};

const GetAnnualGoals = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/GetAnnualGoal`
  );
  return response.data;
};

const GetAnnualGoalsByYear = async (year: number): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/GetAnnualGoalsYear/${year}`
  );
  
  return response.data;
};

export interface GetBranchesProfileAllByYearResponse {}
const GetBranchesProfileAllByYear = async (
  year: number
): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/GetBranchesProfileAll/${year}`
  );
  
  return response.data;
};

const getCompanyWithBranchAndNotAnnualGoal = async (
  year: number
): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/GetCompanyWithBranchAndNotAnnualGoal/${year}`
  );
  
  return response.data;
};

const GetBranchesAnnualGoalCompanyId = async (
  CompanyId: string
): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/GetBranchesAnnualGoalCompanyId/${CompanyId}`
  );
  return response.data;
};

const postAnnualGoal = async (request: AnnualGoal): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PostAnnualGoal`,
    request,
    axiosConfig
  );
  return response.data;
};

const postBranchesAnnualGoal = async (
  request: BranchesAnnualGoal[]
): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PostBranchesAnnualGoalList`,
    request,
    axiosConfig
  );
  
  return response.data;
};

const putAnnualGoal = async (request: AnnualGoal): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PutAnnualGoal?id=${request.annualGoalId}`,
    request,
    axiosConfig
  );
  return response.data;
};

const putBranchesAnnualGoal = async (
  request: BranchesAnnualGoal
): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PutBranchesAnnualGoal`,
    request,
    axiosConfig
  );
  return response.data;
};
/*
{
    "folio": "string",
    "year": 0,
    "dateGoals": "2023-10-19T00:03:40.550Z",
    "editingReason": "string",
    "statusAnnualGoalId": "string",
    "objectStatusId": 0
  }
*/
export interface putBranchesAnnualGoalFolioPayload {
  companyId: string;
  branchId: string;
  amount: number;
  annualGoalId: string;
  superGoal: number;
  objectStatusId: number;
}

const putBranchesAnnualGoalFolio = async (
  branchAnnualGoalFolio: string,
  payload: putBranchesAnnualGoalFolioPayload
): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PutBranchesAnnualGoalFolio?Folio=${branchAnnualGoalFolio}`,
    payload,
    axiosConfig
  );
  return response.data;
};

//nterfaz para mandar branches con folio
export interface putBranchesAnnualGoalFolioPayloadList {
  folio: string;
  companyId: string;
  branchId: string;
  amount: number;
  annualGoalId: string;
  superGoal: number;
  objectStatusId: number;
}
//Funcion para enviar los branches con el arregle de tupla
const putBranchesAnnualGoalFolioList = async (
  payload: putBranchesAnnualGoalFolioPayloadList[]
): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/PutBranchesAnnualGoalFolioList`,
    payload,
    axiosConfig
  );
  return response.data;
};

const deleteAnnualGoal = async (id: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/DeleteAnnualGoal/${id}`
  );
  return response.data;
};

const deleteBranchesAnnualGoal = async (id: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiAnnualGoals}/DeleteBranchesAnnualGoalFolio/${id}`
  );
  return response.data;
};

const AnnualGoalService = {
  GetAnnualGoals,
  GetAnnualGoalsByYear,
  GetBranchesProfileAllByYear,
  GetBranchesAnnualGoalCompanyId,
  postAnnualGoal,
  postBranchesAnnualGoal,
  putAnnualGoal,
  putBranchesAnnualGoal,
  putBranchesAnnualGoalFolio,
  putBranchesAnnualGoalFolioList,
  deleteAnnualGoal,
  deleteBranchesAnnualGoal,
  getCompanyWithBranchAndNotAnnualGoal,
};

export default AnnualGoalService;
