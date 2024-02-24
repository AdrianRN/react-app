import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const postNewConcept = async (person: string, year: number, month: number, title: string, amount: number): Promise<ResultObject> => {
    const request = {
        "personFolio": person,
        "year": year,
        "month": month,
        "concepts": [
            {
            "title": title,
            "amount": amount
            }
        ]
    }

    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiConceptsAgent}`, request, axiosConfig);
    return response.data;
}

const postConcept = async (folio: string, title: string, amount: number): Promise<ResultObject> => {
    const request = 
    {
    "title": title,
    "amount": amount
    }

    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiConceptsAgent}/concept?folio=${folio}`, request, axiosConfig);
    return response.data;
}


const putByFolio = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiConceptsAgent}/${folio}`, request, axiosConfig);
    return response.data;
}


const deleteByFolio = async (folio: string, id: string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiConceptsAgent}/${folio}/folio/${id}/element-id`);
    return response.data;
}


const ConceptService = {
    postNewConcept,
    postConcept,
    putByFolio,
    deleteByFolio,
}

export default ConceptService