import axios from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";
import ModelIFileStorage from '../models/FileStorage';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getFileStorageByExternalFolio = async(externalFolio:string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiFileStorage}/GetFileStorageExternalFolio/${externalFolio}`);
    return response.data.data;
}

const postFileStorage = async(request:ModelIFileStorage): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiFileStorage}/PostFileStorage`, request, axiosConfig);
    return response.data;
}
const deleteFileStoragebyFolio = async(folio:string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL}/${Enviroment.apiFileStorage}/DeleteFileStorageFolio/${folio}`);
    return response.data;
};

const putFileStoragebyFolio = async(folio: string, request:ModelIFileStorage): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiFileStorage}/PutFileStorageFolio?Folio=${folio}`
        , request, axiosConfig);
    return response.data;
}


const FileStorage = {
    postFileStorage,
    getFileStorageByExternalFolio,
    deleteFileStoragebyFolio,
    putFileStoragebyFolio
}

export default FileStorage;