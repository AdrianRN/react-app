import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getDamagePolicies = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/GetDamagePolicies`);
    return response.data;
}

const getDamagePoliciesById = async (id: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/GetDamagePolicies/${id}`);
    return response.data;
}

const getDamagePoliciesByPolicy = async (policy: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/GetDamagePoliciesPolicy/${policy}`);
    return response.data;
}

const post = async (request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/PostDamagePolicies`, request, axiosConfig);
    return response.data;
}

const putByFolio = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/PutDamagePoliciesFolio?Folio=${folio}`, request, axiosConfig);
    return response.data;
}

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiDamagePolicy}/DeleteDamagePoliciesFolio/${folio}`);
    return response.data;
}

const DamagePoliciesService = {
    getDamagePolicies,
    getDamagePoliciesById,
    getDamagePoliciesByPolicy,
    post,
    putByFolio,
    deleteByFolio
}

export default DamagePoliciesService