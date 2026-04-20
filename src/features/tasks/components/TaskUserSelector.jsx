import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

/**
 * ⚠️  Ce composant NE fait PAS d'appel API.
 *     Il reçoit `allUsers` depuis TaskHome via props.
 *     TaskHome fait l'appel à userService.getAll() une seule fois au montage.
 *
 * Props :
 * - allUsers        : tableau users (chargé par TaskHome)
 * - connectedUserId : id du user connecté → affiché en premier, non-cliquable
 * - onUserSelected  : callback(user) au clic sur un membre
 * - isLoading       : true pendant le chargement initial dans TaskHome
 * - error           : message d'erreur éventuel
 */
export function TaskUserSelector({
    allUsers = [],
    connectedUserId = null,
    onUserSelected = () => {},
    isLoading = false,
    error = null,
}) {
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleClick = (user) => {
        if (user._id === connectedUserId) return;
        setSelectedUserId(user._id);
        onUserSelected(user);
    };

    // User connecté toujours en premier, reste trié alphabétiquement
    const sorted = [...allUsers].sort((a, b) => {
        if (a._id === connectedUserId) return -1;
        if (b._id === connectedUserId) return 1;
        return a.firstname.localeCompare(b.firstname);
    });

    return (
        <div className="space-y-2">
            <p className="text-sm font-bold text-main-400 uppercase tracking-wider mb-3">
                Membres de la forêt
            </p>

            {isLoading && (
                <div className="flex items-center gap-3 p-4 text-main-500 italic">
                    <Loader2 className="animate-spin" size={18} />
                    <span>Réveil des gardiens...</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-center gap-3">
                    <AlertTriangle size={18} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {!isLoading && !error && sorted.map(user => {
                const isMe = user._id === connectedUserId;
                const isSelected = user._id === selectedUserId;
                const isAdmin = user.role === 'Admin';

                return (
                    <button
                        key={user._id}
                        onClick={() => handleClick(user)}
                        disabled={isMe}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left
                            ${isMe
                                ? 'bg-main-50 border-main-100 cursor-default'
                                : isSelected
                                    ? 'bg-main-100 border-main-300 shadow-sm'
                                    : 'bg-white border-transparent hover:border-main-200 hover:bg-main-50/50'
                            }`}
                    >
                        {/* Avatar initiales */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                            ${isMe
                                ? 'bg-main-200 text-main-600'
                                : isSelected
                                    ? 'bg-main-500 text-white'
                                    : 'bg-main-100 text-main-600'
                            }`}>
                            {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                        </div>

                        {/* Nom + rôle */}
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className={`font-bold text-sm truncate
                                ${isMe ? 'text-main-500' : isSelected ? 'text-main-900' : 'text-main-700'}`}>
                                {user.firstname} {user.lastname}
                                {isMe && <span className="ml-1 text-[10px] text-main-400 font-normal">(vous)</span>}
                            </span>
                            {/* Admin en orange, Membre en vert discret */}
                            <span className={`text-[10px] font-bold uppercase tracking-wider
                                ${isAdmin ? 'text-secondary-500' : 'text-main-400'}`}>
                                {isAdmin ? 'Admin' : 'Membre'}
                            </span>
                        </div>

                        {/* Indicateur sélectionné */}
                        {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-main-500 shrink-0" />
                        )}
                    </button>
                );
            })}

            {!isLoading && !error && sorted.length === 0 && (
                <p className="text-main-400 text-sm italic text-center py-4">
                    Aucun membre trouvé.
                </p>
            )}
        </div>
    );
}