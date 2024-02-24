import axios from 'axios';
import { Enviroment, API_BONDS_URL } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*/*",
    }
};

const getBondEndorsement = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}`);
    return response.data;
}

const getByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}/${folio}/endorsementFolio`);
    return response.data;
}

const getByBondFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}/${folio}/bondFolio`);
    return response.data;
}

const post = async (bondFolio: string, request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}?bondFolio=${bondFolio}`, request, axiosConfig);
    return response.data;
}

const put = async (endorsementFolio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}/${endorsementFolio}`, request, axiosConfig);
    return response.data;
}

const deleteByFolio = async (endorsementFolio: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBondEndorsement}/${endorsementFolio}`);
    return response.data;
}


const bondEndorsementService = {
    getBondEndorsement,
    getByFolio,
    getByBondFolio,
    post,
    put,
    deleteByFolio
}

export default bondEndorsementService;