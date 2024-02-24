import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

export async function getPublicMessages(): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiMessage}/GetMessage`);
    return response.data;
    
}

export async function getMessagesById(id:string): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiMessage}/GetMessage/${id}`);
    return response.data;
}

export async function addMessage(message:any): Promise<ResultObject>{    
    let header = {
        headers: {
            'Content-Type': 'application/json;',
            "accept": "*",
        }
      };
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiMessage}/PostMessage`,message,header);
    return response.data;
}

export async function updateMessage(idMessage:string, message:any): Promise<ResultObject>{    
    let header = {
        headers: {
            'Content-Type': 'application/json;',
            "accept": "*",
        }
      };
    const response = await axios.put<ResultObject>(`${API_URL}/${Enviroment.apiMessage}/PutMessage?Id=` + idMessage,message,header);
    return response.data;
}

export async function deleteMessage(idMessage:string): Promise<ResultObject>{    
    const response = await axios.delete(`${API_URL}/${Enviroment.apiMessage}/DeleteMessage/${idMessage}` );
    return response.data;
}



export async function getPersonalTasks(): Promise<ResultObject>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiPeople}/GetPeople`);
    return response.data;
}


