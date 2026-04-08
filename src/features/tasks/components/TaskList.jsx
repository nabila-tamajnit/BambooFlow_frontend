import { TaskItem } from './TaskItem';

export const TaskList = ({ tasks }) => {
    // Si c'est l'objet global avec tasksToDo, on extrait la liste
    const cleanTasks = Array.isArray(tasks) 
        ? tasks 
        : (tasks?.tasksToDo ? [...tasks.tasksToDo, ...(tasks.tasksGiven || [])] : []);

    if (cleanTasks.length === 0) {
        return <div className="p-10 text-center text-main-400">Aucune pousse trouvée. 🌱</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cleanTasks.map((task, index) => (
                <TaskItem key={task._id || index} task={task} />
            ))}
        </div>
    );
};

