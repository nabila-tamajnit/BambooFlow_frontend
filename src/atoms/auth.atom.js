import { atom } from 'jotai';
import { jwtDecode } from 'jwt-decode';

// On récupère le token stocké (s'il existe) dès l'ouverture du site
const savedToken = localStorage.getItem('bamboo_token');

// On initialise l'atome avec la valeur sauvegardée au lieu de null
export const tokenAtom = atom(savedToken);

// Atom dérivé pour l'état de connexion
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
