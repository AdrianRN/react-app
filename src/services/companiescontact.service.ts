import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import CompaniesContact from '../models/CompaniesContact';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getAll = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/GetContacts`);
    return response.data;
};

const getById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/GetContacts/${id}`)
    return response.data;
};

const getByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/GetContactsFolio/${folio}`)
    return response.data;
};

const getByFolioCompany = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/GetContactsCompany/${folio}`)
    return response.data;
};

const getByFolioPerson = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/GetContactsPerson/${folio}`)
    return response.data;
};

const post = async (request:CompaniesContact) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/PostContacts`, request, axiosConfig);
    return response.data;
};

const put = async (id:string, request:CompaniesContact) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/PutContacts?Id=${id}`, request, axiosConfig);
    return response.data;
};

const putFolio = async (folio:string, request:CompaniesContact) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/PutContactsFolioAsync?Folio=${folio}`, request, axiosConfig);
    return response.data;
};

const deleteById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/DeleteContacts/${id}`)
    return response.data;
};

const deleteByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesContact}/DeleteContact/${folio}`)
    return response.data;
};


const CompaniesContactService = {
    getAll,
    getById,
    getByFolio,
    getByFolioCompany,
    getByFolioPerson,
    post,
    put,
    putFolio,
    deleteById,
    deleteByFolio
}

export default CompaniesContactService