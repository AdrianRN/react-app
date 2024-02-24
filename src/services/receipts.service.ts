import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import Receipts from '../models/Receipts';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getReceipts = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}`);
    return response.data;
}

const postReceipt = async (request: Receipts): Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}`, request, axiosConfig);
    return response.data;
};

const getReceiptCollectionFilter = async (filtlerFolio: String): Promise<ResultObject> => { //           api/receipts
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/collection-filter?collectionFilterFolio=${filtlerFolio}`);
    return response.data;
};

const postReceiptList = async (request: any[]): Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/createbatch/`, request, axiosConfig);
    return response.data;
};

const postReceiptEmail = async (request:any) : Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/sendMail/`, request, axiosConfig);
    return response.data;
};

const getReceiptsByFolio = async (folio: string): Promise<ResultObject> =>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/${folio}`);
    return response.data;   
}

const getReceiptsByFilter = async (filter: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/getReceiptByFilter/` + filter);
    return response.data;
}

const getReceiptsByPolicyFolio = async (policyFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/${policyFolio}/policyFolio`);
    return response.data;
}

const getReceiptsByStatus = async (statusFolio: string): Promise<ResultObject> =>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/getReceiptrStatus/`+ statusFolio);
    //console.log(response.data)
    return response.data;   
}
const getReceiptReconcilations = async(paymentDateOf: string,paymentDateUntil: string, branchId: string, currencyId: string): Promise<ResultObject> =>{
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/GetReceiptConcilacionesAsync?paymentDateOf=${paymentDateOf}&paymentDateUntil=${paymentDateUntil}&branch=${branchId}&currency=${currencyId}`);
    return response.data;
  };
const put = async (folio:string, request:Receipts) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/${folio}`, request, axiosConfig);
    return response.data;
};

const putPaymentMethod = async (folio:string,ReceiptStatus:string, request:Receipts) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/PutReceiptPaymentMethod?Folio=${folio}&ReceiptStatus=${ReceiptStatus}`, request, axiosConfig);
    return response.data;
};

const putPayReceipt = async (folio:string,PayReceipt:string, request:Receipts) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/PutReceiptPaymentMethod?Folio=${folio}&PayReceipt=${PayReceipt}`, request, axiosConfig);
    return response.data;
};

const deleteReceipt = async(Folio: string): Promise<ResultObject> =>{
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/${Folio}`);
    return response.data;
};

const getReceiptsLogs = async (receiptFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/logs/all?receiptFolio=${receiptFolio}`);
    return response.data;
}

const postReceiptsLogs = async (receiptFolio:string, request: any): Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/logs?receiptFolio=${receiptFolio}`, request, axiosConfig);
    return response.data;
};

const deleteReceiptLog = async (receiptFolio: string, logId:string): Promise<ResultObject> => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/logs?receiptFolio=${receiptFolio}&logId=${logId}`);
    return response.data;
};

const changeAllStatusReceipts = async (policyFolio: string): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/editReceiptStatus?policyFolio=${policyFolio}`,axiosConfig);
    return response.data;
};

const patchFlags = async (receiptFolio: string, flagType: string, flagValue: boolean): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/flags?receiptFolio=${receiptFolio}&flagType=${flagType}&flagValue=${flagValue}`);
    return response.data;
}

const putReceiptBondsByPolicyFolio = async (bondFolio:string, receiptStatus: string) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/PutReceiptBondsByPolicyFolio/${bondFolio}/${receiptStatus}`, axiosConfig);
    return response.data;
}

const putPutReceiptnoPolicyAsync = async (folio:string, request:any) : Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiReceipts}/PutReceiptnoPolicyAsync/${folio}`, request, axiosConfig);
    return response.data;
};

const ReceiptsService = {
    getReceipts,
    getReceiptsByFolio,
    getReceiptsByFilter,
    getReceiptsByPolicyFolio,
    getReceiptsByStatus,
    getReceiptReconcilations,
    put,
    putPayReceipt,
    putPaymentMethod,
    putPutReceiptnoPolicyAsync,
    postReceipt,
    postReceiptEmail,
    getReceiptCollectionFilter,
    postReceiptList,
    deleteReceipt,
    getReceiptsLogs,
    postReceiptsLogs,
    deleteReceiptLog,
    changeAllStatusReceipts,
    patchFlags,
    putReceiptBondsByPolicyFolio
}

export default ReceiptsService;

