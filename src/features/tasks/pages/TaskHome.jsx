import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, roleAtom } from '../../../atoms/auth.atom';
import { TaskUserSelector } from '../components/TaskUserSelector';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import taskService from '../../../services/task.service';
import userService from '../../../services/user.service';
import categoryService from '../../../services/category.service';
import { Leaf, Plus, X, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export const TaskHome = () => {
    const token = useAtomValue(tokenAtom);
    const role = useAtomValue(roleAtom);

    // Décode l'id du user connecté depuis le token
    const connectedUserId = token ? jwtDecode(token).id : null;

    const [allUsers, setAllUsers] = useState([]);
    const [categories, setCategories] = useState([]);

    // Tâches du user connecté (section principale)
    const [myTasksToDo, setMyTasksToDo] = useState([]);
    const [myTasksGiven, setMyTasksGiven] = useState([]);

    // Tâches d'un autre membre sélectionné (lecture seule)
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserTasks, setSelectedUserTasks] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoadingMyTasks, setIsLoadingMyTasks] = useState(false);
    const [isLoadingOther, setIsLoadingOther] = useState(false);
    const [formError, setFormError] = useState(null);
    const [globalError, setGlobalError] = useState(null);

    // ─── Chargement initial : users + categories ───────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const [users, cats] = await Promise.all([
                    userService.getAll(),
                    categoryService.getAll(),
                ]);
                setAllUsers(users);
                setCategories(cats);
            } catch (err) {
                console.error('Erreur init:', err);
                setGlobalError('Erreur lors du chargement des données initiales.');
            }
        };
        init();
    }, []); // Une seule fois au montage

    // ─── Charger les tâches du user connecté ───────────────────────────────
    const loadMyTasks = useCallback(async () => {
        if (!connectedUserId) return;
        setIsLoadingMyTasks(true);
        try {
            // getByUserId retourne { tasksToDo: [], tasksGiven: [] }
            const { tasksToDo = [], tasksGiven = [] } = await taskService.getByUserId(connectedUserId);
            setMyTasksToDo(tasksToDo);
            setMyTasksGiven(tasksGiven);
        } catch (err) {
            console.error('Erreur chargement mes tâches:', err);
        } finally {
            setIsLoadingMyTasks(false);
        }
    }, [connectedUserId]);

    useEffect(() => {
        loadMyTasks();
    }, [loadMyTasks]);

    // ─── Sélectionner un autre membre ──────────────────────────────────────
    const handleUserSelect = useCallback(async (user) => {
        // Ignorer si c'est le user connecté (ses tâches sont déjà affichées)
        if (user._id === connectedUserId) return;

        setSelectedUser(user);
        setSelectedUserTasks([]);
        setIsLoadingOther(true);
        try {
            const { tasksToDo = [], tasksGiven = [] } = await taskService.getByUserId(user._id);
            // On affiche ses tâches à faire (celles qui lui sont assignées)
            setSelectedUserTasks(tasksToDo);
        } catch (err) {
            console.error('Erreur tâches membre:', err);
        } finally {
            setIsLoadingOther(false);
        }
    }, [connectedUserId]);

    // ─── Ajouter une tâche ─────────────────────────────────────────────────
    const handleAddTask = async (formData) => {
        setFormError(null);

        // Validation minimale côté front
        if (!formData.title?.trim()) {
            setFormError('Le nom de la tâche est obligatoire.');
            return;
        }
        if (!formData.categoryId) {
            setFormError('Veuillez choisir une priorité (catégorie).');
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
            // Rafraîchir mes tâches si la nouvelle m'est assignée
            if (formData.assignedTo === connectedUserId) {
                loadMyTasks();
            }
            // Rafraîchir les tâches du membre sélectionné si c'est lui qui reçoit
            if (selectedUser && formData.assignedTo === selectedUser._id) {
                handleUserSelect(selectedUser);
            }
        } catch (err) {
            console.error('Erreur création tâche:', err);
            setFormError(
                err.response?.data?.message || 'Impossible de créer la tâche. Vérifiez les champs.'
            );
        }
    };

    // ─── Compléter une tâche (user connecté uniquement) ───────────────────
    const handleCompleteTask = async (taskId) => {
        try {
            await taskService.updateStatus(taskId, true);
            loadMyTasks();
        } catch (err) {
            console.error('Erreur completion tâche:', err);
        }
    };

    const connectedUser = allUsers.find(u => u._id === connectedUserId);

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <section className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <img className="w-24 md:w-32" src="/icons/bambooflow_logo.svg" alt="Logo BambooFlow" />
                    <div>
                        <h1 className="text-3xl font-chewy text-main-800">
                            Bonjour {connectedUser?.firstname || '...'} 🌿
                        </h1>
                        <p className="text-main-500 font-medium text-sm italic mt-1">
                            {role === 'Admin'
                                ? 'Vous gérez la forêt 🎋'
                                : 'Voici votre forêt du jour.'}
                        </p>
                    </div>
                </div>

                {/* Bouton "Planter" visible uniquement pour l'admin */}
                {role === 'Admin' && (
                    <button
                        onClick={() => { setShowAddForm(!showAddForm); setFormError(null); }}
                        className={`btn flex items-center gap-2 ${showAddForm ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                        {showAddForm ? <X size={18} /> : <Plus size={18} />}
                        {showAddForm ? 'Annuler' : 'Planter une pousse'}
                    </button>
                )}
            </section>

            {/* ── Erreur globale ──────────────────────────────────────────── */}
            {globalError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                    {globalError}
                </div>
            )}

            {/* ── Formulaire ajout (admin only) ───────────────────────────── */}
            {showAddForm && role === 'Admin' && (
                <div className="animate-in fade-in zoom-in duration-300">
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

            {/* ── Layout principal ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sidebar membres */}
                <aside className="lg:col-span-1 bento-card h-fit">
                    <h2 className="text-xl font-bold text-main-800 mb-6 flex items-center gap-2">
                        <Leaf className="text-main-500" size={20} />
                        Membres
                    </h2>
                    <TaskUserSelector
                        onUserSelected={handleUserSelect}
                        connectedUserId={connectedUserId}
                        allUsers={allUsers}
                    />
                </aside>

                {/* Contenu principal */}
                <section className="lg:col-span-2 space-y-8">

                    {/* Mes pousses — section prioritaire */}
                    <div className="bg-white rounded-[2rem] border-2 border-main-300 shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-chewy text-main-800 flex items-center gap-2">
                                <User size={22} className="text-main-500" />
                                Mes pousses
                            </h2>
                            <span className="bg-main-100 text-main-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {myTasksToDo.length} à faire
                            </span>
                        </div>

                        {isLoadingMyTasks ? (
                            <p className="text-center text-main-400 animate-pulse py-8">
                                Chargement de vos pousses...
                            </p>
                        ) : myTasksToDo.length === 0 ? (
                            <div className="text-center py-10 text-main-400 italic">
                                <p>Aucune pousse à récolter. 🌱</p>
                                {role !== 'Admin' && (
                                    <p className="text-sm mt-1">Un admin peut vous en assigner une !</p>
                                )}
                            </div>
                        ) : (
                            <TaskList
                                tasks={myTasksToDo}
                                canComplete={true}
                                onComplete={handleCompleteTask}
                            />
                        )}
                    </div>

                    {/* Tâches données par moi */}
                    {myTasksGiven.length > 0 && (
                        <div className="bg-white/70 rounded-[2rem] border border-main-100 shadow-sm p-6">
                            <h2 className="text-xl font-chewy text-main-600 mb-4 flex items-center gap-2">
                                🎋 Pousses que j'ai plantées
                            </h2>
                            <TaskList tasks={myTasksGiven} readOnly />
                        </div>
                    )}

                    {/* Tâches d'un autre membre (lecture seule pour tous, sauf admin) */}
                    {selectedUser && (
                        <div className="bg-white/60 rounded-[2rem] border border-main-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-chewy text-main-600 flex items-center gap-2">
                                    🌿 Pousses de {selectedUser.firstname}
                                </h2>
                                <div className="flex items-center gap-2">
                                    {role !== 'Admin' && (
                                        <span className="bg-main-50 text-main-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-main-100">
                                            Lecture seule
                                        </span>
                                    )}
                                    <button
                                        onClick={() => { setSelectedUser(null); setSelectedUserTasks([]); }}
                                        className="text-main-400 hover:text-main-700 transition-colors p-1"
                                        aria-label="Fermer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {isLoadingOther ? (
                                <p className="text-center text-main-400 animate-pulse py-6">
                                    Chargement...
                                </p>
                            ) : selectedUserTasks.length === 0 ? (
                                <p className="text-center text-main-400 italic py-6">
                                    Aucune pousse pour {selectedUser.firstname}. 🌱
                                </p>
                            ) : (
                                // L'admin peut compléter les tâches des autres, pas les users
                                <TaskList
                                    tasks={selectedUserTasks}
                                    readOnly={role !== 'Admin'}
                                    canComplete={role === 'Admin'}
                                    onComplete={role === 'Admin' ? handleCompleteTask : undefined}
                                />
                            )}
                        </div>
                    )}

                </section>
            </div>
        </main>
    );
};