# TODO.md — BambooFlow : Évolutions futures

## Feature : Gestion d'équipe (Team Tasks)

### Contexte
Actuellement chaque user gère uniquement ses propres tâches.
L'évolution prévue : un Admin/Manager peut créer des tâches et les assigner à des membres.
Pour activer cette feature, suivre les étapes ci-dessous dans l'ordre.

---

## BACKEND

### 1. models/task.model.js
Ajouter ces champs dans le taskSchema (remplacer ou compléter `userId`) :

    fromUserId: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },
    toUserId: {
        type: Types.ObjectId,
        ref: 'User',
        required: false
    },

---

### 2. services/mongo/task.service.js
Ajouter ces méthodes dans taskService :

    find: async (query) => {
        try {
            const { isDone, categoryId } = query;
            let isDoneFilter = isDone === undefined ? {} : { isDone };
            let categoryFilter;
            if (!categoryId) {
                categoryFilter = {};
            } else if (Array.isArray(categoryId)) {
                categoryFilter = { categoryId: { $in: categoryId } };
            } else {
                categoryFilter = { categoryId };
            }
            const tasks = await Task.find(isDoneFilter)
                .and(categoryFilter)
                .populate({ path: 'categoryId', select: { id: 1, name: 1, priority: 1, icon: 1, color: 1 } })
                .populate({ path: 'fromUserId', select: { id: 1, firstname: 1, lastname: 1 } })
                .populate({ path: 'toUserId', select: { id: 1, firstname: 1, lastname: 1 } });
            return tasks;
        } catch (err) {
            throw new Error(err);
        }
    },

    findAssignedTo: async (userId) => {
        try {
            const tasks = await Task.find({ toUserId: userId })
                .populate({ path: 'categoryId', select: { id: 1, name: 1, priority: 1, icon: 1, color: 1 } })
                .populate({ path: 'fromUserId', select: { id: 1, firstname: 1, lastname: 1 } })
                .populate({ path: 'toUserId', select: { id: 1, firstname: 1, lastname: 1 } });
            return tasks;
        } catch (err) {
            throw new Error(err);
        }
    },

    findGivenBy: async (userId) => {
        try {
            const tasks = await Task.find({ fromUserId: userId })
                .populate({ path: 'categoryId', select: { id: 1, name: 1, priority: 1, icon: 1, color: 1 } })
                .populate({ path: 'fromUserId', select: { id: 1, firstname: 1, lastname: 1 } })
                .populate({ path: 'toUserId', select: { id: 1, firstname: 1, lastname: 1 } });
            return tasks;
        } catch (err) {
            throw new Error(err);
        }
    },

---

### 3. controllers/task.controller.js
Ajouter ces méthodes dans taskController :

    getAll: async (req, res) => {
        const query = req.query;
        try {
            const tasks = await taskService.find(query);
            res.status(200).json({ count: tasks.length, tasks });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur lors de la récupération des tâches dans la DB' });
        }
    },

    getByUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const tasksToDo = await taskService.findAssignedTo(userId);
            const tasksGiven = await taskService.findGivenBy(userId);
            res.status(200).json({ tasksToDo, tasksGiven });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la db' });
        }
    },

    getPublicUserTasks: async (req, res) => {
        try {
            const userId = req.params.id;
            const tasksToDo = await taskService.findAssignedTo(userId);
            res.status(200).json({ tasksToDo });
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: 'Erreur de la db' });
        }
    },

---

### 4. routes/task.router.js
Ajouter ces routes (nécessite roleAuthorizationMiddleware et userAuthorizationMiddleware) :

    const roleAuthorizationMiddleware = require('../middlewares/auth/roleAuthorization.middleware');
    const userAuthorizationMiddleware = require('../middlewares/auth/userAuthorization.middleware');

    taskRouter.get('/', authenticationMiddleware(), roleAuthorizationMiddleware(['Admin']), taskController.getAll)
    taskRouter.get('/user/:id', authenticationMiddleware(), userAuthorizationMiddleware(), taskController.getByUser)
    taskRouter.get('/user/:id/tasks', authenticationMiddleware(), taskController.getPublicUserTasks)

---

## FRONTEND

### 5. Nouveau fichier : src/services/task.service.js
Ajouter ces méthodes dans l'objet taskService existant :

    getMyTasks: async (userId) => {
        const response = await axios.get(`${BASE}/tasks/user/${userId}`, {
            headers: authHeader(),
        });
        const data = response.data;
        if (Array.isArray(data)) return data[0] || { tasksToDo: [], tasksGiven: [] };
        return data || { tasksToDo: [], tasksGiven: [] };
    },

    getAllTasks: async () => {
        const response = await axios.get(`${BASE}/tasks`, {
            headers: authHeader(),
        });
        const data = response.data;
        if (Array.isArray(data)) return data;
        return data?.tasks || [];
    },

---

### 6. Nouveau fichier : src/features/tasks/components/TaskUserSelector.jsx
Créer ce fichier (sélecteur de membres pour assigner des tâches) :

    import { useState } from 'react';
    import { Loader2, AlertTriangle } from 'lucide-react';

    export function TaskUserSelector({
        allUsers = [],
        connectedUserId = null,
        onUserSelected = () => {},
        isLoading = false,
        error = null,
        taskCounts = {},
    }) {
        const [selectedUserId, setSelectedUserId] = useState(null);

        const handleClick = (user) => {
            if (user._id === connectedUserId) return;
            setSelectedUserId(user._id);
            onUserSelected(user);
        };

        const sorted = [...allUsers].sort((a, b) => {
            if (a._id === connectedUserId) return -1;
            if (b._id === connectedUserId) return 1;
            return a.firstname.localeCompare(b.firstname);
        });

        return (
            <div className="space-y-2">
                <p className="text-sm font-bold text-main-400 uppercase tracking-wider mb-3">
                    Membres de la forêt
                </p>
                {isLoading && (
                    <div className="flex items-center gap-3 p-4 text-main-500 italic">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Réveil des gardiens...</span>
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-center gap-3">
                        <AlertTriangle size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {!isLoading && !error && sorted.map(user => {
                    const isMe = user._id === connectedUserId;
                    const isSelected = user._id === selectedUserId;
                    const isAdmin = user.role === 'Admin';
                    const taskCount = taskCounts[user._id];
                    return (
                        <button
                            key={user._id}
                            onClick={() => handleClick(user)}
                            disabled={isMe}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left
                                ${isMe ? 'bg-main-50 border-main-100 cursor-default'
                                    : isSelected ? 'bg-main-100 border-main-300 shadow-sm'
                                    : 'bg-white border-transparent hover:border-main-200 hover:bg-main-50/50'}`}
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                                ${isMe ? 'bg-main-200 text-main-600'
                                    : isSelected ? 'bg-main-500 text-white'
                                    : 'bg-main-100 text-main-600'}`}>
                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className={`font-bold text-sm truncate
                                    ${isMe ? 'text-main-500' : isSelected ? 'text-main-900' : 'text-main-700'}`}>
                                    {user.firstname} {user.lastname}
                                    {isMe && <span className="ml-1 text-[10px] text-main-400 font-normal">(vous)</span>}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider
                                    ${isAdmin ? 'text-secondary-500' : 'text-main-400'}`}>
                                    {isAdmin ? 'Admin' : 'Membre'}
                                </span>
                            </div>
                            {taskCount !== undefined && taskCount > 0 && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                                    ${isSelected ? 'bg-main-500 text-white' : 'bg-main-100 text-main-600'}`}>
                                    {taskCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

---

### 7. Nouveau fichier : src/features/tasks/components/MemberPanel.jsx
Créer ce fichier (panneau latéral affichant les tâches d'un membre) :

    import { useEffect, useRef } from 'react';
    import { X, Loader2 } from 'lucide-react';
    import { TaskList } from './TaskList';

    export const MemberPanel = ({ user, tasks = [], isLoading, onClose, connectedUserId, userRole }) => {
        const panelRef = useRef(null);

        useEffect(() => {
            if (!user) return;
            const handleClickOutside = (e) => {
                if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
            };
            const timer = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [user, onClose]);

        useEffect(() => {
            const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
            document.addEventListener('keydown', handleKey);
            return () => document.removeEventListener('keydown', handleKey);
        }, [onClose]);

        useEffect(() => {
            document.body.style.overflow = user ? 'hidden' : '';
            return () => { document.body.style.overflow = ''; };
        }, [user]);

        if (!user) return null;

        return (
            <>
                <div className="fixed inset-0 bg-main-900/20 backdrop-blur-sm z-40 transition-opacity duration-300" aria-hidden="true" />
                <div ref={panelRef} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between p-6 border-b border-main-100 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-main-100 text-main-600 flex items-center justify-center font-bold text-sm">
                                {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-chewy text-main-800 text-lg leading-tight">
                                    {user.firstname} {user.lastname}
                                </p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider
                                    ${user.role === 'Admin' ? 'text-secondary-500' : 'text-main-400'}`}>
                                    {user.role === 'Admin' ? 'Admin' : 'Membre'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-main-400 hover:text-main-700 hover:bg-main-50 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-3 py-20 text-main-400">
                                <Loader2 className="animate-spin" size={22} />
                                <span className="font-medium">Chargement des pousses...</span>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-main-400 italic text-lg">Aucune pousse. 🌱</p>
                                <p className="text-main-300 text-sm mt-2">{user.firstname} n'a pas encore de tâches.</p>
                            </div>
                        ) : (
                            <TaskList tasks={tasks} connectedUserId={connectedUserId} userRole={userRole} readOnly={true} />
                        )}
                    </div>
                    <div className="p-4 border-t border-main-100 shrink-0">
                        <p className="text-center text-main-300 text-xs">
                            Vue en lecture seule · {tasks.length} pousse{tasks.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </>
        );
    };

---

### 8. src/features/auth/components/RegisterForm.jsx
Activer le bouton "code administrateur" :

    const ADMIN_SECRET_HINT = "Code fourni par votre formateur";

    const [showAdminField, setShowAdminField] = useState(false);


    <button
        type="button"
        onClick={() => setShowAdminField(!showAdminField)}
        className="flex items-center gap-2 text-sm text-main-400 hover:text-main-600 transition-colors self-start"
    >
        <ShieldCheck size={16} />
        {showAdminField ? 'Masquer le code admin' : "J'ai un code administrateur"}
    </button>

    {showAdminField && (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id + 'adminCode'} className="label-form flex items-center gap-2">
                <ShieldCheck size={14} className="text-secondary-500" />
                Code administrateur
            </label>
            <input
                id={id + 'adminCode'}
                type="text"
                className="input-form"
                name="adminCode"
                placeholder="Code fourni par votre formateur"
            />
            <p className="text-[11px] text-main-400 ml-1">
                Laissez vide si vous n'êtes pas administrateur.
            </p>
        </div>
    )}

---

### 9. Modèle User — rôles étendus (optionnel)
Dans models/user.model.js, étendre l'enum si un rôle Manager est ajouté :

    role: {
        type: String,
        enum: ['User', 'Admin', 'Manager'],
        default: 'User'
    }