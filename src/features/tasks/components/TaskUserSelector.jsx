import { Loader2, AlertTriangle } from 'lucide-react';

/**
 * Reçoit allUsers depuis le parent (TaskHome) pour éviter un double appel API.
 * Le parent gère déjà userService.getAll().
 */
export function TaskUserSelector({
    onUserSelected = () => {},
    connectedUserId = null,
    allUsers = [],          // reçu depuis TaskHome
    isLoading = false,      // état de chargement géré par le parent
    error = null,           // erreur gérée par le parent
}) {
    const [userIdSelected, setUserIdSelected] = useState(null);

    const handleUserClick = (user) => {
        if (user._id === connectedUserId) return; // bloque le clic sur soi-même
        setUserIdSelected(user._id);
        onUserSelected(user);
    };

    // Trie : user connecté en premier, puis les autres par ordre alphabétique
    const sortedUsers = [...allUsers].sort((a, b) => {
        if (a._id === connectedUserId) return -1;
        if (b._id === connectedUserId) return 1;
        return a.firstname.localeCompare(b.firstname);
    });

    return (
        <div className="space-y-3">
            <p className="text-sm font-bold text-main-400 uppercase tracking-wider ml-1">
                Membres de la forêt
            </p>

            {isLoading && (
                <div className="flex items-center gap-3 p-4 text-main-500 italic">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Réveil des gardiens...</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {!isLoading && !error && sortedUsers.length > 0 && (
                <div className="flex flex-col gap-2">
                    {sortedUsers.map(user => {
                        const isMe = user._id === connectedUserId;
                        const isSelected = user._id === userIdSelected;
                        const isAdmin = user.role === 'Admin';

                        return (
                            <button
                                key={user._id}
                                onClick={() => handleUserClick(user)}
                                disabled={isMe}
                                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left w-full
                                    ${isMe
                                        ? 'bg-main-50 border-main-100 cursor-default'
                                        : isSelected
                                            ? 'bg-main-100 border-main-300 shadow-sm cursor-pointer'
                                            : 'bg-white border-transparent hover:border-main-200 hover:bg-main-50/50 cursor-pointer'
                                    }`}
                            >
                                {/* Avatar initiales */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors
                                    ${isMe
                                        ? 'bg-main-200 text-main-600'
                                        : isSelected
                                            ? 'bg-main-500 text-white'
                                            : 'bg-main-100 text-main-600'
                                    }`}>
                                    {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                </div>

                                {/* Nom + rôle */}
                                <div className="flex flex-col min-w-0">
                                    <span className={`font-bold truncate transition-colors
                                        ${isMe ? 'text-main-500' : isSelected ? 'text-main-900' : 'text-main-700'}`}>
                                        {user.firstname} {user.lastname}
                                        {isMe && (
                                            <span className="ml-2 text-[10px] text-main-400 font-normal">(vous)</span>
                                        )}
                                    </span>
                                    {/* Rôle : Admin en orange, Membre en vert discret */}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider
                                        ${isAdmin ? 'text-secondary-500' : 'text-main-400'}`}>
                                        {isAdmin ? 'Admin' : 'Membre'}
                                    </span>
                                </div>

                                {/* Indicateur "sélectionné" */}
                                {isSelected && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-main-500 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {!isLoading && !error && sortedUsers.length === 0 && (
                <p className="text-main-400 text-sm italic p-4 text-center">
                    Aucun membre trouvé.
                </p>
            )}
        </div>
    );
}

// Import manquant — à ajouter en haut du fichier
import { useState } from 'react';