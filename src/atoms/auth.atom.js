import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { jwtDecode } from 'jwt-decode';


export const tokenAtom = atomWithStorage('bamboo_token', null);

/**
 * isConnectAtom — vérifie que le token existe ET n'est pas expiré.
 * compare l'expiration à l'heure actuelle.
 */
export const isConnectAtom = atom((get) => {
    const token = get(tokenAtom);
    if (!token) return false;
    try {
        const { exp } = jwtDecode(token);
        return exp * 1000 > Date.now();
    } catch {
        return false;
    }
});

/**
 * roleAtom — lit le rôle depuis le payload JWT.
 * Retourne 'Admin' | 'User' | null.
 */
export const roleAtom = atom((get) => {
    const token = get(tokenAtom);
    if (!token) return null;
    try {
        return jwtDecode(token).role ?? null;
    } catch {
        return null;
    }
});