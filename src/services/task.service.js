import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from "../atoms/auth.atom";

// const taskService = {

// Route demandée par le prof pour avoir les tâches d'un utilisateur précis
// getByUser: async (userId) => {
//     const token = getDefaultStore().get(tokenAtom); // On récupère le token

//     const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`, {
//         headers: {
//             Authorization: `Bearer ${token}` // On l'envoie obligatoirement ici
//         }
//     });
//     return response.data;
// },

const taskService = {
    getByUserId: async (userId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // FORCE LE FORMAT TABLEAU : 
        // Si response.data est déjà un tableau, on le garde. 
        // Si c'est un objet seul, on l'enveloppe dans [].
        // Si c'est nul, on renvoie [].
        const data = response.data;
        return Array.isArray(data) ? data : (data ? [data] : []);
    },


    // src/services/task.service.js
    getById: async (taskId) => {
        const token = getDefaultStore().get(tokenAtom);
        const response = await axios.get(`http://localhost:3000/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },


    // Optionnel : Pour créer une nouvelle tâche plus tard
    // src/services/task.service.js
    create: async (taskData) => {
        const token = getDefaultStore().get(tokenAtom);
        // Vérifie bien que l'URL est exactement celle du backend
        const response = await axios.post("http://localhost:3000/api/tasks", taskData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }

};

export default taskService;
