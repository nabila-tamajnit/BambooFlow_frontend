/**
 * TaskHome.jsx
 *
 * Logique selon rôle :
 *
 * USER :
 *   - Charge ses propres tâches via GET /api/tasks/user/:id
 *   - Ne voit PAS les tâches des autres membres
 *   - Peut créer ses propres tâches uniquement (toUserId = lui-même)
 *   - Peut compléter et supprimer ses tâches
 *   - La liste des membres est affichée mais sans accès à leurs tâches
 *
 * ADMIN :
 *   - Charge TOUTES les tâches via GET /api/tasks
 *   - Peut voir et gérer les tâches de tout le monde
 *   - Peut assigner une tâche à n'importe quel membre
 *   - Panneau latéral membres disponible (filtrage par user des tâches déjà chargées)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, roleAtom } from '../../../atoms/auth.atom';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import { MemberPanel } from '../components/MemberPanel';
import taskService from '../../../services/task.service';
import userService from '../../../services/user.service';
import categoryService from '../../../services/category.service';
import { Leaf, Plus, X, Users } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export const TaskHome = () => {
    const token = useAtomValue(tokenAtom);
    const role = useAtomValue(roleAtom);
    const isAdmin = role === 'Admin';
    const connectedUserId = token ? jwtDecode(token).id : null;

    // ── État global ───────────────────────────────────────────────────────
    const [allUsers, setAllUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [globalError, setGlobalError] = useState(null);
    const [isInitLoading, setIsInitLoading] = useState(true);

    // ── Tâches ────────────────────────────────────────────────────────────
    // USER  : ses propres tâches (tasksToDo + tasksGiven fusionnées)
    // ADMIN : toutes les tâches
    const [tasks, setTasks] = useState([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);

    // ── Panneau admin : filtrage par membre sélectionné ───────────────────
    const [selectedUserId, setSelectedUserId] = useState(null);

    // ── Formulaire ajout ──────────────────────────────────────────────────
    const [showAddForm, setShowAddForm] = useState(false);
    const [formError, setFormError] = useState(null);

    // ── Chargement initial (users + catégories) ───────────────────────────
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

    // ── Chargement des tâches selon rôle ──────────────────────────────────
    const loadTasks = useCallback(async () => {
        if (!connectedUserId) return;
        setIsLoadingTasks(true);
        try {
            if (isAdmin) {
                // Admin : toutes les tâches via GET /api/tasks
                const allTasks = await taskService.getAllTasks();
                setTasks(Array.isArray(allTasks) ? allTasks : []);
            } else {
                // User : uniquement ses tâches via GET /api/tasks/user/:id
                const { tasksToDo = [], tasksGiven = [] } = await taskService.getMyTasks(connectedUserId);
                // Fusion avec dédoublonnage (une tâche créée pour soi-même apparaît dans les deux)
                const seen = new Set();
                const merged = [...tasksToDo, ...tasksGiven].filter(t => {
                    if (seen.has(t._id)) return false;
                    seen.add(t._id);
                    return true;
                });
                setTasks(merged);
            }
        } catch (err) {
            console.error('Erreur chargement tâches:', err);
            setGlobalError('Impossible de charger les tâches.');
        } finally {
            setIsLoadingTasks(false);
        }
    }, [connectedUserId, isAdmin]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // ── Filtrage admin : tâches du membre sélectionné ─────────────────────
    // On filtre en local (pas d'appel API supplémentaire) parce que l'admin
    // a déjà toutes les tâches en mémoire.
    const displayedTasks = useMemo(() => {
        if (!isAdmin || !selectedUserId) return tasks;
        return tasks.filter(t => {
            const toId = t.toUserId?._id ?? t.toUserId;
            return toId === selectedUserId;
        });
    }, [tasks, isAdmin, selectedUserId]);

    // ── Ajout d'une tâche ─────────────────────────────────────────────────
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

        try {
            await taskService.create({
                name: formData.title.trim(),
                description: formData.description?.trim() || '',
                before: formData.before || '',
                categoryId: formData.categoryId,
                // Admin peut assigner à quelqu'un, User s'assigne à lui-même
                toUserId: isAdmin && formData.assignedTo ? formData.assignedTo : connectedUserId,
                fromUserId: connectedUserId,
                isDone: false,
            });
            setShowAddForm(false);
            loadTasks();
        } catch (err) {
            console.error('Erreur création:', err);
            setFormError(err.response?.data?.message || 'Impossible de créer la tâche.');
        }
    };

    // ── Compléter une tâche ───────────────────────────────────────────────
    const handleCompleteTask = useCallback(async (taskId) => {
        try {
            await taskService.updateStatus(taskId, true);
            loadTasks();
        } catch (err) {
            console.error('Erreur completion:', err);
        }
    }, [loadTasks]);

    // ── Supprimer une tâche ───────────────────────────────────────────────
    const handleDeleteTask = useCallback(async (taskId) => {
        const task = tasks.find(t => t._id === taskId);
        if (!task) return;

        // Vérification des permissions côté front (le backend re-vérifie aussi)
        const toId = task.toUserId?._id ?? task.toUserId;
        const fromId = task.fromUserId?._id ?? task.fromUserId;
        const canDelete = isAdmin || fromId === connectedUserId || toId === connectedUserId;
        if (!canDelete) return;

        if (!window.confirm('Supprimer cette pousse définitivement ?')) return;
        try {
            await taskService.delete(taskId);
            loadTasks();
        } catch (err) {
            console.error('Erreur suppression:', err);
        }
    }, [tasks, isAdmin, connectedUserId, loadTasks]);

    // ── Données affichées ─────────────────────────────────────────────────
    const connectedUser = allUsers.find(u => u._id === connectedUserId);
    const pendingCount = displayedTasks.filter(t => !t.isDone).length;
    const selectedUser = selectedUserId ? allUsers.find(u => u._id === selectedUserId) : null;

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
                            {isAdmin ? 'Vous gérez la forêt 🎋' : 'Voici votre forêt du jour.'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { setShowAddForm(v => !v); setFormError(null); }}
                    className={`btn flex items-center gap-2 ${showAddForm ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}`}
                >
                    {showAddForm ? <X size={18} /> : <Plus size={18} />}
                    {showAddForm ? 'Annuler' : 'Planter une pousse'}
                </button>
            </section>

            {/* ── Erreur globale ───────────────────────────────────────── */}
            {globalError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-2">
                    ⚠️ {globalError}
                </div>
            )}

            {/* ── Formulaire ajout ─────────────────────────────────────── */}
            {showAddForm && (
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
                        userRole={role}
                    />
                </div>
            )}

            {/* ── Layout principal ─────────────────────────────────────── */}
            <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>

                {/* ── Colonne membres (admin seulement) ─────────────────── */}
                {isAdmin && (
                    <aside className="lg:col-span-1 bento-card h-fit">
                        <h2 className="text-xl font-bold text-main-800 mb-5 flex items-center gap-2">
                            <Users className="text-main-500" size={20} />
                            Membres
                        </h2>

                        {isInitLoading ? (
                            <p className="text-main-400 text-sm italic animate-pulse">Chargement...</p>
                        ) : (
                            <div className="space-y-2">
                                {/* Bouton "Toutes les tâches" */}
                                <button
                                    onClick={() => setSelectedUserId(null)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all font-bold text-sm
                                        ${selectedUserId === null
                                            ? 'bg-main-100 border-main-300 text-main-800'
                                            : 'bg-white border-transparent hover:border-main-200 text-main-600'
                                        }`}
                                >
                                    <span className="flex items-center justify-between">
                                        Toutes les pousses
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                            ${selectedUserId === null ? 'bg-main-500 text-white' : 'bg-main-100 text-main-600'}`}>
                                            {tasks.filter(t => !t.isDone).length}
                                        </span>
                                    </span>
                                </button>

                                {/* Liste des membres */}
                                {allUsers.map(user => {
                                    const userPending = tasks.filter(t => {
                                        const toId = t.toUserId?._id ?? t.toUserId;
                                        return toId === user._id && !t.isDone;
                                    }).length;
                                    const isSelected = selectedUserId === user._id;
                                    const isMe = user._id === connectedUserId;

                                    return (
                                        <button
                                            key={user._id}
                                            onClick={() => setSelectedUserId(user._id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all
                                                ${isSelected
                                                    ? 'bg-main-100 border-main-300'
                                                    : 'bg-white border-transparent hover:border-main-200 hover:bg-main-50/50'
                                                }`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                                                ${isSelected ? 'bg-main-500 text-white' : 'bg-main-100 text-main-600'}`}>
                                                {user.firstname?.[0]}{user.lastname?.[0]}
                                            </div>
                                            <div className="flex flex-col items-start min-w-0 flex-1">
                                                <span className="font-bold text-sm text-main-700 truncate">
                                                    {user.firstname} {user.lastname}
                                                    {isMe && <span className="ml-1 text-[10px] text-main-400 font-normal">(vous)</span>}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider
                                                    ${user.role === 'Admin' ? 'text-secondary-500' : 'text-main-400'}`}>
                                                    {user.role === 'Admin' ? 'Admin' : 'Membre'}
                                                </span>
                                            </div>
                                            {userPending > 0 && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                                                    ${isSelected ? 'bg-main-500 text-white' : 'bg-main-100 text-main-600'}`}>
                                                    {userPending}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </aside>
                )}

                {/* ── Colonne tâches ───────────────────────────────────── */}
                <section className={isAdmin ? 'lg:col-span-2' : 'col-span-1'}>
                    <div className="bg-white rounded-[2rem] border-2 border-main-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-chewy text-main-800">
                                {isAdmin && selectedUser
                                    ? `Pousses de ${selectedUser.firstname}`
                                    : isAdmin
                                        ? 'Toutes les pousses'
                                        : 'Mes pousses'
                                }
                            </h2>
                            <span className="bg-main-100 text-main-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {pendingCount} en cours
                            </span>
                        </div>

                        {isLoadingTasks ? (
                            <p className="text-center text-main-400 animate-pulse py-10">
                                Chargement des pousses...
                            </p>
                        ) : displayedTasks.length === 0 ? (
                            <div className="text-center py-12 text-main-400 italic">
                                <p>Aucune pousse ici. 🌱</p>
                                {!isAdmin && (
                                    <p className="text-sm mt-1 text-main-300">
                                        Cliquez sur "Planter une pousse" pour commencer !
                                    </p>
                                )}
                            </div>
                        ) : (
                            <TaskList
                                tasks={displayedTasks}
                                connectedUserId={connectedUserId}
                                userRole={role}
                                onComplete={handleCompleteTask}
                                onDelete={handleDeleteTask}
                                groupBy={!isAdmin || !selectedUserId}
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};