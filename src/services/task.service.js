// src/services/task.service.js
import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';

const BASE = 'http://localhost:3000/api';

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

    // ── ADMIN — conservés pour future évolution ──
    /**
     * Récupère les tâches de l'utilisateur connecté.
     * À appeler uniquement avec son propre id (middleware userAuthorization côté back).
     * Retourne { tasksToDo: Task[], tasksGiven: Task[] }
     */
    // getMyTasks: async (userId) => {
    //     const response = await axios.get(`${BASE}/tasks/user/${userId}`, {
    //         headers: authHeader(),
    //     });
    //     // Normalisation : certaines versions du backend wrappent dans un tableau
    //     const data = response.data;
    //     if (Array.isArray(data)) return data[0] || { tasksToDo: [], tasksGiven: [] };
    //     return data || { tasksToDo: [], tasksGiven: [] };
    // },

    /**
     * Récupère TOUTES les tâches (admin uniquement).
     * Retourne { count: number, tasks: Task[] }
     */
    // getAllTasks: async () => {
    //     const response = await axios.get(`${BASE}/tasks`, {
    //         headers: authHeader(),
    //     });
    //     const data = response.data;
    //     // Format backend : { count, tasks } ou tableau direct
    //     if (Array.isArray(data)) return data;
    //     return data?.tasks || [];
    // },
};

export default taskService;

