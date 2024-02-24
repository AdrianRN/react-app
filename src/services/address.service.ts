import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import { Address } from '../models/Address';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getAll = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/GetAddress`);
    return response.data;
};

const getById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/GetAddress/${id}`)
    return response.data;
};

const getByFolioCompany = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/GetAddressCompanyId/${folio}`)
    return response.data;
};

const getByFolioPerson = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/GetAddressPersonId/${folio}`)
    return response.data;
};

const post = async (request:Address) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/PostAddress`, request, axiosConfig);
    return response.data;
};

const put = async (id:string, request:Address) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/PutAddress?Id=${id}`, request, axiosConfig);
    return response.data;
};

const putFolio = async (folio:string, request:Address) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/PutAddressFolio?Folio=${folio}`, request, axiosConfig);
    return response.data;
};

const deleteByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiAddress}/DeleteAddressFolio/${folio}`)
    return response.data;
};

const AddressService = {
    getAll,
    getById,
    getByFolioCompany,
    getByFolioPerson,
    post,
    put,
    putFolio,
    deleteByFolio
}

export default AddressService