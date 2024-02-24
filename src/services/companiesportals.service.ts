import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import CompaniesPortals from '../models/CompaniesPortals';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getAll = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/GetCompanyPortal`);
    return response.data;
};

const getById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/GetCompanyPortal/${id}`);
    return response.data;
};

const getByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/GetCompanyPortalFolio/${folio}`);
    return response.data;
};

const getByFolioDecrypt = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/GetCompanyPortalFolioDecrypt/${folio}`);
    return response.data;
};

const getByFolioCompany = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/GetCompanyPortalCompanyId/${folio}`);
    return response.data;
};

const post = async (request:CompaniesPortals) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/PostCompanyPortal`, request, axiosConfig);
    return response.data;
}; 

const putFolio = async (folio:string, request:CompaniesPortals) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/PutCompanyPortalFolio?Folio=${folio}`, request, axiosConfig);
    return response.data;
}; 

const deleteByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiCompaniesPortal}/DeleteCompanyPortalFolio/${folio}`);
    return response.data;
}; 

const CompaniesPortalsService = {
    getAll,
    getById,
    getByFolio,
    getByFolioDecrypt,
    getByFolioCompany,
    post,
    putFolio,
    deleteByFolio
}

export default CompaniesPortalsService