import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getMenu = async () : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiMenu}/GetMenu`)
    return response.data;
};

const getMenuPrent = async (idParent:string) : Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiMenu}/GetMenuParent/${idParent}`)
    return response.data;
};

const MenuService = {
    getMenu,
    getMenuPrent
};

export default MenuService