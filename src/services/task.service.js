import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from "../atoms/auth.atom";

const taskService = {

    /**
     * Récupère les tâches de l'utilisateur connecté.
     * Protégé côté backend par userAuthorizationMiddleware.
     * NE PAS appeler avec l'id d'un autre user — provoquera un 403.
     */
    getMyTasks: async (userId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        if (Array.isArray(data)) {
            return data[0] || { tasksToDo: [], tasksGiven: [] };
        }
        return data || { tasksToDo: [], tasksGiven: [] };
    },

    /**
     * Récupère les tâches publiques d'un autre membre (lecture seule).
     * Accessible à tous les users connectés sans restriction 403.
     */
    getPublicUserTasks: async (userId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        return data || { tasksToDo: [] };
    },

    getById: async (taskId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    create: async (taskData) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.post("http://localhost:3000/api/tasks", taskData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateStatus: async (taskId, isDone) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.patch(`http://localhost:3000/api/tasks/${taskId}`, { isDone }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    delete: async (taskId) => {
        const token = getDefaultStore().get(tokenAtom);
        await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
};

export default taskService;