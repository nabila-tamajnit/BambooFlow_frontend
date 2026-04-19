import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from "../atoms/auth.atom";

const taskService = {

    // Retourne { tasksToDo: [], tasksGiven: [] }
    getByUserId: async (userId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Le backend renvoie directement { tasksToDo, tasksGiven }
        // On s'assure de toujours retourner cet objet, jamais un tableau wrappé
        const data = response.data;
        if (Array.isArray(data)) {
            // Cas où le backend aurait wrappé dans un tableau (legacy)
            return data[0] || { tasksToDo: [], tasksGiven: [] };
        }
        return data || { tasksToDo: [], tasksGiven: [] };
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
    }
};

export default taskService;