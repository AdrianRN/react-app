import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getCatalogValueById = async (id:string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValueCatalog/${id}`);
    return response.data;
}

const getCatalogValueByCatalogId = async (folio:string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValueCatalog/${folio}`)
    return response.data
}

const post = async(request: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/PostCatalogValue`, request, axiosConfig)
    return response.data
}

export async function getCatalogValueFolio(folio:string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValueFolio/${folio}`)
    return response.data
}

const editCatalogObjectStatus = async (
  folio: string
): Promise<ResultObject> => {
  const response = await axios.put(
    `${API_URL}/${Enviroment.apiCatalogValue}/ChangeObjectStatusId?folio=${folio}`
  );
  return response.data;
};

const getCatalogValueFiltro = async (filtro: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValueFiltro/${filtro}`
  );
  return response.data;
};

const getCatalogValueFolioAdmin = async(folio:string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValueFolioAdmin/${folio}`)
  return response.data
}

const getCatalogValueAdmin = async (id: string): Promise<ResultObject> => {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCatalogValue}/GetCatalogValuesAdmin?folio=${id}`
  );
  return response.data;
}

const catalogValueService = {
  getCatalogValueById,
  getCatalogValueByCatalogId,
  getCatalogValueFolio,
  post,
  editCatalogObjectStatus,
  getCatalogValueFiltro,
  getCatalogValueFolioAdmin,
  getCatalogValueAdmin
};

export default catalogValueService
