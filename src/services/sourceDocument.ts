import axios from "axios";
import { API_BONDS_URL, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    'Content-Type': 'application/json;',
    "accept": "*",
  }
};


export async function getSourceDocuments(): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiSourceDocument}/GetSourceDocument`);
  return response.data;
}

export async function getSourceDocumentByClientId(id: string): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(
    `${API_BONDS_URL}/${Enviroment.apiSourceDocument}/GetClientId/${id}`
  );
  console.log(response.data)
  return response.data;
}
export async function getSourceDocumentId(id: string): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(
    `${API_BONDS_URL}/${Enviroment.apiSourceDocument}/GetSourceDocument/${id}`
  );
  return response.data;
}

export async function getSourceDocumentFolio(folio: string): Promise<ResultObject> {
  const response = await axios.get<ResultObject>(
    `${API_BONDS_URL}/${Enviroment.apiSourceDocument}/GetSourceDocumentFolio/${folio}`
  );
  return response.data;
}

export async function postSourceDocument(obj: object): Promise<void> {
  await axios.post<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiSourceDocument}/PostSourceDocument`, obj, axiosConfig)
}

export async function putSourceDocument(id: string, obj: object): Promise<void> {
  await axios.put<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiSourceDocument}/PutSourceDocumentFolio?Folio=${id}`, obj, axiosConfig);
}

const deleteSourceDocument = async (Folio: string): Promise<ResultObject> => {
  const response = await axios.delete<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiSourceDocument}/DeleteSourceDocumentFolio/${Folio}`);
  return response.data;
};

const sourceDocumentService = {
  getSourceDocuments,
  getSourceDocumentByClientId,
  getSourceDocumentId,
  getSourceDocumentFolio,
  postSourceDocument,
  putSourceDocument,
  deleteSourceDocument
}

export default sourceDocumentService;