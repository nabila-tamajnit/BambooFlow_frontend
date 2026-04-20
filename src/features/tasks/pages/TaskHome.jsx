import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, roleAtom } from '../../../atoms/auth.atom';
import { TaskUserSelector } from '../components/TaskUserSelector';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import { MemberPanel } from '../components/MemberPanel';
import taskService from '../../../services/task.service';
import userService from '../../../services/user.service';
import categoryService from '../../../services/category.service';
import { Leaf, Plus, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export const TaskHome = () => {
    const token = useAtomValue(tokenAtom);
    const role = useAtomValue(roleAtom);
    const connectedUserId = token ? jwtDecode(token).id : null;

    // ── Données globales ──────────────────────────────────────────────────
    // allUsers est défini ici et passé en props à TaskUserSelector.
    // C'est TaskHome qui appelle userService.getAll() — un seul appel API.
    const [allUsers, setAllUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [globalError, setGlobalError] = useState(null);
    const [isInitLoading, setIsInitLoading] = useState(true);

    // ── Tâches du user connecté ───────────────────────────────────────────
    // On fusionne tasksToDo + tasksGiven pour les grouper via TaskList groupBy
    const [myTasks, setMyTasks] = useState([]);
    const [isLoadingMyTasks, setIsLoadingMyTasks] = useState(false);

    // ── Panneau membre sélectionné ────────────────────────────────────────
    const [panelUser, setPanelUser] = useState(null);      // user affiché dans le panneau
    const [panelTasks, setPanelTasks] = useState([]);
    const [isPanelLoading, setIsPanelLoading] = useState(false);

    // ── Formulaire ajout ──────────────────────────────────────────────────
    const [showAddForm, setShowAddForm] = useState(false);
    const [formError, setFormError] = useState(null);

    // ─────────────────────────────────────────────────────────────────────
    // CHARGEMENT INITIAL : users + categories (une seule fois)
    // allUsers est ensuite passé en props à TaskUserSelector — c'est ici
    // qu'il est défini, pas dans le composant enfant.
    // ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            setIsInitLoading(true);
            try {
                const [users, cats] = await Promise.all([
                    userService.getAll(),
                    categoryService.getAll(),
                ]);
                setAllUsers(users);
                setCategories(cats);
            } catch (err) {
                console.error('Erreur init:', err);
                setGlobalError('Impossible de charger les données. Vérifie que le serveur est lancé.');
            } finally {
                setIsInitLoading(false);
            }
        };
        init();
    }, []);

    // ─────────────────────────────────────────────────────────────────────
    // TÂCHES DU USER CONNECTÉ
    // On charge tasksToDo + tasksGiven et on les fusionne pour le groupBy.
    // ─────────────────────────────────────────────────────────────────────
    const loadMyTasks = useCallback(async () => {
        if (!connectedUserId) return;
        setIsLoadingMyTasks(true);
        try {
            const { tasksToDo = [], tasksGiven = [] } = await taskService.getByUserId(connectedUserId);
            // Fusion avec dédoublonnage par _id (une tâche peut être dans les deux si je me l'assigne à moi-même)
            const seen = new Set();
            const merged = [...tasksToDo, ...tasksGiven].filter(t => {
                if (seen.has(t._id)) return false;
                seen.add(t._id);
                return true;
            });
            setMyTasks(merged);
        } catch (err) {
            console.error('Erreur chargement mes tâches:', err);
        } finally {
            setIsLoadingMyTasks(false);
        }
    }, [connectedUserId]);

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    // ─────────────────────────────────────────────────────────────────────
    // SÉLECTIONNER UN MEMBRE → ouvre le panneau latéral
    // ─────────────────────────────────────────────────────────────────────
    const handleUserSelect = useCallback(async (user) => {
        setPanelUser(user);
        setPanelTasks([]);
        setIsPanelLoading(true);
        try {
            const { tasksToDo = [] } = await taskService.getByUserId(user._id);
            setPanelTasks(tasksToDo);
        } catch (err) {
            console.error('Erreur tâches membre:', err);
        } finally {
            setIsPanelLoading(false);
        }
    }, []);

    const handleClosePanel = useCallback(() => {
        setPanelUser(null);
        setPanelTasks([]);
    }, []);

    // ─────────────────────────────────────────────────────────────────────
    // AJOUTER UNE TÂCHE (admin seulement)
    // ─────────────────────────────────────────────────────────────────────
    const handleAddTask = async (formData) => {
        setFormError(null);

        if (!formData.title?.trim()) {
            setFormError('Le nom de la tâche est obligatoire.');
            return;
        }
        if (!formData.categoryId) {
            setFormError('Veuillez choisir une priorité.');
            return;
        }
        if (!formData.assignedTo) {
            setFormError('Veuillez assigner la tâche à un membre.');
            return;
        }

        try {
            await taskService.create({
                name: formData.title.trim(),
                description: formData.description?.trim() || '',
                before: formData.before || '',
                categoryId: formData.categoryId,
                toUserId: formData.assignedTo,
                fromUserId: connectedUserId,
                isDone: false,
            });
            setShowAddForm(false);
            loadMyTasks();
        } catch (err) {
            console.error('Erreur création:', err);
            setFormError(err.response?.data?.message || 'Impossible de créer la tâche.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // COMPLÉTER UNE TÂCHE
    // ─────────────────────────────────────────────────────────────────────
    const handleCompleteTask = useCallback(async (taskId) => {
        try {
            await taskService.updateStatus(taskId, true);
            loadMyTasks();
        } catch (err) {
            console.error('Erreur completion:', err);
        }
    }, [loadMyTasks]);

    // ─────────────────────────────────────────────────────────────────────
    // SUPPRIMER UNE TÂCHE
    // La vérification des permissions est aussi faite dans TaskItem,
    // mais on la revalide ici avant l'appel API.
    // ─────────────────────────────────────────────────────────────────────
    const handleDeleteTask = useCallback(async (taskId) => {
        const task = myTasks.find(t => t._id === taskId);
        if (!task) return;

        const toId = task.toUserId?._id ?? task.toUserId;
        const fromId = task.fromUserId?._id ?? task.fromUserId;
        const isAdmin = role === 'Admin';
        const isPlantedByMe = fromId === connectedUserId;
        const isAssignedToMeAndDone = toId === connectedUserId && task.isDone;

        if (!isAdmin && !isPlantedByMe && !isAssignedToMeAndDone) return;

        if (!window.confirm('Supprimer cette pousse définitivement ?')) return;

        try {
            await taskService.delete(taskId);
            loadMyTasks();
        } catch (err) {
            console.error('Erreur suppression:', err);
        }
    }, [myTasks, role, connectedUserId, loadMyTasks]);

    const connectedUser = allUsers.find(u => u._id === connectedUserId);

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* ── Header ──────────────────────────────────────────────── */}
            <section className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="flex items-center gap-5">
                    <img className="w-20 md:w-28" src="/icons/bambooflow_logo.svg" alt="Logo BambooFlow" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-chewy text-main-800">
                            Bonjour {connectedUser?.firstname || '...'} 🌿
                        </h1>
                        <p className="text-main-500 text-sm italic mt-0.5">
                            {role === 'Admin' ? 'Vous gérez la forêt 🎋' : 'Voici votre forêt du jour.'}
                        </p>
                    </div>
                </div>
                {role === 'Admin' && (
                    <button
                        onClick={() => { setShowAddForm(v => !v); setFormError(null); }}
                        className={`btn flex items-center gap-2 ${showAddForm ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}`}
                    >
                        {showAddForm ? <X size={18} /> : <Plus size={18} />}
                        {showAddForm ? 'Annuler' : 'Planter une pousse'}
                    </button>
                )}
            </section>

            {/* ── Erreur globale ──────────────────────────────────────── */}
            {globalError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-2">
                    ⚠️ {globalError}
                </div>
            )}

            {/* ── Formulaire ajout ────────────────────────────────────── */}
            {showAddForm && role === 'Admin' && (
                <div>
                    {formError && (
                        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                            {formError}
                        </div>
                    )}
                    <TaskAddForm
                        users={allUsers}
                        categories={categories}
                        onAddTask={handleAddTask}
                    />
                </div>
            )}

            {/* ── Layout principal ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sidebar membres
                    ↓ allUsers est défini dans ce composant (TaskHome)
                    ↓ et passé ici en props — TaskUserSelector ne fait aucun appel API */}
                <aside className="lg:col-span-1 bento-card h-fit">
                    <h2 className="text-xl font-bold text-main-800 mb-5 flex items-center gap-2">
                        <Leaf className="text-main-500" size={20} />
                        Membres
                    </h2>
                    <TaskUserSelector
                        allUsers={allUsers}
                        connectedUserId={connectedUserId}
                        onUserSelected={handleUserSelect}
                        isLoading={isInitLoading}
                        error={globalError}
                    />
                </aside>

                {/* Mes pousses */}
                <section className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] border-2 border-main-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-chewy text-main-800">
                                Mes pousses
                            </h2>
                            <span className="bg-main-100 text-main-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {myTasks.filter(t => !t.isDone).length} en cours
                            </span>
                        </div>

                        {isLoadingMyTasks ? (
                            <p className="text-center text-main-400 animate-pulse py-10">
                                Chargement de vos pousses...
                            </p>
                        ) : myTasks.length === 0 ? (
                            <div className="text-center py-12 text-main-400 italic">
                                <p>Aucune pousse pour l'instant. 🌱</p>
                                {role !== 'Admin' && (
                                    <p className="text-sm mt-1 text-main-300">Un admin peut vous en assigner une !</p>
                                )}
                            </div>
                        ) : (
                            <TaskList
                                tasks={myTasks}
                                connectedUserId={connectedUserId}
                                userRole={role}
                                onComplete={handleCompleteTask}
                                onDelete={handleDeleteTask}
                                groupBy={true}
                            />
                        )}
                    </div>
                </section>
            </div>

            {/* ── Panneau latéral membre sélectionné ──────────────────── */}
            <MemberPanel
                user={panelUser}
                tasks={panelTasks}
                isLoading={isPanelLoading}
                onClose={handleClosePanel}
                connectedUserId={connectedUserId}
                userRole={role}
            />
        </main>
    );
};