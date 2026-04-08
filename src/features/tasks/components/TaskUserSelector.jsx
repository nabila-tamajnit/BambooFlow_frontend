import { useEffect, useState } from 'react';
import userService from '../../../services/user.service';
import { User, Loader2, AlertTriangle } from 'lucide-react';

export function TaskUserSelector({ onUserSelected = () => { } }) {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [userIdSelected, setUserIdSelected] = useState(null);

    useEffect(() => {
        setLoading(true);
        setData(null);
        setError(null);

        userService.getAll()
            .then((users) => {
                setData(users);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleUserClick = (user) => {
        // Attention : vérifie si ton API utilise ._id ou .id
        console.log("Utilisateur cliqué :", user.firstname);
        setUserIdSelected(user._id);
        onUserSelected(user);
    };

    return (
        <div className="space-y-4">
            <p className="text-sm font-bold text-main-400 uppercase tracking-wider ml-1">
                Membres de la forêt
            </p>

            {isLoading ? (
                <div className="flex items-center gap-3 p-4 text-main-500 italic">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Réveil des gardiens...</span>
                </div>
            ) : data !== null ? (
                <div className="flex flex-col gap-2">
                    {data.map(user => (
                        <button
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left group ${user._id === userIdSelected
                                    ? 'bg-main-100 border-main-300 shadow-sm'
                                    : 'bg-white border-transparent hover:border-main-100 hover:bg-main-50/50'
                                }`}
                        >
                            {/* Avatar simple avec initiales */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${user._id === userIdSelected ? 'bg-main-500 text-white' : 'bg-main-100 text-main-600'
                                }`}>
                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                            </div>

                            <div className="flex flex-col">
                                <span className={`font-bold transition-colors ${user._id === userIdSelected ? 'text-main-900' : 'text-main-700'
                                    }`}>
                                    {user.firstname} {user.lastname}
                                </span>
                                <span className="text-[10px] text-main-400 font-medium">Gardien</span>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <p className="text-sm font-medium">Il y a eu un quack lors de la requête 🦆</p>
                </div>
            )}
        </div>
    );
}
