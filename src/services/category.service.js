import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from '../atoms/auth.atom';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function authHeader() {
    const token = getDefaultStore().get(tokenAtom);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const categoryService = {

    getAll: async () => {
        const response = await axios.get(`${BASE}/categories`, {
            headers: authHeader(),
        });
        return response.data;
    },

    create: async (data) => {
        const response = await axios.post(`${BASE}/categories`, data, {
            headers: authHeader(),
        });
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`${BASE}/categories/${id}`, data, {
            headers: authHeader(),
        });
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${BASE}/categories/${id}`, {
            headers: authHeader(),
        });
    },
};

export default categoryService;