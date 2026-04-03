import { atom } from 'jotai';

// Atom qui stock le token
export const tokenAtom = atom(null);

// Atom dérivé qui représente l'etat de connection
export const isConnectAtom = atom((get) => {
    const token = get(tokenAtom);
    return token !== null;
});
