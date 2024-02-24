import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const authorize = async (request:any) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiAuthentication}/Authorize`, request, axiosConfig)
    return response.data;
};

const AuthenticationService = {
    authorize
}

export default AuthenticationService