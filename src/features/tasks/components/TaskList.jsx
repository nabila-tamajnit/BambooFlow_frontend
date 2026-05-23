import { TaskItem } from './TaskItem';
import { Flame, Zap, Leaf, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
    { key: 'high', label: 'Urgent', Icon: Flame, colorClass: 'text-red-600', bgClass: 'bg-red-50 border-red-200' },
    { key: 'medium', label: 'Priorité moyenne', Icon: Zap, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-200' },
    { key: 'low',    label: 'Faible priorité', Icon: Leaf, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-200' },
];

export const TaskList = ({ tasks = [], onComplete, onDelete, onEdit, readOnly = false }) => {
    if (tasks.length === 0) {
        return (
            <div className="p-12 text-center text-main-400 italic">
                <p className="text-lg">Aucune pousse pour le moment. 🌱</p>
                <p className="text-sm mt-1 text-main-300">Plante ta première tâche !</p>
            </div>
        );
    }

    const pending = tasks.filter(t => !t.isDone);
    const done    = tasks.filter(t =>  t.isDone);

    return (
        <div className="space-y-6">
            {SECTIONS.map(({ key, label, Icon, colorClass, bgClass }) => {
                const sectionTasks = pending.filter(t => (t.priority || 'medium') === key);
                if (sectionTasks.length === 0) return null;

                return (
                    <div key={key} className={`rounded-2xl p-4 border ${bgClass}`}>
                        <h3 className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2 ${colorClass}`}>
                            <Icon size={13} />
                            {label}
                            <span className="bg-white/70 text-current text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {sectionTasks.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sectionTasks.map(task => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    onComplete={onComplete}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    readOnly={readOnly}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {done.length > 0 && (
                <div className="opacity-60">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle2 size={13} />
                        Terminées
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                            {done.length}
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {done.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onDelete={onDelete}
                                readOnly={readOnly}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};