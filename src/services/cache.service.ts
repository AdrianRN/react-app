import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

const getByFolioCatalog = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCacheCatalogValue}/GetCatalogValues?Folio=${folio}`)
    return response.data;
};

const getMenu = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCacheCatalogValue}/Menu`)
    return response.data;
};

const getChubbVehicleByYear = async (year: string, brand: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCacheCatalogValue}/ChubbVehicles?year=${year}&brand=${brand}`)
    return response.data;
};

const getCountries = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCacheCatalogValue}/GetCatalogValues?Folio=${folio}`)
    return response.data;
}


const CacheService = {
    getByFolioCatalog,
    getMenu,
    getChubbVehicleByYear,
    getCountries
}

export default CacheService