/**
 * TaskItem.jsx
 *
 * Permissions selon la nouvelle logique :
 *   Récolter : assignée à moi ET pas faite, OU admin
 *   Supprimer : admin, ou j'ai créé, ou c'est assigné à moi
 */

import { NavLink } from 'react-router';
import { Trash2, CheckCircle } from 'lucide-react';

export const TaskItem = ({
    task,
    connectedUserId,
    userRole,
    readOnly = false,
    onComplete,
    onDelete,
}) => {
    const category = task.categoryId;
    const isAdmin = userRole === 'Admin';

    const colorMap = {
        green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
        yellow: 'bg-amber-50 text-amber-700 border-amber-200',
        red:    'bg-red-50 text-red-700 border-red-200',
    };
    const activeStyle = colorMap[category?.color] || colorMap.green;

    if (!task._id) return null;

    const toId   = task.toUserId?._id   ?? task.toUserId;
    const fromId = task.fromUserId?._id ?? task.fromUserId;

    const isAssignedToMe = toId   === connectedUserId;
    const isCreatedByMe  = fromId === connectedUserId;

    const canComplete = !readOnly && !task.isDone && (isAssignedToMe || isAdmin);
    const canDelete   = !readOnly && (isAdmin || isCreatedByMe || isAssignedToMe);

    return (
        <div className={`bg-white rounded-[2rem] border border-main-100 shadow-sm transition-all group
            ${task.isDone ? 'opacity-50' : 'hover:shadow-md'}`}>

            <NavLink to={`/task/${task._id}`} className="block p-6">

                {/* Badge catégorie + statut */}
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${activeStyle}`}>
                        {category?.name || 'Sans catégorie'} · {category?.priority || 'Normal'}
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

                {/* Description courte */}
                {task.description && (
                    <p className="text-sm text-main-400 line-clamp-2 mt-1">
                        {task.description}
                    </p>
                )}

                {/* Meta De / Pour */}
                <div className="mt-4 flex justify-between items-center text-[10px] text-main-400 font-bold uppercase tracking-wider">
                    <span>De : {task.fromUserId?.firstname || '?'}</span>
                    <span>Pour : {task.toUserId?.firstname || '?'}</span>
                </div>
            </NavLink>

            {/* Actions hors du NavLink */}
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