import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const postVehiclePolicy = async (request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}`, request, axiosConfig);
    return response.data;
}

const postVehiclePolicyList = async (request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicyList}`, request, axiosConfig);
    return response.data;
}

const getVehiclePolicy = async (policyFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}/${policyFolio}`);
    return response.data;
}

const afterPostVehiclePolicy = async (policyFolio:string, request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}/${policyFolio}`, request, axiosConfig);
    return response.data;
}

const patchVehicleBeneficiaryPolicy = async (vehiclefolio: string, beneficiaryFolio: string): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}/${vehiclefolio}?beneficiaryFolio=${beneficiaryFolio}`);
    return response.data;
}

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}/${folio}`);
    return response.data;
};

const putVehiclePolicy = async(request:any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiVehiclePolicy}/UpdateVehiclePolicyDateAsync`, request, axiosConfig);
    return response.data;
}

const VehiclePolicy = {
    postVehiclePolicy,
    postVehiclePolicyList,
    getVehiclePolicy,
    afterPostVehiclePolicy,
    patchVehicleBeneficiaryPolicy,
    deleteByFolio,
    putVehiclePolicy
}

export default VehiclePolicy