import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post('/auth/signup', { name, email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed');
        }
        throw new Error('Network error occurred');
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Login failed');
        }
        throw new Error('Network error occurred');
    }
};

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch tasks');
        }
        throw new Error('Network error occurred');
    }
};

export const createTask = async (task: any) => {
    try {
        const response = await api.post('/tasks', task);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to create task');
        }
        throw new Error('Network error occurred');
    }
};

export const updateTask = async (id: number, task: any) => {
    try {
        const response = await api.put(`/tasks/${id}`, task);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to update task');
        }
        throw new Error('Network error occurred');
    }
};

export const deleteTask = async (id: number) => {
    try {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to delete task');
        }
        throw new Error('Network error occurred');
    }
};

export default api; 