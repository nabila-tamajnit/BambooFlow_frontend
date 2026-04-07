import { NavLink } from "react-router"; // Vérifie bien si c'est 'react-router-dom' ou 'react-router' selon ta version
import { TaskUserSelector } from '../components/TaskUserSelector';
import { LayoutDashboard, CheckCircle2, Leaf, Sparkles } from "lucide-react";

export const TaskHome = () => {
    // Simulation de données pour éviter l'erreur (à remplacer par tes vrais données d'API plus tard)
    const demoTasks = [
        { id: 1, title: "Arroser les jeunes pousses", cat: "Urgent" },
        { id: 2, title: "Nettoyer l'espace de méditation", cat: "Quotidien" }
    ];

    return (
        <main className="p-4 md:p-8 space-y-8">
            {/* Header avec ton logo actuel */}
            <section className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="relative">
                    <img className="w-32 md:w-40 drop-shadow-md" src="/icons/bambooflow_logo.svg" alt="Logo" />
                    <div className="absolute -bottom-2 -right-2 bg-secondary-400 text-white p-2 rounded-full shadow-lg">
                        <Sparkles size={16} />
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-chewy text-main-800">
                        Bamboo<span className="text-main-500">Flow</span>
                    </h1>
                    <p className="text-main-600 mt-1 font-medium">Olala, tu as plein de tâches à faire !</p>
                </div>
            </section>

            {/* Grille Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sélecteur d'utilisateur */}
                <section className="md:col-span-2 bento-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-main-100 rounded-xl text-main-600">
                            <Leaf size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-main-800">Membres de la forêt</h2>
                    </div>
                    <TaskUserSelector />
                </section>

                {/* Widget de progression rapide */}
                <section className="bento-card bg-main-800 text-white border-none shadow-main-200 shadow-xl">
                    <h3 className="text-main-200 font-medium mb-2">Énergie du Panda</h3>
                    <div className="text-4xl font-bold mb-4">75%</div>
                    <div className="w-full bg-main-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-secondary-400 h-full w-[75%]" />
                    </div>
                    <p className="text-xs mt-4 text-main-300 italic">"Encore quelques efforts pour une récolte parfaite !"</p>
                </section>

                {/* Liste des tâches simplifiée */}
                <section className="md:col-span-3 bento-card">
                    <h2 className="text-xl font-bold text-main-800 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-secondary-500" size={24} />
                        Tes missions prioritaires
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {demoTasks.map((task) => (
                            <NavLink 
                                key={task.id} 
                                to={`/task/${task.id}`}
                                className="group p-4 rounded-2xl border border-main-50 bg-main-50/30 hover:bg-white hover:border-secondary-300 hover:shadow-md transition-all"
                            >
                                <span className="text-xs font-bold text-main-400 uppercase tracking-wider">{task.cat}</span>
                                <h4 className="font-bold text-main-800 group-hover:text-secondary-600">{task.title}</h4>
                            </NavLink>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};
