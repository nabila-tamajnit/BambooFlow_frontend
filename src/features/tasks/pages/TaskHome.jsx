// src/features/tasks/pages/TaskHome.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';
import { jwtDecode } from 'jwt-decode';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import taskService from '../../../services/task.service';
import categoryService from '../../../services/category.service';
import { Plus, X, Sprout, CheckCircle2, Clock } from 'lucide-react';

// ── ADMIN désactivé — conservé pour future évolution (tableau de bord équipe) ──
// import userService from '../../../services/user.service';
// import { MemberPanel } from '../components/MemberPanel';
// import { roleAtom } from '../../../atoms/auth.atom';

export const TaskHome = () => {
    const token = useAtomValue(tokenAtom);
    const connectedUserId = token ? jwtDecode(token).id : null;
    const connectedUserName = token ? jwtDecode(token).firstname : '';

    // ── État ─────────────────────────────────────────────────────────────
    const [tasks,      setTasks]      = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading,  setIsLoading]  = useState(true);
    const [globalError, setGlobalError] = useState(null);

    // Formulaire
    const [showForm,   setShowForm]   = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null); // tâche en cours d'édition
    const [formError,  setFormError]  = useState(null);

    // ── Chargement initial ────────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const [fetchedTasks, fetchedCats] = await Promise.all([
                    taskService.getAll(),
                    categoryService.getAll(),
                ]);
                setTasks(fetchedTasks);
                setCategories(fetchedCats);
            } catch (err) {
                console.error(err);
                setGlobalError('Impossible de charger les données. Vérifie que le serveur est lancé.');
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // ── Rechargement des tâches ───────────────────────────────────────────
    const reloadTasks = useCallback(async () => {
        try {
            const freshTasks = await taskService.getAll();
            setTasks(freshTasks);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // ── Statistiques rapides ──────────────────────────────────────────────
    const pendingCount  = tasks.filter(t => !t.isDone).length;
    const doneCount     = tasks.filter(t => t.isDone).length;
    const urgentCount   = tasks.filter(t => !t.isDone && t.priority === 'high').length;
    const overdueCount  = tasks.filter(t =>
        !t.isDone && t.before && new Date(t.before) < new Date()
    ).length;

    // ── Ajout d'une tâche ─────────────────────────────────────────────────
    const handleAddTask = async (formData) => {
        setFormError(null);
        if (!formData.title?.trim()) {
            setFormError('Le nom est obligatoire.');
            return;
        }
        try {
            await taskService.create({
                name:        formData.title.trim(),
                description: formData.description?.trim() || '',
                before:      formData.before || '',
                priority:    formData.priority || 'medium',
                categoryId:  formData.categoryId || undefined,
                isDone:      false,
            });
            setShowForm(false);
            reloadTasks();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Impossible de créer la tâche.');
        }
    };

    // ── Modification d'une tâche ──────────────────────────────────────────
    const handleEditTask = async (taskId, formData) => {
        setFormError(null);
        try {
            await taskService.update(taskId, {
                name:        formData.title?.trim(),
                description: formData.description?.trim() || '',
                before:      formData.before || '',
                priority:    formData.priority || 'medium',
                categoryId:  formData.categoryId || undefined,
            });
            setTaskToEdit(null);
            setShowForm(false);
            reloadTasks();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Impossible de modifier la tâche.');
        }
    };

    // ── Compléter ─────────────────────────────────────────────────────────
    const handleComplete = useCallback(async (taskId) => {
        try {
            await taskService.updateStatus(taskId, true);
            reloadTasks();
        } catch (err) {
            console.error(err);
        }
    }, [reloadTasks]);

    // ── Supprimer ─────────────────────────────────────────────────────────
    const handleDelete = useCallback(async (taskId) => {
        if (!window.confirm('Supprimer cette pousse définitivement ?')) return;
        try {
            await taskService.delete(taskId);
            reloadTasks();
        } catch (err) {
            console.error(err);
        }
    }, [reloadTasks]);

    // ── Ouvrir formulaire d'édition ───────────────────────────────────────
    const handleOpenEdit = useCallback((task) => {
        setTaskToEdit(task);
        setShowForm(true);
        setFormError(null);
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // ── Fermer formulaire ─────────────────────────────────────────────────
    const handleCloseForm = () => {
        setShowForm(false);
        setTaskToEdit(null);
        setFormError(null);
    };

    return (
        <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">

            {/* ── Header ──────────────────────────────────────────────── */}
            <section className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="flex items-center gap-5">
                    <img className="w-20 md:w-24" src="/images/panda_hello.svg" alt="Logo" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-chewy text-main-800">
                            Bonjour {connectedUserName || '...'} 🌿
                        </h1>
                        <p className="text-main-500 text-sm italic mt-0.5">
                            Voici ta forêt du jour.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (showForm) { handleCloseForm(); }
                        else { setShowForm(true); setTaskToEdit(null); }
                    }}
                    className={`btn flex items-center gap-2 ${showForm ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}`}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Annuler' : 'Planter une pousse'}
                </button>
            </section>

            {/* ── Stats rapides ────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<Sprout size={20} className="text-main-500" />}
                    label="En cours" value={pendingCount} color="bg-main-50 border-main-200" />
                <StatCard icon={<CheckCircle2 size={20} className="text-emerald-500" />}
                    label="Terminées" value={doneCount} color="bg-emerald-50 border-emerald-200" />
                <StatCard icon={<span className="text-lg">🔥</span>}
                    label="Urgentes" value={urgentCount} color="bg-red-50 border-red-200" />
                <StatCard icon={<Clock size={20} className="text-amber-500" />}
                    label="En retard" value={overdueCount} color="bg-amber-50 border-amber-200" />
            </div>

            {/* ── Erreur globale ───────────────────────────────────────── */}
            {globalError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                    ⚠️ {globalError}
                </div>
            )}

            {/* ── Formulaire (ajout ou édition) ────────────────────────── */}
            {showForm && (
                <div>
                    {formError && (
                        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm">
                            {formError}
                        </div>
                    )}
                    <TaskAddForm
                        categories={categories}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        taskToEdit={taskToEdit}
                        onCancel={handleCloseForm}
                    />
                </div>
            )}

            {/* ── Liste des tâches ─────────────────────────────────────── */}
            <section className="bg-white rounded-[2rem] border-2 border-main-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-chewy text-main-800">Mes pousses</h2>
                    <span className="bg-main-100 text-main-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {pendingCount} en cours
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="w-10 h-10 border-4 border-main-200 border-t-main-600 rounded-full animate-spin" />
                        <p className="text-main-400 italic">Chargement des pousses...</p>
                    </div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onEdit={handleOpenEdit}
                    />
                )}
            </section>

            {/* ── ADMIN désactivé — conservé pour future évolution ──────────────────
            Logique de gestion d'équipe : voir les tâches des membres, les assigner, etc.

            const [allUsers, setAllUsers] = useState([]);
            const [selectedMember, setSelectedMember] = useState(null);
            const [memberTasks, setMemberTasks] = useState([]);
            const isAdmin = role === 'Admin';

            {isAdmin && (
                <aside>
                    <TaskUserSelector
                        allUsers={allUsers}
                        connectedUserId={connectedUserId}
                        onUserSelected={(user) => { ... }}
                    />
                    <MemberPanel
                        user={selectedMember}
                        tasks={memberTasks}
                        onClose={() => setSelectedMember(null)}
                    />
                </aside>
            )}
            ────────────────────────────────────────────────────────────────────── */}

        </main>
    );
};

// ── Composant statistique ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${color}`}>
            <div className="shrink-0">{icon}</div>
            <div>
                <p className="text-2xl font-chewy text-main-800 leading-none">{value}</p>
                <p className="text-xs text-main-400 font-medium mt-0.5">{label}</p>
            </div>
        </div>
    );
}