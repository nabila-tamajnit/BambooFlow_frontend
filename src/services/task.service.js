import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from "../atoms/auth.atom";

const taskService = {

    getByUserId: async (userId) => {
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