import { NavLink } from "react-router";
import { Trash2, CheckCircle } from "lucide-react";

/**
 * Props :
 * - task          : objet tâche complet (populé depuis le backend)
 * - connectedUserId : id du user connecté
 * - userRole      : 'Admin' | 'User'
 * - readOnly      : true → aucune action possible (vue d'un autre membre)
 * - onComplete    : callback(taskId) quand on récolte
 * - onDelete      : callback(taskId) quand on supprime
 *
 * Règles de permissions appliquées ici :
 * - Récolter : si la tâche m'est assignée (toUserId === moi) ET pas encore faite
 * - Supprimer :
 *     • j'ai planté la tâche (fromUserId === moi) → toujours autorisé
 *     • la tâche m'est assignée ET elle est terminée → autorisé
 *     • Admin → toujours autorisé
 */
export const TaskItem = ({ task, connectedUserId, userRole, readOnly = false, onComplete, onDelete }) => {
    const category = task.categoryId;

    const colorMap = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200",
    };
    const activeStyle = colorMap[category?.color] || colorMap.green;

    if (!task._id) return null;

    const isAdmin = userRole === 'Admin';
    // Normalise l'id (populé = objet avec _id, non-populé = string)
    const toId = task.toUserId?._id ?? task.toUserId;
    const fromId = task.fromUserId?._id ?? task.fromUserId;

    const isAssignedToMe = toId === connectedUserId;
    const isPlantedByMe = fromId === connectedUserId;

    // Peut récolter : tâche assignée à moi, pas encore faite, pas readOnly
    const canComplete = !readOnly && !task.isDone && isAssignedToMe;

    // Peut supprimer :
    //   - Admin : toujours
    //   - J'ai planté cette tâche : toujours
    //   - La tâche m'est assignée ET elle est terminée
    const canDelete = !readOnly && (
        isAdmin ||
        isPlantedByMe ||
        (isAssignedToMe && task.isDone)
    );

    return (
        <div className={`bg-white rounded-[2rem] border border-main-100 shadow-sm transition-all group
            ${task.isDone ? 'opacity-50' : 'hover:shadow-md'}`}>

            {/* Lien vers le détail — toute la carte est cliquable */}
            <NavLink to={`/task/${task._id}`} className="block p-6">

                {/* Badges haut */}
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${activeStyle}`}>
                        {category?.priority || 'Normal'}
                    </span>
                    {task.isDone && (
                        <span className="text-[10px] uppercase font-black text-emerald-600 flex items-center gap-1">
                            <CheckCircle size={10} /> Récoltée
                        </span>
                    )}
                </div>

                {/* Titre */}
                <h4 className="text-lg font-bold text-main-800 group-hover:text-main-500 transition-colors mb-1">
                    {task.name}
                </h4>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-main-400 line-clamp-2 mt-1">
                        {task.description}
                    </p>
                )}

                {/* Meta */}
                <div className="mt-4 flex justify-between items-center text-[10px] text-main-400 font-bold uppercase tracking-wider">
                    <span>De : {task.fromUserId?.firstname || '?'}</span>
                    <span>Pour : {task.toUserId?.firstname || '?'}</span>
                </div>
            </NavLink>

            {/* Actions — en dehors du NavLink pour éviter la navigation au clic */}
            {(canComplete || canDelete) && (
                <div className="px-6 pb-5 flex gap-2">
                    {canComplete && onComplete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onComplete(task._id); }}
                            className="flex-1 text-xs font-bold text-main-600 border-2 border-main-200 rounded-xl py-2 hover:bg-main-50 hover:border-main-300 transition-all flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle size={13} />
                            Récolter
                        </button>
                    )}
                    {canDelete && onDelete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete(task._id); }}
                            className="px-3 py-2 text-xs font-bold text-red-500 border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};