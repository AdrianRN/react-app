import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';


let axiosConfig = {
    headers: {
      "Content-Type": "application/json;",
      accept: "*",
    },
  };
const getAll = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(
      `${API_URL_INSURANCE}/${Enviroment.apiCommissionsAgents}`
    );
    return response.data;
  };

const getByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(
        `${API_URL_INSURANCE}/${Enviroment.apiCommissionsAgents}/${folio}`
    );
    return response.data;
};

const getCommissionsByYearMonth = async(year:number, month: number): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissionsAgents}/summary?month=${month}&year=${year}`);
    return response.data;
}

const getIndividualCommission = async (folio: string, individual: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiCommissionsAgents}/${folio}/${individual}/individual`);
    return response.data;
}

const patch = async (folio: string, status: string ): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(
      `${API_URL_INSURANCE}/${Enviroment.apiCommissionsAgents}/${folio}/all?commissionStatus=${status}`,
      axiosConfig
    );
    return response.data;
  };

const CommissionAgentService = {
    getAll,
    getByFolio,
    getCommissionsByYearMonth,
    getIndividualCommission,
    patch,
}

export default CommissionAgentService