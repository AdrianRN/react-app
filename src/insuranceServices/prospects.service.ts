import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import {Prospect}  from '../insuranceModels/Prospect';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getProspects = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiProspects}/GetProspects`);
    return response.data;
}

const getProspectsByFolioPerson = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiProspects}/GetProspectsPolicy/` + folio);
    return response.data;
}

const post = async (request: Prospect): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiProspects}/PostProspects`, request, axiosConfig);
    return response.data;
};

const put = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiProspects}/PutProspects?folio=${folio}`, request, axiosConfig);
    return response.data;
};
const deleteProspect = async (folioProspect: string) => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiProspects}/DeleteProspectsFolio/${folioProspect}`);
    return response.data;
}
const ProspectsService = {
    getProspects,
    getProspectsByFolioPerson,
    put,
    post,
    deleteProspect
}

export default ProspectsService
