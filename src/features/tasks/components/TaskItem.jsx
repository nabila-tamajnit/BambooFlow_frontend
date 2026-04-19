import { NavLink } from "react-router";

/**
 * Affiche une carte de tâche.
 * readOnly : masque les actions
 * canComplete + onComplete : pour le bouton "Récolter"
 */
export const TaskItem = ({ task, readOnly = false, canComplete = false, onComplete }) => {
    const category = task.categoryId;

    const colorMap = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200"
    };

    const activeStyle = colorMap[category?.color] || colorMap.green;

    // Sécurité : si _id est absent, on n'affiche pas un lien cassé
    if (!task._id) {
        console.warn('TaskItem: task._id est undefined', task);
        return null;
    }

    return (
        <div className={`bg-white p-6 rounded-[2rem] border border-main-100 shadow-sm transition-all
            ${task.isDone ? 'opacity-60' : 'hover:shadow-md'}`}>

            <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${activeStyle}`}>
                    {category?.name || 'Sans catégorie'} · {category?.priority || 'Normal'}
                </span>
                {task.isDone && (
                    <span className="text-[10px] uppercase font-black text-emerald-600">
                        ✓ Faite
                    </span>
                )}
            </div>

            <NavLink to={`/task/${task._id}`} className="block group">
                <h4 className="text-lg font-bold text-main-800 group-hover:text-main-500 transition-colors mb-1">
                    {task.name}
                </h4>
                {task.description && (
                    <p className="text-sm text-main-400 line-clamp-2 mb-3">
                        {task.description}
                    </p>
                )}
            </NavLink>

            <div className="mt-4 flex justify-between items-center text-[10px] text-main-400 font-bold uppercase tracking-wider">
                <span>De : {task.fromUserId?.firstname || '?'}</span>
                <span>Pour : {task.toUserId?.firstname || '?'}</span>
            </div>

            {/* Bouton compléter — visible seulement si canComplete et pas encore fait */}
            {canComplete && !task.isDone && onComplete && (
                <button
                    onClick={(e) => { e.preventDefault(); onComplete(task._id); }}
                    className="mt-4 w-full text-xs font-bold text-main-500 border border-main-200 rounded-xl py-2 hover:bg-main-50 transition-colors"
                >
                    ✓ Marquer comme récoltée
                </button>
            )}
        </div>
    );
};