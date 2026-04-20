import { TaskItem } from './TaskItem';

/**
 * Props :
 * - tasks          : tableau de tâches
 * - connectedUserId: id du user connecté (transmis à TaskItem pour les permissions)
 * - userRole       : 'Admin' | 'User'
 * - readOnly       : true → aucune action sur les tâches (vue d'un autre membre)
 * - onComplete     : callback(taskId)
 * - onDelete       : callback(taskId)
 * - groupBy        : true → affiche les tâches en 3 groupes (plantées / assignées / terminées)
 */
export const TaskList = ({
    tasks = [],
    connectedUserId,
    userRole,
    readOnly = false,
    onComplete,
    onDelete,
    groupBy = false,
}) => {

    // Normalise l'entrée (tableau direct ou objet wrapper legacy)
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

    // ── Mode groupé (pour "Mes pousses") ──────────────────────────────────
    if (groupBy) {
        const done = cleanTasks.filter(t => t.isDone);
        const plantedByMe = cleanTasks.filter(t =>
            !t.isDone && (t.fromUserId?._id ?? t.fromUserId) === connectedUserId
            && (t.toUserId?._id ?? t.toUserId) !== connectedUserId
        );
        const assignedToMe = cleanTasks.filter(t =>
            !t.isDone && (t.toUserId?._id ?? t.toUserId) === connectedUserId
        );

        return (
            <div className="space-y-8">
                {/* Pousses assignées à moi (priorité max) */}
                {assignedToMe.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-main-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            À récolter
                            <span className="bg-main-100 text-main-600 text-[10px] px-2 py-0.5 rounded-full">
                                {assignedToMe.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assignedToMe.map(task => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    connectedUserId={connectedUserId}
                                    userRole={userRole}
                                    readOnly={readOnly}
                                    onComplete={onComplete}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Pousses que j'ai plantées pour les autres */}
                {plantedByMe.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-main-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            🌱 Pousses que j'ai plantées
                            <span className="bg-main-100 text-main-600 text-[10px] px-2 py-0.5 rounded-full">
                                {plantedByMe.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plantedByMe.map(task => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    connectedUserId={connectedUserId}
                                    userRole={userRole}
                                    readOnly={readOnly}
                                    onComplete={onComplete}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tâches terminées */}
                {done.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            Récoltées
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                                {done.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {done.map(task => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    connectedUserId={connectedUserId}
                                    userRole={userRole}
                                    readOnly={readOnly}
                                    onComplete={onComplete}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Mode liste simple (pour les tâches d'un autre membre) ─────────────
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cleanTasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    connectedUserId={connectedUserId}
                    userRole={userRole}
                    readOnly={readOnly}
                    onComplete={onComplete}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};