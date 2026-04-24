// src/features/tasks/components/TaskItem.jsx
import { NavLink } from 'react-router';
import { Trash2, CheckCircle, Pencil, Clock, Flame, Zap, Leaf } from 'lucide-react';
import { ICON_MAP } from '../utils/categoryIcons';

const PRIORITY_STYLES = {
    high: {
        badge: 'bg-red-50 text-red-600 border-red-200',
        label: 'Urgent',
        Icon: Flame,
    },
    medium: {
        badge: 'bg-amber-50 text-amber-600 border-amber-200',
        label: 'Moyen',
        Icon: Zap,
    },
    low: {
        badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        label: 'Faible',
        Icon: Leaf,
    },
};

export const TaskItem = ({ task, onComplete, onDelete, onEdit, readOnly = false }) => {
    const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
    const { Icon } = p;

    const dueDate = task.before
        ? new Date(task.before).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        : null;

    const isOverdue = task.before && !task.isDone && new Date(task.before) < new Date();

    const CategoryIcon = task.categoryId ? ICON_MAP[task.categoryId.icon] : null;

    return (
        <div className={`bg-white rounded-[2rem] border shadow-sm transition-all group
            ${task.isDone
                ? 'opacity-50 border-main-100'
                : isOverdue
                    ? 'border-red-200 hover:shadow-md hover:shadow-red-100'
                    : 'border-main-100 hover:shadow-md'
            }`}>

            <NavLink to={`/task/${task._id}`} className="block p-5">

                <div className="flex justify-between items-start mb-3">
                    {/* Badge priorité */}
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${p.badge}`}>
                        <Icon size={10} />
                        {p.label}
                    </span>

                    {/* Date limite */}
                    {dueDate && (
                        <span className={`text-[10px] font-bold flex items-center gap-1
                            ${isOverdue ? 'text-red-500' : 'text-main-400'}`}>
                            <Clock size={10} />
                            {dueDate}
                        </span>
                    )}
                </div>

                <h4 className={`font-bold text-main-800 group-hover:text-main-500 transition-colors leading-snug
                    ${task.isDone ? 'line-through text-main-400' : ''}`}>
                    {task.name}
                </h4>

                {task.categoryId && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-main-400 font-medium">
                        {CategoryIcon && <CategoryIcon size={12} />}
                        {task.categoryId.name}
                    </span>
                )}
            </NavLink>

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
                                       hover:bg-main-50 transition-all"
                        >
                            <Pencil size={13} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete(task._id); }}
                            className="px-3 py-2 text-xs font-bold text-red-500 border-2 border-red-100 rounded-xl
                                       hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};