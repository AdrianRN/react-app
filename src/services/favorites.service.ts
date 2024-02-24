import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const postNewFavorite = async (request:object) : Promise<ResultObject> => {
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiFavorite}/PostFavorite`, request, axiosConfig);
    return response.data;
};

export async function getFavoritesById(idPerson:string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiFavorite}/GetFavoritePersonId/${idPerson}`);
    return response.data;
}

export async function getFavorites(): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiFavorite}/GetFavorite/`);
    return response.data;
}

export async function deleteFavorite(folio:string): Promise<ResultObject>{    
    const response = await axios.delete(`${API_URL}/${Enviroment.apiFavorite}/DeleteFavoriteFolio/${folio}` );
    return response.data;
}

const FavoritesService = {
    
    postNewFavorite,
    getFavoritesById,
    deleteFavorite
    
};

export default FavoritesService