// src/services/user.service.js — ajouter getMe
import axios from 'axios';
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function authHeader() {
    const token = getDefaultStore().get(tokenAtom);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const userService = {

    getMe: async () => {
        const response = await axios.get(`${BASE}/users/me`, {
            headers: authHeader(),
        });
        return response.data;
    },

    getAll: async () => {
        const response = await axios.get(`${BASE}/users`, {
            headers: authHeader(),
        });
        return response.data;
    },
};

export default userService;