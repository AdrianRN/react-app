import axios from "axios";
import { API_URL, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    'Content-Type': 'application/json;',
    "accept": "*",
  }
};

export async function getCatalogs(): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiCatalog}/GetCatalog`);
  return response.data;
}

export async function getCatalogValueById(id: string): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(
    `${API_URL}/${Enviroment.apiCacheCatalogValue}/GetCatalogValues?folio=${id}`
  );
  return response.data;
}

export async function postCatalogDetail(obj: object): Promise<ResultObject> {
  const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/PostCatalogValue`, obj, axiosConfig);
  return response.data;
}

export async function putCatalogDetail(id: string, obj: object): Promise<void> {
  await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/PutCatalogValue?Id=` + id, obj, axiosConfig);
}

export async function putCatalogDetailFolio(id: string, obj: object): Promise<ResultObject> {
  const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiCatalogValue}/PutCatalogValueFolio?Folio=` + id, obj, axiosConfig);
  return response.data;
}

export async function deleteCatalogDetail(id: string): Promise<void> {
  await axios.delete(
    `${API_URL}/${Enviroment.apiCatalogValue}/DeleteCatalogValue/${id}`
  );
}

export async function deleteCatalogDetailFolio(folio: string): Promise<void> {
  await axios.delete(
    `${API_URL}/${Enviroment.apiCatalogValue}/DeleteCatalogValueFolio/${folio}`
  );
}

