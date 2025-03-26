import api from './api';
import { CreateTaskData, Task, UpdateTaskData } from '../types/task';

// export const getTasks = async (): Promise<Task[]> => {
//   const response = await api.get('/v1/tasks');
//   return response.data;
// };

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/v1/tasks/${id}`);
  return response.data;
};
export const getTasks = async (
  params: {
    status?: string;
    priority?: string;
    assigned_to_id?: string;
    date_range?: string;
  } = {}
) => {
  try {
    const response = await api.get('/v1/tasks', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post('/v1/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/v1/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};