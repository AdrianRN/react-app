import axios, { AxiosRequestConfig } from 'axios';
import { API_URL_BLOB } from '../enviroment/enviroment';
import PolicyLoad from '../models/PolicyLoadM';
import SuretyAddDto from '../models/SuretyAddDto';

let axiosConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
        'accept': '*',
    }
};

export async function getPolicyFiles(queryParams?: Record<string, string>): Promise<PolicyLoad[]> {
    // Construir la URL con los parámetros de consulta si se proporcionan
    let url = `${API_URL_BLOB}/blob-storage`;
    if (queryParams) {
        url += `?${new URLSearchParams(queryParams).toString()}`;
    }

    try {
        const response = await axios.get<PolicyLoad[]>(url, axiosConfig);
        return response.data;
    } catch (error:any) {
        throw new Error('Error al obtener los archivos de pólizas: ' + error.message);
    }
}

export const validateFileService = async (fileUrl:string, containerName:string) => {
    try {
        // Define los parámetros de consulta
        const queryParams = {
            fileUrl: fileUrl, // Valor del campo fileUrl
            containerName: containerName
        };

        // Realiza la solicitud GET utilizando axios u otra biblioteca similar
        const response = await axios.get(`${API_URL_BLOB}/validate-file`, {
            params: queryParams, // Pasa los parámetros de consulta
        });

        // Devuelve la respuesta de la API
        return response.data;
    } catch (error) {
        // Manejo de errores
        throw error;
    }
};

export const uploadSuretyXmlService = async (insuranceCompany: string, content: string | ArrayBuffer | undefined | null ) : Promise<SuretyAddDto> =>  {

    try{
        let axiosConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*',
            }
        };
            const response = await axios.post<SuretyAddDto>(`${API_URL_BLOB}/surety?insuranceCompany=${insuranceCompany}`,content, axiosConfig);
            return response.data;
    }
    catch (error) {
        throw error;
    }
    
  };