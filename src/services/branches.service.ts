import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getAll = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiBranches}/GetBranches`);
    return response.data;
};

const getById = async (id:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiBranches}/GetBranches/${id}`)
    return response.data;
};

const post = async (request:object) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiBranches}/PostBranches`, request, axiosConfig);
    return response.data;
};

const put = async (folio:string, request:object) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiBranches}/PutBranchesFolio?folio=${folio}`, request, axiosConfig);
    return response.data;
};

const deleteBranch = async (folio:string) : Promise<void> => {
await axios.delete(`${API_URL}/${Enviroment.apiBranches}/DeleteBranchesFolio?folio=${folio}`);
};


const BranchesService = {
    getAll,
    getById,
    post,
    put,
    deleteBranch
}

export default BranchesService