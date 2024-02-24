import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackagePolicy}/${folio}`);
    return response.data;
}

const getByPolicyFolio = async (policyFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackagePolicy}/${policyFolio}/policyFolio`);
    return response.data;
}

const putByFolio = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackagePolicy}/${folio}`, request, axiosConfig);
    return response.data;
}

const deleteByFolio = async (folio: any): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCoveragePackagePolicy}/${folio}`);
    return response.data;
}

const CoveragePackagesXPolicyService = {
    getByFolio,
    getByPolicyFolio,
    putByFolio,
    deleteByFolio
}

export default CoveragePackagesXPolicyService