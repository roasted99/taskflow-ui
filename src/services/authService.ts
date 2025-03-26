import api from './api';
import { LoginData, RegisterData, User } from '../types/auth';

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  console.log("register has been called")
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/v1/users');
  return response.data;
};