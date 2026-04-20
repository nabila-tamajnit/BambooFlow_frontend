import { TaskItem } from './TaskItem';
import { Sprout, Sparkles, CheckCircle2, Send } from 'lucide-react';

export const TaskList = ({
    tasks = [],
    connectedUserId,
    userRole,
    readOnly = false,
    onComplete,
    onDelete,
    groupBy = false,
}) => {
    const cleanTasks = Array.isArray(tasks)
        ? tasks
        : (tasks?.tasksToDo
            ? [...(tasks.tasksToDo || []), ...(tasks.tasksGiven || [])]
            : []);

    if (cleanTasks.length === 0) {
        return (
            <div className="p-10 text-center text-main-400 italic">
                Aucune pousse trouvée. 🌱
            </div>
        );
    }

    if (groupBy) {
        const done = cleanTasks.filter(t => t.isDone);

        // Tâches assignées par quelqu'un d'autre (admin ou autre user)
        const assignedByOther = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId !== connectedUserId && toId === connectedUserId;
        });

        // Mes propres tâches (je me les suis assignées)
        const myOwnTasks = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId === connectedUserId && toId === connectedUserId;
        });

        // Tâches plantées pour les autres
        const plantedForOthers = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId === connectedUserId && toId !== connectedUserId;
        });

        return (
            <div className="space-y-8">

                {/* Assignées par l'admin / quelqu'un d'autre */}
                {assignedByOther.length > 0 && (
                    <div className="bg-secondary-50 rounded-2xl p-4 border border-secondary-200">
                        <h3 className="text-sm font-bold text-secondary-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles size={14} className="text-secondary-500" />
                            Assignées par l'admin
                            <span className="bg-secondary-100 text-secondary-700 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                {assignedByOther.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assignedByOther.map(task => (
                                <TaskItem key={task._id} task={task}
                                    connectedUserId={connectedUserId} userRole={userRole}
                                    readOnly={readOnly} onComplete={onComplete} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Mes propres tâches */}
                {myOwnTasks.length > 0 && (
                    <div className="bg-main-50 rounded-2xl p-4 border border-main-200">
                        <h3 className="text-sm font-bold text-main-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sprout size={14} className="text-main-500" />
                            Mes propres tâches
                            <span className="bg-main-100 text-main-600 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                {myOwnTasks.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myOwnTasks.map(task => (
                                <TaskItem key={task._id} task={task}
                                    connectedUserId={connectedUserId} userRole={userRole}
                                    readOnly={readOnly} onComplete={onComplete} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Plantées pour les autres */}
                {plantedForOthers.length > 0 && (
                    <div className="bg-main-50/50 rounded-2xl p-4 border border-main-100">
                        <h3 className="text-sm font-bold text-main-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Send size={14} className="text-main-400" />
                            Plantées pour d'autres
                            <span className="bg-main-100 text-main-500 text-[10px] px-2 py-0.5 rounded-full ml-1">
                                {plantedForOthers.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plantedForOthers.map(task => (
                                <TaskItem key={task._id} task={task}
                                    connectedUserId={connectedUserId} userRole={userRole}
                                    readOnly={readOnly} onComplete={onComplete} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Terminées — grisées */}
                {done.length > 0 && (
                    <div className="opacity-60">
                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            Récoltées
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
                                {done.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {done.map(task => (
                                <TaskItem key={task._id} task={task}
                                    connectedUserId={connectedUserId} userRole={userRole}
                                    readOnly={readOnly} onComplete={onComplete} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cleanTasks.map(task => (
                <TaskItem key={task._id} task={task}
                    connectedUserId={connectedUserId} userRole={userRole}
                    readOnly={readOnly} onComplete={onComplete} onDelete={onDelete} />
            ))}
        </div>
    );
};