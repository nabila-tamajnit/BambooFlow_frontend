// src/features/tasks/pages/TaskHome.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { userProfileAtom } from '../../../atoms/user.atom';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import { CategorySidebar } from '../components/CategorySidebar';
import { CategoryModal } from '../components/CategoryModal';
import taskService from '../../../services/task.service';
import categoryService from '../../../services/category.service';
import { Plus, X, Sprout, CheckCircle2, Clock, AlertTriangle, LayoutGrid, Flame } from 'lucide-react';
import { ICON_MAP } from '../utils/categoryIcons';

export const TaskHome = () => {
    const profile = useAtomValue(userProfileAtom);
    const connectedUserName = profile?.firstname || '';

    // ── Données ───────────────────────────────────────────────────────────
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [preselectedCategoryId, setPreselectedCategoryId] = useState(null);

    // ── Filtres ───────────────────────────────────────────────────────────
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // ── Formulaire tâche ──────────────────────────────────────────────────
    const [showForm, setShowForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [formError, setFormError] = useState(null);

    // ── Modal catégorie ───────────────────────────────────────────────────
    const [showCatModal, setShowCatModal] = useState(false);
    const [catToEdit, setCatToEdit] = useState(null);

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

    // ── Rechargement ──────────────────────────────────────────────────────
    const reloadTasks = useCallback(async () => {
        try { setTasks(await taskService.getAll()); }
        catch (err) { console.error(err); }
    }, []);

    const reloadCategories = useCallback(async () => {
        try { setCategories(await categoryService.getAll()); }
        catch (err) { console.error(err); }
    }, []);

    // ── Filtrage des tâches ───────────────────────────────────────────────
    const filteredTasks = selectedCategoryId
        ? tasks.filter(t => t.categoryId?._id === selectedCategoryId || t.categoryId === selectedCategoryId)
        : tasks;

    const selectedCategory = categories.find(c => c._id === selectedCategoryId);

    // ── Stats ─────────────────────────────────────────────────────────────
    const pendingCount = filteredTasks.filter(t => !t.isDone).length;
    const doneCount = filteredTasks.filter(t => t.isDone).length;
    const urgentCount = filteredTasks.filter(t => !t.isDone && t.priority === 'high').length;
    const overdueCount = filteredTasks.filter(t =>
        !t.isDone && t.before && new Date(t.before) < new Date()
    ).length;

    // ── CRUD Tâches ───────────────────────────────────────────────────────

    const handleAddTask = async (data) => {
        setFormError(null);
        if (!data.title?.trim()) { setFormError('Le nom est obligatoire.'); return; }
        try {
            await taskService.create({
                name: data.title.trim(),
                description: data.description?.trim() || '',
                before: data.before || '',
                priority: data.priority || 'medium',
                categoryId: data.categoryId || undefined,
            });
            setShowForm(false);
            reloadTasks();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Impossible de créer la tâche.');
        }
    };

    const handleEditTask = async (taskId, data) => {
        setFormError(null);
        try {
            await taskService.update(taskId, {
                name: data.title?.trim(),
                description: data.description?.trim() || '',
                before: data.before || '',
                priority: data.priority || 'medium',
                categoryId: data.categoryId || undefined,
            });
            setTaskToEdit(null);
            setShowForm(false);
            reloadTasks();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Impossible de modifier la tâche.');
        }
    };

    const handleComplete = useCallback(async (taskId) => {
        try { await taskService.updateStatus(taskId, true); reloadTasks(); }
        catch (err) { console.error(err); }
    }, [reloadTasks]);

    const handleDelete = useCallback(async (taskId) => {
        if (!window.confirm('Supprimer cette pousse définitivement ?')) return;
        try { await taskService.delete(taskId); reloadTasks(); }
        catch (err) { console.error(err); }
    }, [reloadTasks]);

    const handleOpenEdit = useCallback((task) => {
        setTaskToEdit(task);
        setShowForm(true);
        setFormError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCloseForm = () => {
        setShowForm(false);
        setTaskToEdit(null);
        setFormError(null);
        setPreselectedCategoryId(null);
    };

    // ── CRUD Catégories ───────────────────────────────────────────────────
    const handleCatCreated = (cat, isEdit) => {
        if (isEdit) {
            setCategories(prev => prev.map(c => c._id === cat._id ? cat : c));
        } else {
            setCategories(prev => [...prev, cat]);
        }
    };

    const handleDeleteCat = async (cat) => {
        if (!window.confirm(`Supprimer la catégorie "${cat.name}" ? Les tâches liées ne seront pas supprimées.`)) return;
        try {
            await categoryService.delete(cat._id);
            setCategories(prev => prev.filter(c => c._id !== cat._id));
            if (selectedCategoryId === cat._id) setSelectedCategoryId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Impossible de supprimer.');
        }
    };

    const CategoryIcon = selectedCategory
    ? ICON_MAP[selectedCategory.icon]
    : null;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

            {/* ── Header ──────────────────────────────────────────────── */}
            <section className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <img className="w-16 md:w-20" src="/images/panda_hello.svg" alt="Panda" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-chewy text-main-800">
                            Bonjour {connectedUserName || '...'} 🌿
                        </h1>
                        <p className="text-main-400 text-sm italic mt-0.5">Voici ta forêt du jour.</p>
                    </div>
                </div>
                <button
                    onClick={() => showForm ? handleCloseForm() : (() => { setPreselectedCategoryId(null); setShowForm(true); })()}
                    className={`btn flex items-center gap-2 ${showForm ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}`}
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Annuler' : 'Planter une pousse'}
                </button>
            </section>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={<Sprout size={18} className="text-main-500" />} label="En cours" value={pendingCount} color="bg-main-50 border-main-200" />
                <StatCard icon={<CheckCircle2 size={18} className="text-emerald-500" />} label="Terminées" value={doneCount} color="bg-emerald-50 border-emerald-200" />
                <StatCard icon={<Flame size={18} className="text-red-500" />} label="Urgentes" value={urgentCount} color="bg-red-50 border-red-200" />
                <StatCard icon={<Clock size={18} className="text-amber-500" />} label="En retard" value={overdueCount} color="bg-amber-50 border-amber-200" />
            </div>

            {globalError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                    {<AlertTriangle size={18} className="text-amber-300" />} {globalError}
                </div>
            )}

            {/* ── Formulaire tâche ─────────────────────────────────────── */}
            {showForm && (
                <div>
                    {formError && (
                        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm">{formError}</div>
                    )}
                    <TaskAddForm
                        categories={categories}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        taskToEdit={taskToEdit}
                        onCancel={handleCloseForm}
                        onCategoryCreated={(cat) => setCategories(prev => [...prev, cat])}
                        preselectedCategoryId={preselectedCategoryId}
                    />
                </div>
            )}

            {/* ── Layout sidebar + contenu ──────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-6 items-start">

                {/* Sidebar */}
                <CategorySidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelect={setSelectedCategoryId}
                    onAdd={() => { setCatToEdit(null); setShowCatModal(true); }}
                    onEdit={(cat) => { setCatToEdit(cat); setShowCatModal(true); }}
                    onDelete={handleDeleteCat}
                />

                {/* ── Liste des tâches ─────────────────────────────────────── */}
                <section className="flex-1 w-full bg-white rounded-[2rem] border-2 border-main-200 shadow-sm p-6 min-w-0">
                    <div className="flex items-center gap-3 mb-6">
                        {selectedCategory ? (
                            <>
                                <span className="text-2xl">{CategoryIcon && <CategoryIcon size={22} />}</span>
                                <h2 className="text-2xl font-chewy text-main-800 flex-1">{selectedCategory.name}</h2>
                            </>
                        ) : (
                            <>
                                <LayoutGrid size={22} className="text-main-400" />
                                <h2 className="text-2xl font-chewy text-main-800 flex-1">Toutes mes pousses</h2>
                            </>
                        )}
                        <span className="bg-main-100 text-main-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
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
                            tasks={filteredTasks}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            onEdit={handleOpenEdit}
                        />
                    )}
                </section>
            </div>

            {/* ── Modal catégorie ───────────────────────────────────────── */}
            {showCatModal && (
                <CategoryModal
                    editCategory={catToEdit}
                    onClose={() => { setShowCatModal(false); setCatToEdit(null); }}
                    onCreated={handleCatCreated}
                />
            )}
        </div>
    );
};

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