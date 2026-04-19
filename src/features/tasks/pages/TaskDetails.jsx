import { useEffect, useState } from 'react';
import { NavLink, useParams } from "react-router"; // Garde ton import habituel
import taskService from '../../../services/task.service';
import { ArrowLeft, Calendar, User, Tag, CheckCircle, Sprout } from "lucide-react";

export const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isOwner = task.toUserId?._id === connectedUserId;
    const canEdit = isOwner || role === 'Admin';



    const colorMap = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200"
    };

    useEffect(() => {
        setIsLoading(true);

        taskService.getById(id)
            // IL MANQUAIT LE MOT "data" ICI ENTRE LES PARENTHÈSES
            .then((data) => {
                console.log("Détails de la pousse reçus :", data);
                setTask(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [id]);



    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-main-200 border-t-main-600 rounded-full animate-spin"></div>
                <p className="font-chewy text-main-600 text-xl tracking-wide">Analyse de la pousse...</p>
            </div>
        );
    }

    if (!task) {
        return <p className="text-center p-20 font-bold text-red-500">Oups ! Cette pousse a disparu de la forêt. 🦆</p>;
    }

    // On récupère la couleur (ex: "red") et on applique le style
    const activeStyle = colorMap[task.categoryId?.color] || colorMap.green;
    console.log("Date :", task.before);

    return (
        <main className="max-w-4xl mx-auto p-6 lg:p-12">
            {/* Lien de retour stylisé */}
            <NavLink
                className="flex items-center gap-2 text-main-500 hover:text-main-800 font-bold mb-8 transition-colors group"
                to="/tasks"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Revenir à la forêt
            </NavLink>

            <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-main-100 relative overflow-hidden">

                {/* ILLUSTRATION IA : "Panda jardinier avec une loupe" 
                    Position : Haut droit de la carte, très discret */}
                <div className="absolute -top-6 -right-6 w-44 opacity-5 rotate-12 pointer-events-none">
                    <img src="/icons/bambooflow_logo.svg" alt="Panda Inspecteur" />
                </div>

                <div className="relative">
                    {/* Badge de catégorie dynamique */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-main-100 text-main-700 text-[10px] uppercase font-black px-4 py-1.5 rounded-full border border-main-200 tracking-widest">
                            Fiche de Mission
                        </span>
                        <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border ${activeStyle}`}>
                            Priorité : {task.categoryId?.priority || "Normale"}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-chewy text-main-800 mb-6">{task.name}</h1>

                    <div className="bg-main-50/50 p-6 rounded-2xl border border-main-100 mb-10">
                        <p className="text-main-700 leading-relaxed text-lg italic">
                            "{task.description || "Aucune consigne particulière pour cette pousse. Elle a juste besoin d'attention !"}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-main-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Date de récolte</p>
                                <p className="font-bold text-main-800">
                                    {task.before ?
                                        new Date(task.before.split('-').reverse().join('-')).toLocaleDateString('fr-FR')
                                        : "Dès que possible"}
                                </p>

                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-secondary-500">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Gardien assigné</p>
                                <p className="font-bold text-main-800">
                                    {task.toUserId ? `${task.toUserId.firstname} ${task.toUserId.lastname}` : "Forêt libre"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bouton d'action pro */}
                    {canEdit && (
                        <button className="btn w-full py-5 text-xl flex items-center justify-center gap-4 group">
                            Récolter le bambou
                            <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </section>
        </main>
    );
};
