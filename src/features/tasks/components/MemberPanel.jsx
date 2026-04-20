import { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { TaskList } from './TaskList';

/**
 * Panneau latéral (slide-in depuis la droite) affichant les tâches d'un membre.
 *
 * Props :
 * - user            : objet user sélectionné (ou null → panneau fermé)
 * - tasks           : tableau de tâches du membre
 * - isLoading       : booléen
 * - onClose         : callback pour fermer le panneau
 * - connectedUserId : transmis à TaskList (readonly = vrai car c'est les tâches d'un autre)
 * - userRole        : transmis à TaskList
 */
export const MemberPanel = ({ user, tasks = [], isLoading, onClose, connectedUserId, userRole }) => {
    const panelRef = useRef(null);

    // Fermer au clic en dehors du panneau
    useEffect(() => {
        if (!user) return;
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        // Léger délai pour éviter que le clic d'ouverture ferme immédiatement
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user, onClose]);

    // Fermer avec Échap
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Bloque le scroll du body quand le panneau est ouvert sur mobile
    useEffect(() => {
        if (user) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [user]);

    if (!user) return null;

    return (
        <>
            {/* Overlay sombre derrière le panneau */}
            <div
                className="fixed inset-0 bg-main-900/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                aria-hidden="true"
            />

            {/* Panneau latéral */}
            <div
                ref={panelRef}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
                           flex flex-col
                           animate-in slide-in-from-right duration-300"
            >
                {/* Header panneau */}
                <div className="flex items-center justify-between p-6 border-b border-main-100 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-main-100 text-main-600 flex items-center justify-center font-bold text-sm">
                            {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-chewy text-main-800 text-lg leading-tight">
                                {user.firstname} {user.lastname}
                            </p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider
                                ${user.role === 'Admin' ? 'text-secondary-500' : 'text-main-400'}`}>
                                {user.role === 'Admin' ? 'Admin' : 'Membre'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-main-400 hover:text-main-700 hover:bg-main-50 transition-all"
                        aria-label="Fermer le panneau"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 py-20 text-main-400">
                            <Loader2 className="animate-spin" size={22} />
                            <span className="font-medium">Chargement des pousses...</span>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-main-400 italic text-lg">Aucune pousse. 🌱</p>
                            <p className="text-main-300 text-sm mt-2">
                                {user.firstname} n'a pas encore de tâches.
                            </p>
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            connectedUserId={connectedUserId}
                            userRole={userRole}
                            readOnly={true}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-main-100 shrink-0">
                    <p className="text-center text-main-300 text-xs">
                        Vue en lecture seule · {tasks.length} pousse{tasks.length > 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        </>
    );
};