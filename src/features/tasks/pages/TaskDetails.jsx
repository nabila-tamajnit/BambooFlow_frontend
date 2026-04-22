// src/features/tasks/pages/TaskDetails.jsx
import { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router';
import taskService from '../../../services/task.service';
import { TaskAddForm } from '../components/TaskAddForm';
import categoryService from '../../../services/category.service';
import { ArrowLeft, Calendar, CheckCircle, Trash2, Pencil } from 'lucide-react';

const PRIORITY_STYLES = {
    high:   { label: 'Urgent',  icon: '🔥', badge: 'bg-red-50 text-red-700 border-red-200' },
    medium: { label: 'Moyen',   icon: '⚡', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    low:    { label: 'Faible',  icon: '🌿', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask]             = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState(null);
    const [isEditing, setIsEditing]   = useState(false);
    const [completing, setCompleting] = useState(false);
    const [deleting, setDeleting]     = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [taskData, cats] = await Promise.all([
                    taskService.getById(id),
                    categoryService.getAll(),
                ]);
                setTask(taskData);
                setCategories(cats);
            } catch (err) {
                if (err.response?.status === 404) setError('Cette pousse n\'existe pas.');
                else if (err.response?.status === 403) setError('Accès refusé.');
                else setError('Impossible de charger cette pousse.');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await taskService.updateStatus(task._id, true);
            setTask(prev => ({ ...prev, isDone: true }));
        } finally {
            setCompleting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Supprimer définitivement ?')) return;
        setDeleting(true);
        try {
            await taskService.delete(task._id);
            navigate('/tasks');
        } catch {
            setDeleting(false);
        }
    };

    const handleEdit = async (taskId, formData) => {
        try {
            const updated = await taskService.update(taskId, {
                name:        formData.title?.trim(),
                description: formData.description?.trim() || '',
                before:      formData.before || '',
                priority:    formData.priority || 'medium',
                categoryId:  formData.categoryId || undefined,
            });
            setTask(updated);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-main-200 border-t-main-600 rounded-full animate-spin" />
        </div>
    );

    if (error || !task) return (
        <div className="max-w-4xl mx-auto p-12 text-center">
            <p className="text-red-500 font-bold mb-4">{error || 'Pousse introuvable.'}</p>
            <NavLink to="/tasks" className="text-main-600 font-bold hover:underline flex items-center gap-2 justify-center">
                <ArrowLeft size={18} /> Retour
            </NavLink>
        </div>
    );

    const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

    return (
        <main className="max-w-3xl mx-auto p-6 lg:p-12">
            <NavLink to="/tasks" className="flex items-center gap-2 text-main-500 hover:text-main-800 font-bold mb-8 group w-fit">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Retour
            </NavLink>

            {isEditing ? (
                <TaskAddForm
                    categories={categories}
                    taskToEdit={task}
                    onEditTask={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-main-100">

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full border flex items-center gap-1 ${p.badge}`}>
                            {p.icon} {p.label}
                        </span>
                        {task.isDone && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                ✓ Terminée
                            </span>
                        )}
                        {task.categoryId && (
                            <span className="bg-main-50 text-main-600 border border-main-200 text-[10px] uppercase font-black px-4 py-1.5 rounded-full">
                                {task.categoryId.icon} {task.categoryId.name}
                            </span>
                        )}
                    </div>

                    {/* Titre */}
                    <h1 className={`text-4xl font-chewy text-main-800 mb-4 ${task.isDone ? 'line-through opacity-60' : ''}`}>
                        {task.name}
                    </h1>

                    {/* Description */}
                    {task.description ? (
                        <div className="bg-main-50/50 p-5 rounded-2xl border border-main-100 mb-8">
                            <p className="text-main-700 leading-relaxed italic">"{task.description}"</p>
                        </div>
                    ) : (
                        <div className="bg-main-50/30 p-4 rounded-2xl border border-dashed border-main-200 mb-8">
                            <p className="text-main-300 text-sm italic text-center">Aucune description.</p>
                        </div>
                    )}

                    {/* Date limite */}
                    {task.before && (
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white shadow-sm border border-main-100 rounded-2xl text-main-600">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-main-400">Date limite</p>
                                <p className="font-bold text-main-800">
                                    {new Date(task.before).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {!task.isDone && (
                            <button onClick={handleComplete} disabled={completing}
                                className="flex-1 btn py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-60">
                                {completing ? '...' : <><CheckCircle size={20} /> Terminer</>}
                            </button>
                        )}
                        {!task.isDone && (
                            <button onClick={() => setIsEditing(true)}
                                className="px-6 py-4 rounded-2xl font-bold text-main-600 border-2 border-main-200 hover:bg-main-50 transition-all flex items-center gap-2">
                                <Pencil size={18} /> Modifier
                            </button>
                        )}
                        <button onClick={handleDelete} disabled={deleting}
                            className="px-6 py-4 rounded-2xl font-bold text-red-500 border-2 border-red-100 hover:bg-red-50 transition-all flex items-center gap-2 disabled:opacity-60">
                            <Trash2 size={18} />
                            {deleting ? '...' : 'Supprimer'}
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
};