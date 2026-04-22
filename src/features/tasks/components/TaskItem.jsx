// src/features/tasks/components/TaskItem.jsx
import { NavLink } from 'react-router';
import { Trash2, CheckCircle, Pencil, Clock } from 'lucide-react';

const PRIORITY_STYLES = {
    high:   { badge: 'bg-red-50 text-red-700 border-red-200',     icon: '🔥', label: 'Urgent' },
    medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⚡', label: 'Moyen' },
    low:    { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🌿', label: 'Faible' },
};

export const TaskItem = ({ task, onComplete, onDelete, onEdit, readOnly = false }) => {
    const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

    // Date de limite formatée
    const dueDate = task.before
        ? new Date(task.before).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        : null;

    // Tâche en retard ?
    const isOverdue = task.before && !task.isDone && new Date(task.before) < new Date();

    return (
        <div className={`bg-white rounded-[2rem] border shadow-sm transition-all group
            ${task.isDone
                ? 'opacity-50 border-main-100'
                : isOverdue
                    ? 'border-red-200 hover:shadow-md hover:shadow-red-100'
                    : 'border-main-100 hover:shadow-md'
            }`}>

            {/* Zone cliquable → détail */}
            <NavLink to={`/task/${task._id}`} className="block p-5">

                <div className="flex justify-between items-start mb-3">
                    {/* Badge priorité */}
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border flex items-center gap-1 ${p.badge}`}>
                        {p.icon} {p.label}
                    </span>

                    {/* Date limite */}
                    {dueDate && (
                        <span className={`text-[10px] font-bold flex items-center gap-1
                            ${isOverdue ? 'text-red-500' : 'text-main-400'}`}>
                            <Clock size={10} />
                            {isOverdue ? '⚠️ ' : ''}{dueDate}
                        </span>
                    )}
                </div>

                {/* Titre */}
                <h4 className={`font-bold text-main-800 group-hover:text-main-500 transition-colors leading-snug
                    ${task.isDone ? 'line-through text-main-400' : ''}`}>
                    {task.name}
                </h4>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-main-400 mt-1.5 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Catégorie */}
                {task.categoryId && (
                    <span className="inline-block mt-2 text-[10px] text-main-400 font-medium">
                        {task.categoryId.icon} {task.categoryId.name}
                    </span>
                )}
            </NavLink>

            {/* Actions */}
            {!readOnly && (
                <div className="px-5 pb-4 flex gap-2">
                    {!task.isDone && onComplete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onComplete(task._id); }}
                            className="flex-1 text-xs font-bold text-main-600 border-2 border-main-200 rounded-xl py-2
                                       hover:bg-main-50 hover:border-main-300 transition-all flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle size={13} /> Terminer
                        </button>
                    )}
                    {onEdit && !task.isDone && (
                        <button
                            onClick={(e) => { e.preventDefault(); onEdit(task); }}
                            className="px-3 py-2 text-xs font-bold text-main-500 border-2 border-main-200 rounded-xl
                                       hover:bg-main-50 transition-all flex items-center justify-center"
                        >
                            <Pencil size={13} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete(task._id); }}
                            className="px-3 py-2 text-xs font-bold text-red-500 border-2 border-red-100 rounded-xl
                                       hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};