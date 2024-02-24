import axios from 'axios';
import { Enviroment, API_URL_INSURANCE } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';
import Policy from '../insuranceModels/policies';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getPolicies = async (): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}`);
    return response.data;
}

const getPoliciesByFolio = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/ByFolio?folio=` + folio);
    return response.data;
}

const GetPoliciesByClientOrPolicyNumber = async (filter: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/GetPoliciesByClientOrPolicyNumber/${filter}`);
    return response.data;
}

const getPoliciesByNoPolicy = async (folio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PolicyNoFilter?noPolicyFilter=` + folio);
    return response.data;

};
const getPoliciesByClientFolio = async (clientId: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/ByClientFolio?ClientFolio=${clientId}`);
    return response.data;
};

const getPoliciesByPerson = async (policyFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/GetPoliciesByPerson?FolioPolicies=${policyFolio}`);
    return response.data;
};

const getPoliciesByPersonContact = async (policyFolio: string, personFolio: string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/GetPoliciesByPersonContact?FolioPolicies=${policyFolio}&FolioPerson=${personFolio}`);
    return response.data;
}

const getPoliciesExpiredCanceledPendingAsync = async(clientId: string, status: number): Promise<ResultObject> => {
    try {
        const response = await axios.get<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/GetPoliciesExpiredCanceledPendingAsync?ClientId=${clientId}&status=${status}`);
        return response;
    } catch (error) {
        console.log("Error in GetPoliciesExpiredCanceledPendingAsync", error);
        throw error;
    }
}

const post = async (request: Policy): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PostPolicies`, request, axiosConfig);
    return response.data;
};

const postPolicyPerson = async (policyFolio: string, data: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PostPoliciesPerson?FolioPolicies=${policyFolio}`, data, axiosConfig);
    return response.data;
}

const PostPoliciesPersonContact = async (policyFolio: string, personFolio: string, data: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PostPoliciesPersonContact?FolioPolicies=${policyFolio}&FolioPerson=${personFolio}`, data, axiosConfig);
    return response.data
}

const postPoliciesPersonBeneficiary = async(policyFolio: string, personFolio: string, data: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PostBeneficiario?FolioPolicies=${policyFolio}&FolioPerson=${personFolio}`, data, axiosConfig);
    return response.data
}
const postPolicyCopy = async (folioPolicy: any): Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PostPoliceCopy?FolioPolice=${folioPolicy}`)
    return response.data
}

const put = async (folio: string, request: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PutPolicies?folio=${folio}`, request, axiosConfig);
    return response.data;
};

const putCoveragePackageByFolio = async (folio: string, coveragePackageFolio: string): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/${folio}?coveragePackageFolio=${coveragePackageFolio}`, axiosConfig);
    return response.data;
};

const patchPolicyDamageCoveragePackage = async (folio: string, coveragePackageFolio: string): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/policy-damage/${folio}?coveragePackageFolio=${coveragePackageFolio}`, axiosConfig);
    return response.data;
};

const putPoliciesPersonContact = async (policyFolio: string, personFolio: string, data: any): Promise<ResultObject> => {
    const response = await axios.put<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/PutPoliciesPersonContact?FolioPolicies=${policyFolio}&FolioPerson=${personFolio}`, data, axiosConfig);
    return response.data;
}

const deletePolicyPerson = async (folioPolicy: string, folioPerson: string) => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/DeletePoliciesPerson?FolioPolicies=${folioPolicy}&FolioPerson=${folioPerson}`);
    return response.data;
}

const deletePolicyPersonContac = async (folioPolicy: string, folioPerson: string, folioContact: string) => {
    const response = await axios.delete<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/DeletePoliciesPersonContac?FolioPolicies=${folioPolicy}&FolioPerson=${folioPerson}&FolioContact=${folioContact}`);
    return response.data;
}

const checkIssuanceStatus = async(folioPolicy: string) => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/checkIssuanceStatus?folio=${folioPolicy}`, axiosConfig)
    return response.data
}

const issuancePolicy = async(folioPolicy: string) => {
    const response = await axios.post<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/issuance?folio=${folioPolicy}`, axiosConfig)
    return response.data
}
/** patchPolicyStatus
 * Este método se encarga de actualizar el estado de una póliza seleccionada.
 * @param {string} folio - El folio de la póliza a actualizar.
 * @param {Object} data - El objeto de datos a actualizar. Debe incluir:
 *   - comments: Comentario de la póliza (opcional, puede estar en blanco).
 *   - policyStatusFolio: Folio del estado de la póliza.
 *   - policyStatusDescription: Descripción del estado de la póliza (ejemplo: VENCIDA, PENDIENTE, VIGENTE, etc.).
 * @returns {Promise<ResultObject>} - Una promesa que resuelve en la póliza actualizada con el nuevo estado y comentario.
 */
const patchPolicyStatus = async (folio: string, data: { comments: string, policyStatusFolio: string, policyStatusDescription: string }): Promise<ResultObject> => {
    const response = await axios.patch<ResultObject>(`${API_URL_INSURANCE}/${Enviroment.apiPolicies}/policyStatus?policyFolio=${folio}`, data, axiosConfig);
    return response.data;
};

const PoliciyService = {
    getPolicies,
    getPoliciesByFolio,
    GetPoliciesByClientOrPolicyNumber,
    getPoliciesByNoPolicy,
    getPoliciesByClientFolio,
    getPoliciesByPerson,
    getPoliciesByPersonContact,
    getPoliciesExpiredCanceledPendingAsync,
    put,
    putPoliciesPersonContact,
    post,
    postPolicyPerson,
    PostPoliciesPersonContact,
    postPoliciesPersonBeneficiary,
    postPolicyCopy,
    putCoveragePackageByFolio,
    patchPolicyDamageCoveragePackage,
    deletePolicyPerson,
    deletePolicyPersonContac,
    checkIssuanceStatus,
    issuancePolicy,
    patchPolicyStatus,
}

export default PoliciyService
