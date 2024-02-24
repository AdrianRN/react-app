import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

const getByBranch = async (folioBranch:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiSubBranch}/GetSubBrancheByBranch/${folioBranch}`)
    return response.data;
};

const SubBranchesService = {
    getByBranch
}

export default SubBranchesService