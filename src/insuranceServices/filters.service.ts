import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import IFilter from '../insuranceModels/filters';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getFilters = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiFilter}`);
    return response.data;
}

const getFiltersByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiFilter}/${folio}/userFolio`);
    return response.data;
}

const postFilter = async (request: IFilter): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiFilter}`, request, axiosConfig);
    return response.data;
};

const putFilter = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiFilter}/${folio}`, request, axiosConfig);
    return response.data;
};

const deleteFilter = async (folio: string) => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiFilter}/${folio}`);
    return response.data;
}



const FilterService = {
    getFilters,
    getFiltersByFolio,
    postFilter,
    putFilter,
    deleteFilter
}

export default FilterService
