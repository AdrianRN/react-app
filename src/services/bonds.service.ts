import axios from 'axios';
import { Enviroment, API_BONDS_URL } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import ModelBonds from '../models/Bonds';
import { isNumber } from 'lodash';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getBonds = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBond`);
    return response.data;
}

const getByFolio = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBondFolio/${folio}`);
    return response.data;
}

const getBondSourceDocumentByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBondSourceDocument/${folio}`);
    return response.data;
}

const getBondCreditorClient = async (folioCreditorClient: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBondDebtor/${folioCreditorClient}`);
    return response.data;
}

const getBondDebtor = async (folio:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBondDebtor/${folio}`);
    return response.data;
}

const getBondByClientOrPolicyNumber = async (personId: string, status: number) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/GetBondByClientOrPolicyNumber?filter=${personId}&status=${status}`);
    return response.data;
}

const post = async(request:any): Promise<ResultObject> => {
    if(isNumber(request.tariff) ){
        request.tariff = request.tariff+'';
    }
    const response = await axios.post<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/PostBond`, request, axiosConfig);
    return response.data;
}

const postCopyBondFolio = async(folio:string): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/PostCopyBondFolioAsync/${folio}`, axiosConfig);
    return response.data;
}

const put = async(folio: string, request:ModelBonds): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiBonds}/PutBondFolio?Folio=${folio}`, request, axiosConfig);
    return response.data;
}

const postClaimsBonds = async(request:any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiClaims}/PostClaims`, request, axiosConfig);
    return response.data;
}

const getClaimFolio = async (bondFolio:any) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiClaims}/GetClaimsBondAsync/${bondFolio}`);
    return response.data;
}

const deleteClaimByFolio = async (bondFolio: string) => {
    const response = await axios.delete<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiClaims}/DeleteClaimsFolio/${bondFolio}`);
    return response.data;
}

const putClaimsByFolio = async(folio: string, request:any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_BONDS_URL}/${Enviroment.apiClaims}/PutClaimsFolio?Folio=${folio}`, request, axiosConfig);
    return response.data;
}




const bondService = {
    getBonds,
    getByFolio,
    getBondSourceDocumentByFolio,
    getBondCreditorClient,
    getBondDebtor,
    getBondByClientOrPolicyNumber,
    post,
    postCopyBondFolio,
    put,
    postClaimsBonds,
    getClaimFolio,
    deleteClaimByFolio,
    putClaimsByFolio
}

export default bondService;
