import axios from 'axios';
import { API_BONDS_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
  headers: {
    'Content-Type': 'application/json;',
    "accept": "*",
  }
};
type QuoteMinPremDataBase = {
  vigencyStartDate: string;
  vigencyEndDate: string;
  vigencyTotalDays: number;
  years: number;
  months: number;
  minAnnualBonus: number;
  minTotalBonus: number;
  minMonthlyBonus: number;
  bonus: number;
  cnsf: number;
  expeditionCost: number;
  creditBureauFees: number;
  subTotal: number;
  rateIva: number;
  totalIva: number;
  totalBonus: number;
  emails: EmailQuote[];
};
type QuoteDataBase = {
  "vigencyStartDate": string,
  "vigencyEndDate": string,
  "vigencyTotalDays": number,
  "totalSuretyAmount": number,
  "suretyAmount": number,
  "bonus": number,
  "netBonus": number,
  "cnsf": number,
  "expeditionCost": number,
  "creditBureauFees": number,
  "subTotal": number,
  "rateIva": number,
  "totalIva": number,
  "totalBonus": number,
  "emails": EmailQuote[]
};
type EmailQuote = {
  email: string
};

const postBondQuotationSendEmail = async (request: QuoteDataBase): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>
    (`${API_BONDS_URL}/${Enviroment.apiBondQuotation}/PostBondQuotationSendEmail`, request, axiosConfig);
  return response.data;
}
const postBondQuotationMinPremSendEmail = async (request: QuoteMinPremDataBase): Promise<ResultObject> => {
  const response = await axios.post<ResultObject>
    (`${API_BONDS_URL}/${Enviroment.apiBondQuotation}/PostQuoteMinimumPremiumSendEmail`, request, axiosConfig);
  return response.data;
}

const BondQuotationService = {
  postBondQuotationSendEmail,
  postBondQuotationMinPremSendEmail
}

export default BondQuotationService