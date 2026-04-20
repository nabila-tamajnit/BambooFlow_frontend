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

        // Tâches assignées par l'admin (fromUserId !== moi ET toUserId === moi)
        const assignedByAdmin = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId !== connectedUserId && toId === connectedUserId;
        });

        // Mes propres tâches (fromUserId === moi ET toUserId === moi)
        const myOwnTasks = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId === connectedUserId && toId === connectedUserId;
        });

        // Tâches plantées pour les autres (fromUserId === moi ET toUserId !== moi)
        const plantedForOthers = cleanTasks.filter(t => {
            const fromId = t.fromUserId?._id ?? t.fromUserId;
            const toId = t.toUserId?._id ?? t.toUserId;
            return !t.isDone && fromId === connectedUserId && toId !== connectedUserId;
        });

        const SectionHeader = ({ emoji, label, count, colorClass = 'text-main-500', bgClass = 'bg-main-100', textClass = 'text-main-600' }) => (
            <h3 className={`text-sm font-bold ${colorClass} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                {emoji} {label}
                <span className={`${bgClass} ${textClass} text-[10px] px-2 py-0.5 rounded-full`}>
                    {count}
                </span>
            </h3>
        );

        return (
            <div className="space-y-8">

                {/* 🌱 Tâches assignées par l'admin */}
                {assignedByAdmin.length > 0 && (
                    <div className="bg-secondary-50 rounded-2xl p-4 border border-secondary-200">
                        <SectionHeader
                            emoji="🌱"
                            label="Ajoutées par l'admin"
                            count={assignedByAdmin.length}
                            colorClass="text-secondary-600"
                            bgClass="bg-secondary-100"
                            textClass="text-secondary-700"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assignedByAdmin.map(task => (
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

                {/* 🌿 Mes propres tâches */}
                {myOwnTasks.length > 0 && (
                    <div className="bg-main-50 rounded-2xl p-4 border border-main-200">
                        <SectionHeader
                            emoji="🌿"
                            label="Mes propres tâches"
                            count={myOwnTasks.length}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myOwnTasks.map(task => (
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

                {/* Tâches plantées pour les autres (visible surtout pour l'admin) */}
                {plantedForOthers.length > 0 && (
                    <div className="bg-main-50/50 rounded-2xl p-4 border border-main-100">
                        <SectionHeader
                            emoji="📤"
                            label="Plantées pour d'autres"
                            count={plantedForOthers.length}
                            colorClass="text-main-400"
                            bgClass="bg-main-100"
                            textClass="text-main-500"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plantedForOthers.map(task => (
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

                {/* ✅ Tâches terminées — grisées */}
                {done.length > 0 && (
                    <div className="opacity-70">
                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            ✅ Récoltées
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

    // ── Mode liste simple (pour le MemberPanel) ────────────────────────────
    return (
        <div className="grid grid-cols-1 gap-4">
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