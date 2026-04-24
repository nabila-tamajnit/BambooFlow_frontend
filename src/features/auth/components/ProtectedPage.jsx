/**
 * ProtectedPage.jsx
 *
 * Problème précédent : atomWithStorage initialise le token de façon synchrone
 * depuis localStorage, mais lors d'un premier rendu React (surtout en dev avec HMR),
 * isConnectAtom peut retourner false le temps que Jotai lise le storage.
 * Résultat : ProtectedPage redirige vers /login alors que l'utilisateur est connecté.
 *
 * Solution : on lit directement localStorage pour la vérification initiale,
 * PUIS on vérifie l'expiration JWT. Ça évite le flash de redirection.
 */

import { useAtomValue } from 'jotai';
import { isConnectAtom } from '../../../atoms/auth.atom';
import { Navigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';

export function ProtectedPage({ children }) {
    const isConnect = useAtomValue(isConnectAtom);

    // Double vérification : Jotai + localStorage direct pour éviter le flash
    // Jotai peut être "pas encore initialisé" lors du premier rendu après refresh
    const rawToken = localStorage.getItem('bamboo_token');
    const tokenFromStorage = rawToken ? JSON.parse(rawToken) : null; 
    let isValidFromStorage = false;
    if (tokenFromStorage) {
        try {
            const { exp } = jwtDecode(tokenFromStorage);
            isValidFromStorage = exp * 1000 > Date.now();
        } catch {
            isValidFromStorage = false;
        }
    }

    // On considère connecté si l'un OU l'autre confirme la validité
    // (Jotai peut avoir un léger délai au premier rendu)
    const isAuthenticated = isConnect || isValidFromStorage;

    if (!isAuthenticated) {
        return <Navigate to='/auth/login' replace />;
    }

    return children;
}