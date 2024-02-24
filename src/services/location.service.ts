import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

const getStates = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiLocation}/states`)
    return response.data;
};

const getStateById = async (stateId:number) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiLocation}/state/${stateId}`)
    return response.data;
};

const getColoniesByStateIdMunicipalityId = async (stateId: number, municipalityId: number): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiLocation}/colonies/${stateId}/${municipalityId}`)
    return response.data
}

const getMunicipalitiesByStateId = async (stateId: number): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiLocation}/municipalities/${stateId}`)
    return response.data
}

const getZipCodeInfo = async (zipCode:string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiLocation}/zipCode?zipCode=${zipCode}`)
    return response.data
}


const LocationService = {
    getStates,
    getStateById,
    getMunicipalitiesByStateId,
    getColoniesByStateIdMunicipalityId,
    getZipCodeInfo
}

export default LocationService
