import { atom } from 'jotai';
import { jwtDecode } from 'jwt-decode';

const savedToken = localStorage.getItem('bamboo_token');

export const tokenAtom = atom(savedToken);

export const isConnectAtom = atom((get) => {
    const token = get(tokenAtom);
    return token !== null && token !== undefined;
});

export const roleAtom = atom((get) => {
    const token = get(tokenAtom);
    if (!token) return null;
    try {
        return jwtDecode(token).role;
    } catch {
        return null;
    }
});