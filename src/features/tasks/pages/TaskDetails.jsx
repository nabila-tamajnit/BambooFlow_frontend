import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { tokenAtom, roleAtom } from '../../../atoms/auth.atom';
import { jwtDecode } from 'jwt-decode';
import taskService from '../../../services/task.service';
import { ArrowLeft, Calendar, User, CheckCircle, Tag } from 'lucide-react';

const colorMap = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
};

export const TaskDetails = () => {
    // useParams récupère l'id depuis la route /task/:id
    const { id } = useParams();

    const token = useAtomValue(tokenAtom);
    const role = useAtomValue(roleAtom);

    // Décode l'id du user connecté — jamais avant que task soit chargé
    const connectedUserId = token ? jwtDecode(token).id : null;

    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completing, setCompleting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        // Sécurité : si id est undefined la route est mal configurée
        if (!id || id === 'undefined') {
            setError("Identifiant de tâche manquant. Retournez à la liste.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        taskService.getById(id)
            .then((data) => {
                if (!data) {
                    setError('Tâche introuvable.');
                    return;
                }
                setTask(data);
                setCompleted(data.isDone);
            })
            .catch((err) => {
                console.error('Erreur TaskDetails:', err);
                if (err.response?.status === 404) {
                    setError('Cette pousse n\'existe pas ou a été supprimée.');
                } else if (err.response?.status === 401) {
                    setError('Session expirée. Veuillez vous reconnecter.');
                } else {
                    setError('Impossible de charger cette pousse.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    const handleComplete = async () => {
        if (!task?._id) return;
        setCompleting(true);
        try {
            await taskService.updateStatus(task._id, true);
            setCompleted(true);
            setTask(prev => ({ ...prev, isDone: true }));
        } catch (err) {
            console.error('Erreur completion:', err);
        } finally {
            setCompleting(false);
        }
    };

    // ── États de chargement / erreur ────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-12 h-12 border-4 border-main-200 border-t-main-600 rounded-full animate-spin" />
                <p className="font-chewy text-main-600 text-xl tracking-wide">
                    Analyse de la pousse...
                </p>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center">
                <p className="text-red-500 font-bold text-lg mb-4">
                    {error || 'Cette pousse a disparu de la forêt. 🦆'}
                </p>
                <NavLink
                    to="/tasks"
                    className="inline-flex items-center gap-2 text-main-600 font-bold hover:underline"
                >
                    <ArrowLeft size={18} /> Revenir à la forêt
                </NavLink>
            </div>
        );
    }

    // ── Calcul permissions — seulement quand task est chargé ────────────────
    // isOwner : la tâche m'est assignée
    const isOwner = task.toUserId?._id === connectedUserId
        || task.toUserId === connectedUserId; // fallback si non-populé

    // canEdit : je suis propriétaire OU admin
    const canEdit = isOwner || role === 'Admin';

    const activeStyle = colorMap[task.categoryId?.color] || colorMap.green;

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

                {/* Décoration fond */}
                <div className="absolute -top-6 -right-6 w-44 opacity-5 rotate-12 pointer-events-none">
                    <img src="/icons/bambooflow_logo.svg" alt="" />
                </div>

                <div className="relative">

                    {/* ── Badges ─────────────────────────────────────────────── */}
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

                        {(completed || task.isDone) && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                ✓ Récoltée
                            </span>
                        )}

                        {!canEdit && (
                            <span className="bg-main-50 text-main-400 border border-main-100 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                Lecture seule
                            </span>
                        )}
                    </div>

                    {/* ── Titre ──────────────────────────────────────────────── */}
                    <h1 className="text-4xl md:text-5xl font-chewy text-main-800 mb-6">
                        {task.name}
                    </h1>

                    {/* ── Description ────────────────────────────────────────── */}
                    {task.description ? (
                        <div className="bg-main-50/50 p-6 rounded-2xl border border-main-100 mb-10">
                            <p className="text-main-700 leading-relaxed text-lg italic">
                                "{task.description}"
                            </p>
                        </div>
                    ) : (
                        <div className="bg-main-50/30 p-4 rounded-2xl border border-dashed border-main-200 mb-10">
                            <p className="text-main-300 text-sm italic text-center">
                                Aucune description pour cette pousse.
                            </p>
                        </div>
                    )}

                    {/* ── Infos ──────────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-main-600 shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">
                                    Date de récolte
                                </p>
                                <p className="font-bold text-main-800">
                                    {task.before
                                        ? new Date(task.before.split('-').reverse().join('-'))
                                            .toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                        : 'Dès que possible'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-secondary-500 shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">
                                    Assignée à
                                </p>
                                <p className="font-bold text-main-800">
                                    {task.toUserId
                                        ? `${task.toUserId.firstname} ${task.toUserId.lastname}`
                                        : 'Non assignée'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white shadow-sm border border-main-100 rounded-2xl text-main-400 shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">
                                    Plantée par
                                </p>
                                <p className="font-bold text-main-800">
                                    {task.fromUserId
                                        ? `${task.fromUserId.firstname} ${task.fromUserId.lastname}`
                                        : 'Inconnu'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* ── Action ─────────────────────────────────────────────── */}
                    {canEdit && !completed && !task.isDone && (
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className="btn w-full py-5 text-xl flex items-center justify-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {completing ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Récolte en cours...
                                </>
                            ) : (
                                <>
                                    Récolter le bambou
                                    <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    )}

                    {(completed || task.isDone) && (
                        <div className="text-center py-4 text-emerald-600 font-bold text-lg flex items-center justify-center gap-2">
                            <CheckCircle size={24} />
                            Cette pousse a été récoltée ! 🎋
                        </div>
                    )}

                    {!canEdit && (
                        <p className="text-center text-main-400 text-sm italic mt-4">
                            Vous pouvez consulter cette pousse mais pas la modifier.
                        </p>
                    )}

                </div>
            </section>
        </main>
    );
};