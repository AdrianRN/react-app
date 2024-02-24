import axios, { AxiosRequestConfig } from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
    accept: "*",
  },
};

const get = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/GetFileStorage`
  );
  return response.data;
};

const getByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/GetFileStorageFolio/${folio}`
  );
  return response.data;
};

const getFileStorageByExternalFolio = async (externalFolio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/GetFileStorageExternalFolio/${externalFolio}`
  );
  return response.data;
};

const getByExternalFolioContainerName = async (
  constainerName: string,
  externalFolio: string
): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/GetFileStorageExternalFolioContainerName/${externalFolio}/${constainerName}`
    //`${API_URL}/${Enviroment.apiFileStorage}/GetFileStorageExternalFolio/${externalFolio}`
  );
  return response.data;
};
const post = async (request: object): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/PostFileStorage`,
    request,
    axiosConfig
  );
  return response.data;
};

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiFileStorage}/DeleteFileStorageFolio/${folio}`
  );
  return response.data;
};

const fileStorageService = {
  get,
  getByFolio,
  getByExternalFolioContainerName,
  post,
  deleteByFolio,
  getFileStorageByExternalFolio
};

export default fileStorageService;
