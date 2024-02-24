import axios from 'axios';
import { API_URL, Enviroment } from '../enviroment/enviroment';
import ResultObject from '../models/ResultObject';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;',
        "accept": "*",
    }
};

const getTasksEmail = async (email: any): Promise<ResultObject>=>{
    const response = await axios.post<ResultObject>(`${API_URL}/${Enviroment.apiTasks}/PostTasksEmailAssignee`,email,axiosConfig);
    return response.data;
}

const getTaskById =  async (id:string): Promise<ResultObject> =>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiTasks}/GetTasks/${id}`);
    return response.data;
}

const getTaskAssigneeById = async (id:string): Promise<ResultObject> => {
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiTasks}/GetTasksAssignee/${id}`);
    return response.data;
}

const getPersonalTask = async (): Promise<ResultObject> =>{
    const response = await axios.get<ResultObject>(`${API_URL}/${Enviroment.apiTasks}/GetTasks`);
    return response.data;
}

const TasksService = {
    getTasksEmail,
    getTaskById,
    getTaskAssigneeById,
    getPersonalTask
};
  
  export default TasksService;