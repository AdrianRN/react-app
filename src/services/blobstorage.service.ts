import axios, { AxiosRequestConfig } from 'axios';
import { API_URL_BLOB } from '../enviroment/enviroment';
import BlobResultObject from '../models/BlobResultObject';

let axiosConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'accept': '*',
    }
};

const post = async (containerName: string, fileName: string, image: string | ArrayBuffer | null) : Promise<BlobResultObject>=> {
    const response = await axios.post<BlobResultObject>(`${API_URL_BLOB}/blob-storage?containerName=${containerName}&fileName=${fileName}`, image, axiosConfig);
    return response.data;
};

const blobStorageService = {
    post
}

export default blobStorageService