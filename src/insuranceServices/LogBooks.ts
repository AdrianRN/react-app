import axios from "axios";
import { API_URL, API_URL_INSURANCE, Enviroment } from "../enviroment/enviroment";
import ResultObject from "../models/ResultObject";

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;",
    accept: "*",
  },
};

const getLogBooksByPolicy = async (Policy: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(
      `${API_URL_INSURANCE}/${Enviroment.apiLogBooks}/GetLogBookPolicy/${Policy}`
    );
    return response.data;
  };
  const postLogBook = async (request:any) : Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiLogBooks}/PostLogBook`, request, axiosConfig);
    return response.data;
  };
  const putLogBook = async (folio: string, request:any) : Promise<ResultObject> => { //           api/receipts
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiLogBooks}/PutLogBookFolio=${folio}`, request, axiosConfig);
    return response.data;
  };
  const deleteLogBook = async (folio: string) => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiLogBooks}/DeleteLogBookFolio/${folio}`);
   console.log(response.data)
    return response.data;
}

  export const LogBooksService = {
    getLogBooksByPolicy,
    postLogBook,
    putLogBook,
    deleteLogBook,
  }