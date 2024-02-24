import axios from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import People from "../models/People";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;",
    accept: "*"
  }
};

const getAll = async (): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeople`
  );
  return response.data;
};

const getAllByName = async (name: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeople?filtro=${name}`
  );
  return response.data;
};

const getAllsByName = async (name: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeopleFilterAllAsync?filtro=${name}`
  );
  return response.data;
};

const getById = async (folio: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeopleFolio/${folio}`
  );
  return response.data;
};

const getByEmail = async (email: any): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/PostPeopleEmail/`,
    email,
    axiosConfig
  );
  return response.data;
};

const getSellers = async (name: string) => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeopleIsSeller?filtro=${name}`
  );
  return response.data;
};

const getDebtorFilterHealt = async (filter: string, healt: number) => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeopleHealtFilterAsync?filtro=${filter}&healt=${healt}`
  );
  return response.data;
};

const getByCURP = async (CURP: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/GetPeopleByCURP/${CURP}`
  );
  return response.data;
};

const post = async (request: People): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/PostPeople`,
    request,
    axiosConfig
  );
  return response.data;
};

const put = async (id: string, request: People): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/PutPeople?folio=${id}`,
    request,
    axiosConfig
  );
  return response.data;
};

const putFolio = async (
  folio: string,
  request: People
): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/PutPeopleFolio?folio=${folio}`,
    request,
    axiosConfig
  );
  return response.data;
};

const putStatusActive = async (id: string, status: number): Promise<ResultObject> => {
  const response = await axios.put<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/UpdatePeopleEstatusActivo?folio=${id}&ObjectStatusId${status}`,
    axiosConfig
  );
  return response.data;
};

const deleteById = async (id: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/DeletePeople/${id}`
  );
  return response.data;
};

const searchName = async (name: string, lastName: string, maternalLastName: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiPeople}/search?name=${name}&lastName=${lastName}&maternalLastName=${maternalLastName}`
  );
  return response.data;
};


const PeopleService = {
  getAll,
  getAllByName,
  getAllsByName,
  getById,
  getByEmail,
  getSellers,
  getDebtorFilterHealt,
  post,
  put,
  putFolio,
  putStatusActive,
  deleteById,
  getByCURP,
  searchName,
};

export default PeopleService;
