import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function authHeader() {
    const token = getDefaultStore().get(tokenAtom);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const taskService = {

    /**
     * Récupère toutes les tâches de l'utilisateur connecté.
     * Retourne un tableau de tâches.
     */
    getAll: async () => {
        const response = await axios.get(`${BASE}/tasks`, {
            headers: authHeader(),
        });
        const data = response.data;
        return Array.isArray(data) ? data : (data?.tasks || []);
    },

    getById: async (taskId) => {
        const response = await axios.get(`${BASE}/tasks/${taskId}`, {
            headers: authHeader(),
        });
        return response.data;
    },

    create: async (taskData) => {
        const response = await axios.post(`${BASE}/tasks`, taskData, {
            headers: authHeader(),
        });
        return response.data;
    },

    update: async (taskId, taskData) => {
        const response = await axios.put(`${BASE}/tasks/${taskId}`, taskData, {
            headers: authHeader(),
        });
        return response.data;
    },

    updateStatus: async (taskId, isDone) => {
        const response = await axios.patch(`${BASE}/tasks/${taskId}`, { isDone }, {
            headers: authHeader(),
        });
        return response.data;
    },

    delete: async (taskId) => {
        await axios.delete(`${BASE}/tasks/${taskId}`, {
            headers: authHeader(),
        });
    },
};

export default taskService;

