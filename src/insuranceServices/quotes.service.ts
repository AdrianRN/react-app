import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getQuotes = async(): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}`);
    return response.data;
}

const getQuotesByClientFolio = async(folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}/${folio}/clientId`);
    return response.data;
}

const getQuoteByFolio = async(folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}/${folio}`);
    return response.data;
}

const postQuote = async (request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}`, request, axiosConfig);
    return response.data;
}

const putQuote = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}/${folio}`, request, axiosConfig);
    return response.data;
}

const getQuotesByClientVehicleFolio = async(personFolio: string, vehicleId: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}/${personFolio}/clientId/${vehicleId}/vehicleId`);
    return response.data;
}

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiQuotes}/${folio}`);
    return response.data;
};

const QuotesService = {
    getQuotes,
    postQuote,
    getQuotesByClientFolio,
    getQuoteByFolio,
    putQuote,
    getQuotesByClientVehicleFolio,
    deleteByFolio,
}

export default QuotesService