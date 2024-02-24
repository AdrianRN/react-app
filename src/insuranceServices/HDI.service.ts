import axios, { AxiosInstance } from 'axios';
import { API_URL_INSURANCE, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import ChubbVehicles from '../models/ChubbVehicles';

const HDIAxios: AxiosInstance = axios.create({
  baseURL: API_URL_INSURANCE,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*',
  },
});

export const postHDIInsurance = async (insurance: any): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(`${Enviroment.apiHDIInsurance}/quote`, insurance);
    return response.data;
  } catch (error) {
    console.error('Error in postHDIInsurance:', error);
    throw error;
  }
};

export const postHDIVehicleBrand = async (vehicleModel: string, vehicleIdType: string): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(`${Enviroment.apiHDIInsurance}/vehicleBrand?vehicleIdModel=${vehicleModel}&vehicleIdType=${vehicleIdType}`
    );
    return response.data;
  } catch (error) {
    console.error('Error in postHDIVehicleBrand:', error);
    throw error;
  }
};
export const postHDIVehicleSubBrand = async (vehicleModel: string, vehicleIdType: string, vehicleIdBrand: string): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(
      `${Enviroment.apiHDIInsurance}/vehicleSubBrand?vehicleIdModel=${vehicleModel}&vehicleIdType=${vehicleIdType}&vehicleIdbrand=${vehicleIdBrand}`
    );
    return response.data;
  } catch (error) {
    console.error('Error in postHDIVehicleSubBrand:', error);
    throw error;
  }
};

export const postHDIVehicleVersion = async (vehicleModel: string, vehicleIdType: string, vehicleIdBrand: string, vehicleIdSubbrand: string): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(
      `${Enviroment.apiHDIInsurance}/vehicleVersion?vehicleIdModel=${vehicleModel}&vehicleIdType=${vehicleIdType}&vehicleIdbrand=${vehicleIdBrand}&vehicleIdSubbrand=${vehicleIdSubbrand}`
    );
    return response.data;
  } catch (error) {
    console.error('Error in postHDIVehicleVersion:', error);
    throw error;
  }
};

export const postHDIVehicleTransmission = async (vehicleModel: string, vehicleIdType: string, vehicleIdBrand: string, vehicleIdSubbrand: string, vehicleIdVersion: string): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(
      `${Enviroment.apiHDIInsurance}/vehicleTransmission?vehicleIdModel=${vehicleModel}&vehicleIdType=${vehicleIdType}&vehicleIdbrand=${vehicleIdBrand}&vehicleIdSubbrand=${vehicleIdSubbrand}&vehicleIdVersion=${vehicleIdVersion}`
    );
    return response.data;
  } catch (error) {
    console.error('Error in postHDIVehicleTransmission:', error);
    throw error;
  }
};

export const postHDIVehicleFull = async (vehicleModel: string, vehicleIdType: string, vehicleIdBrand: string, vehicleIdSubbrand: string, vehicleIdVersion: string, vehicleTransmissionId: string): Promise<ResultObject> => {
  try {
    const response = await HDIAxios.post<ResultObject>(
      `${Enviroment.apiHDIInsurance}/vehicleFull?vehicleIdModel=${vehicleModel}&vehicleIdType=${vehicleIdType}&vehicleIdbrand=${vehicleIdBrand}&vehicleIdSubbrand=${vehicleIdSubbrand}&vehicleIdVersion=${vehicleIdVersion}&vehicleTransmissionId=${vehicleTransmissionId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error in postHDIVehicleFull:', error);
    throw error;
  }
};

export const getHDIVehicle = async (vehicleModel: string, vehicleIdType: string, selectedVehicle: ChubbVehicles): Promise<ResultObject> => {
  try {
    const brandResult = await postHDIVehicleBrand(vehicleModel, vehicleIdType);
    if (brandResult.message !== 'OK' || !brandResult.data.vehicleBrands.length) throw new Error('Brand fetch failed or no brands found');

    const matchingBrand = brandResult.data.vehicleBrands.find((brand: any) => brand.description === selectedVehicle.brand);
    if (!matchingBrand) throw new Error('Matching brand not found');

    const subBrandResult = await postHDIVehicleSubBrand(vehicleModel, vehicleIdType, matchingBrand.key);
    if (subBrandResult.message !== 'OK' || !subBrandResult.data.vehicleSubBrands.length) throw new Error('Subbrand fetch failed or no subbrands found');

    const matchingSubBrand = subBrandResult.data.vehicleSubBrands.find((subbrand: any) => subbrand.description === selectedVehicle.typeVehicle);
    if (!matchingSubBrand) throw new Error('Matching subbrand not found');

    const versionResult = await postHDIVehicleVersion(vehicleModel, vehicleIdType, matchingBrand.key, matchingSubBrand.key);
    if (versionResult.message !== 'OK' || !versionResult.data.vehicleVersions.length) throw new Error('Version fetch failed or no versions found');

    const transmissionResult = await postHDIVehicleTransmission(vehicleModel, vehicleIdType, matchingBrand.key, matchingSubBrand.key, versionResult.data.vehicleVersions[0].key);
    if (transmissionResult.message !== 'OK' || !transmissionResult.data.vehicleTransmissions.length) throw new Error('Transmission fetch failed or no transmissions found');

    const fullResult = await postHDIVehicleFull(vehicleModel, vehicleIdType, matchingBrand.key, matchingSubBrand.key, versionResult.data.vehicleVersions[0].key, transmissionResult.data.vehicleTransmissions[0].key);
    if (fullResult.message !== 'OK') throw new Error('Full vehicle fetch failed');

    return fullResult;
  } catch (error) {
    console.error('Error in getHDIVehicle:', error);
    throw error;
  }
};




const HDIInsuranceService = {
  postHDIInsurance,
  postHDIVehicleBrand,
  postHDIVehicleSubBrand,
  postHDIVehicleVersion,
  postHDIVehicleTransmission,
  postHDIVehicleFull,
  getHDIVehicle,
};

export default HDIInsuranceService;
