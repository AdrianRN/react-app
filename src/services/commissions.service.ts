import axios from 'axios';
import { API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import { BranchCommission } from '../models/People';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const postNewCommissionBranch = async (request:BranchCommission) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/PostCommissionsBranch`, request, axiosConfig);
    return response.data;
};

const postNewCommssion = async (request:any) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/PostCommission`, request, axiosConfig);
    return response.data;
};

const putCommissionBranch = async (request:BranchCommission) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/PutCommissionFolio`, request, axiosConfig);
    return response.data;
};

const putCommission = async (request:any) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/PutCommissionFolio?Folio=${request.folio}`, request, axiosConfig);
    return response.data;
};

export async function deleteCommission(folio:string): Promise<ResultObject>{    
    const response = await axios.delete(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/DeleteCommissionFolio/${folio}` );
    return response.data;
}

export async function deleteCommissionBranch(folio:string): Promise<ResultObject>{    
    const response = await axios.delete(`${API_URL_INSURANCE}/${Enviroment.apiCommissions}/DeleteCommissionFolio/${folio}` );
    return response.data;
}

const CommissionService = {
    postNewCommissionBranch,
    postNewCommssion,
    putCommissionBranch,
    putCommission,
    deleteCommission,

    
};

export default CommissionService