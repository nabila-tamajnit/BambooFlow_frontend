import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';
import { userProfileAtom } from '../atoms/user.atom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authService = {

    register: async (userData) => {
        const response = await axios.post(`${BASE}/auth/register`, userData);
        return response.data;
    },

    login: async ({ email, password }) => {
        const response = await axios.post(`${BASE}/auth/login`, { email, password });
        const { token, firstname, lastname, id, role } = response.data;

        // Stocker le token
        getDefaultStore().set(tokenAtom, token);

        // Stocker le profil de base reçu au login
        getDefaultStore().set(userProfileAtom, { id, firstname, lastname, email, role });

        return token;
    },

    deleteAccount: async (userId) => {
        const token = getDefaultStore().get(tokenAtom);
        await axios.delete(`${BASE}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Nettoyer
        getDefaultStore().set(tokenAtom, null);
        getDefaultStore().set(userProfileAtom, null);
    },
};

export default authService;