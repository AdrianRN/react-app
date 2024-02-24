import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import User from '../models/User';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getAll = async (filtro:string = "") : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiUser}/GetUserFilters?Filtro=${filtro}`)
    return response.data;
};

const getById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiUser}/GetUser/${id}`)
    return response.data;
};

const getByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiUser}/GetUserByFolio/${folio}`)
    return response.data;
};

const getByEmail = async (email:any) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiUser}/GetUserEmail/${email}`)
    return response.data;
};

const post = async (request:User) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiUser}/PostUser`, request, axiosConfig);
    return response.data;
};

const putById = async (id:string, request:User) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiUser}/PutUser/${id}`, request, axiosConfig);
    return response.data;
};

const putByFolio = async (folio:string, request:User) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiUser}/PutUserFolio/${folio}`, request, axiosConfig);
    return response.data;
};

const putPasswordById = async (Id:string, request:any) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiUser}/PutPasswordUser/${Id}`, request, axiosConfig);
    return response.data;
};

const putPasswordByFolio = async (folio:string, request:any) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiUser}/PutPasswordUserFolio/${folio}`, request, axiosConfig);
    return response.data;
};

const deleteById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiUser}/DeleteUser/${id}`)
    return response.data;
};

const deleteByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiUser}/DeleteUserByFolio/${folio}`)
    return response.data;
};

const UserService = {
    getAll,
    getById,
    getByFolio,
    getByEmail,
    post,
    putById,
    putByFolio,
    putPasswordById,
    putPasswordByFolio,
    deleteById,
    deleteByFolio
};

export default UserService
