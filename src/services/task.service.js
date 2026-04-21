/**
 * task.service.js
 *
 * Routes backend disponibles (après modifications de la prof) :
 *
 *   GET    /api/tasks/user/:id   → tâches de l'utilisateur connecté (protected: owner ou admin)
 *                                  Retourne : { tasksToDo: [], tasksGiven: [] }
 *
 *   GET    /api/tasks/:id        → une tâche par id (protected: auth)
 *   POST   /api/tasks            → créer une tâche (protected: auth)
 *   PATCH  /api/tasks/:id        → modifier le statut isDone (protected: owner ou admin)
 *   DELETE /api/tasks/:id        → supprimer (protected: owner ou admin)
 *
 * Route SUPPRIMÉE par la prof :
 *   GET /api/tasks/user/:id/tasks  → n'existe plus → remplacée par getByUser avec rôle Admin
 *
 * Nouveau comportement :
 *   - User   : ne voit que SES tâches → GET /api/tasks/user/:id (son propre id)
 *   - Admin  : voit TOUTES les tâches → GET /api/tasks (route générale)
 */

import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';

const BASE = 'http://localhost:3000/api';

// Helper interne — évite de répéter le header partout
function authHeader() {
    const token = getDefaultStore().get(tokenAtom);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const taskService = {

    /**
     * Récupère les tâches de l'utilisateur connecté.
     * À appeler uniquement avec son propre id (middleware userAuthorization côté back).
     * Retourne { tasksToDo: Task[], tasksGiven: Task[] }
     */
    getMyTasks: async (userId) => {
        const response = await axios.get(`${BASE}/tasks/user/${userId}`, {
            headers: authHeader(),
        });
        // Normalisation : certaines versions du backend wrappent dans un tableau
        const data = response.data;
        if (Array.isArray(data)) return data[0] || { tasksToDo: [], tasksGiven: [] };
        return data || { tasksToDo: [], tasksGiven: [] };
    },

    /**
     * Récupère TOUTES les tâches (admin uniquement).
     * Retourne { count: number, tasks: Task[] }
     */
    getAllTasks: async () => {
        const response = await axios.get(`${BASE}/tasks`, {
            headers: authHeader(),
        });
        const data = response.data;
        // Format backend : { count, tasks } ou tableau direct
        if (Array.isArray(data)) return data;
        return data?.tasks || [];
    },

    /**
     * Récupère une tâche par son id.
     */
    getById: async (taskId) => {
        const response = await axios.get(`${BASE}/tasks/${taskId}`, {
            headers: authHeader(),
        });
        return response.data;
    },

    /**
     * Crée une tâche.
     * - User  : toUserId = son propre id (forcé dans le form)
     * - Admin : toUserId = l'id du membre choisi
     */
    create: async (taskData) => {
        const response = await axios.post(`${BASE}/tasks`, taskData, {
            headers: authHeader(),
        });
        return response.data;
    },

    /**
     * Met à jour le statut isDone d'une tâche.
     */
    updateStatus: async (taskId, isDone) => {
        const response = await axios.patch(`${BASE}/tasks/${taskId}`, { isDone }, {
            headers: authHeader(),
        });
        return response.data;
    },

    /**
     * Supprime une tâche.
     */
    delete: async (taskId) => {
        await axios.delete(`${BASE}/tasks/${taskId}`, {
            headers: authHeader(),
        });
    },
};

export default taskService;