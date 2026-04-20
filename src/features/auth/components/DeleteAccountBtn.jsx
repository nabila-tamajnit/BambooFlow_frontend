import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { Trash2, AlertTriangle } from 'lucide-react';
import { tokenAtom } from '../../../atoms/auth.atom';
import authService from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { useAtomValue } from 'jotai';

export function DeleteAccountButton() {
    const token = useAtomValue(tokenAtom);
    const setToken = useSetAtom(tokenAtom);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const userId = token ? jwtDecode(token).id : null;

    const handleDelete = async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            await authService.deleteAccount(userId);
            // Nettoie l'état global et redirige vers l'accueil
            setToken(null);
            navigate('/');
        } catch (err) {
            console.error('Erreur suppression compte:', err);
            setError('Impossible de supprimer le compte. Réessayez.');
            setIsLoading(false);
        }
    };

    if (!showConfirm) {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
            >
                <Trash2 size={16} />
                Supprimer mon compte
            </button>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-red-700 text-sm">Supprimer définitivement votre compte ?</p>
                    <p className="text-red-500 text-xs mt-1">
                        Cette action est irréversible. Toutes vos données seront perdues.
                    </p>
                </div>
            </div>

            {error && (
                <p className="text-red-600 text-xs font-medium">{error}</p>
            )}

            <div className="flex gap-3">
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                    {isLoading ? 'Suppression...' : 'Oui, supprimer'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border-2 border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}