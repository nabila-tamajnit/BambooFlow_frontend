import { NavLink } from "react-router";

export const TaskItem = ({ task }) => {
    const category = task.categoryId;
    
    // On définit les classes Tailwind correspondantes aux couleurs de ta DB
    const colorMap = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200"
    };

    // On récupère la couleur (ex: "red") et on applique le style
    const activeStyle = colorMap[category?.color] || colorMap.green;

    return (
        <NavLink to={`/task/${task._id}`} className="bg-white p-6 rounded-[2rem] border border-main-100 shadow-sm block hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${activeStyle}`}>
                    {category?.name || "Bambou"} • {category?.priority || "Normal"}
                </span>
            </div>
            
            <h4 className="text-lg font-bold text-main-800 group-hover:text-main-500 transition-colors">
                {task.name}
            </h4>
            
            <div className="mt-4 flex justify-between items-center text-[10px] text-main-400 font-bold uppercase tracking-wider">
                <span>De : {task.fromUserId?.firstname}</span>
                <span>Pour : {task.toUserId?.firstname}</span>
            </div>
        </NavLink>
    );
};
