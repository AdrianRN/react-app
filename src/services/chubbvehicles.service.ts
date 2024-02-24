
import axios from 'axios';
import { API_URL, API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';



export async function getChubbVehicleByYear(year: number): Promise<ResultObject>{
    try {
        const apiUrl = `${API_URL_INSURANCE}/${Enviroment.apiChubbVehicles}/ByYear?year=${year}`;
        const response = await axios.get<ResultObject>(apiUrl);
        return response.data;
    } catch (error:any) {
        throw new Error('Error al obtener los vehiculos de Chubb: ' + error.message);
    }
}

export async function getChubbVehicleCacheByYear(year: number): Promise<ResultObject>{
    try {
        const apiUrl = `${API_URL}/${Enviroment.apiChubbVehiclesCache}?year=${year}`;
        const response = await axios.get<ResultObject>(apiUrl);
        return response.data;
    } catch (error:any) {
        throw new Error('Error al obtener los vehiculos de Chubb: ' + error.message);
    }
}

const chubbVehiclesService = {
    getChubbVehicleByYear,
    getChubbVehicleCacheByYear,
};

export default chubbVehiclesService
