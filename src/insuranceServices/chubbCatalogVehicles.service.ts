import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

const getCatalogVehicleByYear = async(year:number): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiChubbCatalogVehicle}/ByYear?year=${year}`);
    return response.data;
}

const getYearsCatalog = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiChubbCatalogVehicle}/GetYearsCatalog`);
    return response.data;
}

const getCatalogVehicleByFolio = async(folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiChubbCatalogVehicle}/ByFolio?vehicleFolio=${folio}`);
    return response.data;
}

const ChubbCatalogVehicleService = {
    getCatalogVehicleByYear,
    getYearsCatalog,
    getCatalogVehicleByFolio,
}

export default ChubbCatalogVehicleService