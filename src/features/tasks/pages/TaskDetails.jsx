import { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { tokenAtom, roleAtom } from '../../../atoms/auth.atom';
import { jwtDecode } from 'jwt-decode';
import taskService from '../../../services/task.service';
import { ArrowLeft, Calendar, User, CheckCircle, Tag, Trash2 } from 'lucide-react';

const colorMap = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
};

export const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAtomValue(tokenAtom);
    const role = useAtomValue(roleAtom);
    const connectedUserId = token ? jwtDecode(token).id : null;

    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completing, setCompleting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!id || id === 'undefined') {
            setError('Identifiant de tâche manquant.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        taskService.getById(id)
            .then(data => {
                if (!data) { setError('Tâche introuvable.'); return; }
                setTask(data);
            })
            .catch(err => {
                if (err.response?.status === 404) setError('Cette pousse n\'existe pas.');
                else if (err.response?.status === 401) setError('Session expirée, reconnectez-vous.');
                else setError('Impossible de charger cette pousse.');
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-main-200 border-t-main-600 rounded-full animate-spin" />
                <p className="font-chewy text-main-600 text-xl">Analyse de la pousse...</p>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center">
                <p className="text-red-500 font-bold text-lg mb-4">
                    {error || 'Cette pousse a disparu. 🦆'}
                </p>
                <NavLink to="/tasks" className="inline-flex items-center gap-2 text-main-600 font-bold hover:underline">
                    <ArrowLeft size={18} /> Revenir à la forêt
                </NavLink>
            </div>
        );
    }

    // ── Permissions (calculées APRÈS le chargement de task) ──────────────
    const isAdmin = role === 'Admin';
    const toId = task.toUserId?._id ?? task.toUserId;
    const fromId = task.fromUserId?._id ?? task.fromUserId;

    const isAssignedToMe = toId === connectedUserId;
    const isPlantedByMe = fromId === connectedUserId;

    // Peut récolter : assignée à moi ET pas encore faite
    const canComplete = !task.isDone && isAssignedToMe;

    // Peut supprimer :
    //   - Admin toujours
    //   - J'ai planté la tâche
    //   - La tâche m'est assignée ET elle est terminée
    const canDelete = isAdmin || isPlantedByMe || (isAssignedToMe && task.isDone);

    const activeStyle = colorMap[task.categoryId?.color] || colorMap.green;

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await taskService.updateStatus(task._id, true);
            setTask(prev => ({ ...prev, isDone: true }));
        } catch (err) {
            console.error(err);
        } finally {
            setCompleting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Supprimer cette pousse définitivement ?')) return;
        setDeleting(true);
        try {
            await taskService.delete(task._id);
            navigate('/tasks');
        } catch (err) {
            console.error(err);
            setDeleting(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto p-6 lg:p-12">

            <NavLink
                className="flex items-center gap-2 text-main-500 hover:text-main-800 font-bold mb-8 transition-colors group w-fit"
                to="/tasks"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Revenir à la forêt
            </NavLink>

            <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-main-100 relative overflow-hidden">

                <div className="absolute -top-6 -right-6 w-44 opacity-5 rotate-12 pointer-events-none">
                    <img src="/icons/bambooflow_logo.svg" alt="" />
                </div>

                <div className="relative">

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="bg-main-100 text-main-700 text-[10px] uppercase font-black px-4 py-1.5 rounded-full border border-main-200 tracking-widest">
                            Fiche de Mission
                        </span>
                        {task.categoryId && (
                            <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border flex items-center gap-1 ${activeStyle}`}>
                                <Tag size={10} />
                                {task.categoryId.name} · {task.categoryId.priority || 'Normale'}
                            </span>
                        )}
                        {task.isDone && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                ✓ Récoltée
                            </span>
                        )}
                        {!isAssignedToMe && !isAdmin && (
                            <span className="bg-main-50 text-main-400 border border-main-100 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                Lecture seule
                            </span>
                        )}
                    </div>

                    {/* Titre */}
                    <h1 className="text-4xl md:text-5xl font-chewy text-main-800 mb-6">
                        {task.name}
                    </h1>

                    {/* Description */}
                    {task.description ? (
                        <div className="bg-main-50/50 p-6 rounded-2xl border border-main-100 mb-10">
                            <p className="text-main-700 leading-relaxed text-lg italic">"{task.description}"</p>
                        </div>
                    ) : (
                        <div className="bg-main-50/30 p-4 rounded-2xl border border-dashed border-main-200 mb-10">
                            <p className="text-main-300 text-sm italic text-center">Aucune description pour cette pousse.</p>
                        </div>
                    )}

                    {/* Infos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-main-600 shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Date de récolte</p>
                                <p className="font-bold text-main-800">
                                    {task.before
                                        ? new Date(task.before.split('-').reverse().join('-'))
                                            .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : 'Dès que possible'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-secondary-500 shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Assignée à</p>
                                <p className="font-bold text-main-800">
                                    {task.toUserId ? `${task.toUserId.firstname} ${task.toUserId.lastname}` : 'Non assignée'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-main-300 shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Plantée par</p>
                                <p className="font-bold text-main-800">
                                    {task.fromUserId ? `${task.fromUserId.firstname} ${task.fromUserId.lastname}` : 'Inconnu'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {canComplete && (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="flex-1 btn py-4 text-lg flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {completing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Récolte en cours...
                                    </>
                                ) : (
                                    <>
                                        Récolter le bambou
                                        <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        )}

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="sm:w-auto px-6 py-4 rounded-2xl font-bold text-red-500 border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <Trash2 size={20} />
                                {deleting ? 'Suppression...' : 'Supprimer'}
                            </button>
                        )}
                    </div>

                    {task.isDone && (
                        <div className="text-center py-4 text-emerald-600 font-bold text-lg flex items-center justify-center gap-2 mt-2">
                            <CheckCircle size={22} />
                            Cette pousse a été récoltée ! 🎋
                        </div>
                    )}

                    {!isAssignedToMe && !isAdmin && !isPlantedByMe && (
                        <p className="text-center text-main-400 text-sm italic mt-4">
                            Vous consultez cette pousse en lecture seule.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
};