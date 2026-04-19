import { TaskItem } from './TaskItem';

/**
 * readOnly : empêche les actions sur les tâches (lecture seule)
 * canComplete : affiche le bouton "Récolter" sur chaque carte
 * onComplete : callback appelé avec l'id de la tâche à compléter
 */
export const TaskList = ({ tasks, readOnly = false, canComplete = false, onComplete }) => {
    // Normalise l'entrée : accepte un tableau direct ou un objet wrapper legacy
    const cleanTasks = Array.isArray(tasks)
        ? tasks
        : (tasks?.tasksToDo ? [...tasks.tasksToDo, ...(tasks.tasksGiven || [])] : []);

    if (cleanTasks.length === 0) {
        return (
            <div className="p-10 text-center text-main-400 italic">
                Aucune pousse trouvée. 🌱
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cleanTasks.map((task) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    readOnly={readOnly}
                    canComplete={canComplete && !readOnly}
                    onComplete={onComplete}
                />
            ))}
        </div>
    );
};