// src/features/tasks/components/TaskList.jsx
import { TaskItem } from './TaskItem';
import { Flame, Zap, Leaf, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
    {
        key: 'high',
        label: 'Urgent',
        icon: Flame,
        colorClass: 'text-red-500',
        bgClass: 'bg-red-50 border-red-200',
        emptyMsg: null,
    },
    {
        key: 'medium',
        label: 'Priorité moyenne',
        icon: Zap,
        colorClass: 'text-amber-500',
        bgClass: 'bg-amber-50 border-amber-200',
        emptyMsg: null,
    },
    {
        key: 'low',
        label: 'Faible priorité',
        icon: Leaf,
        colorClass: 'text-emerald-500',
        bgClass: 'bg-emerald-50 border-emerald-200',
        emptyMsg: null,
    },
];

export const TaskList = ({ tasks = [], onComplete, onDelete, onEdit }) => {
    if (tasks.length === 0) {
        return (
            <div className="p-12 text-center text-main-400 italic">
                <p className="text-lg">Aucune pousse pour le moment. 🌱</p>
                <p className="text-sm mt-1 text-main-300">Plante ta première tâche !</p>
            </div>
        );
    }

    const pending = tasks.filter(t => !t.isDone);
    const done    = tasks.filter(t => t.isDone);

    return (
        <div className="space-y-8">

            {/* Sections par priorité */}
            {SECTIONS.map(({ key, label, icon: Icon, colorClass, bgClass }) => {
                const sectionTasks = pending.filter(t => (t.priority || 'medium') === key);
                if (sectionTasks.length === 0) return null;

                return (
                    <div key={key} className={`rounded-2xl p-4 border ${bgClass}`}>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${colorClass}`}>
                            <Icon size={14} />
                            {label}
                            <span className="bg-white/70 text-current text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">
                                {sectionTasks.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sectionTasks.map(task => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    onComplete={onComplete}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Tâches terminées */}
            {done.length > 0 && (
                <div className="opacity-60">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        Terminées
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
                            {done.length}
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {done.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};