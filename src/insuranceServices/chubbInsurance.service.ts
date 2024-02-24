import axios, { AxiosInstance } from 'axios';
import { API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import ChubbPerson from '../models/ChubbPerson';
import ChubbIssuance from '../models/ChubbIssuance';

const chubbAxios: AxiosInstance = axios.create({
  baseURL: API_URL_INSURANCE,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*',
  },
});

export const postChubbPerson = async (insurance: ChubbPerson): Promise<ResultObject> => {
  try {
    
    const response = await chubbAxios.post<ResultObject>(`${Enviroment.apiChubbInsurance}/createChubbPerson`, insurance);
    return response.data;
  } catch (error) {
    console.error('Error in postChubbPerson:', error);
    throw error;
  }
};

export const postChubbIssuance = async (insurance: ChubbIssuance, personFolio: string): Promise<ResultObject> => {
  try {    
    const response = await chubbAxios.post<ResultObject>(`${Enviroment.apiChubbIssuance}/chubbIssuance?personFolio=${personFolio}`, insurance);
    return response.data;
  } catch (error) {
    console.error('Error in postChubbPerson:', error);
    throw error;
  }
};

export const getChubbPerson = async (personFolio: string): Promise<ResultObject> => {
  try {
    const response = await chubbAxios.get<ResultObject>(`${Enviroment.apiChubbInsurance}/${personFolio}/personByFolio`);
    return response.data;
  } catch (error) {
    console.error('Error in getChubbPerson:', error);
    throw error;
  }
};

export const getChubbColonies = async (zipCode: string): Promise<ResultObject> => {
  try {
    const response = await chubbAxios.get<ResultObject>(`${Enviroment.apiChubbInsurance}/getChubbColonies?zipCode=${zipCode}`);
    return response.data;
  } catch (error) {
    console.error('Error in postChubbPerson:', error);
    throw error;
  }
};

export const getZipCodeInfo = async(zipCode: string): Promise<ResultObject> => {
  try {
    const response = await chubbAxios.get<ResultObject>(`${Enviroment.apiChubbInsurance}/getZipCodeInfo?zipCode=${zipCode}`);
    return response.data;
  } catch (error) {
    console.error('Error in postChubbPerson:', error);
    throw error;
  }
}

export const editChubbPerson = async (insurance: ChubbPerson, chubbPersonFolio: string): Promise<ResultObject> => {
  try {
    const response = await chubbAxios.put<ResultObject>(`${Enviroment.apiChubbInsurance}/editChubbPerson?chubbPersonFolio=${chubbPersonFolio}`, insurance);
    return response.data;
  } catch (error) {
    console.error('Error in postChubbPerson:', error);
    throw error;
  }
};

const chubbInsuranceService = {
  postChubbPerson,
  getChubbPerson,
  getChubbColonies,
  getZipCodeInfo,
  postChubbIssuance,
  editChubbPerson
};

export default chubbInsuranceService;
