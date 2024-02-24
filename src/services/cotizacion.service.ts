import axios from 'axios';
import { API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
  headers: {
    'Content-Type': 'application/json;',
    'accept': '*',
  },
};

export async function getCotizacion(cotizacion: any): Promise<ResultObject> {     
    const response = await axios.post<ResultObject>(
      `${API_URL_INSURANCE}/${Enviroment.apiCotizacion}`,
      cotizacion,
      axiosConfig
    );

    return response; 
}

// Export the service functions
const cotizacionService = {
  getCotizacion,
};

export default cotizacionService;
