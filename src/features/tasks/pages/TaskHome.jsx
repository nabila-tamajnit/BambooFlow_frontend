import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { isConnectAtom } from '../../../atoms/auth.atom'; // Vérifie bien ce chemin
import { TaskUserSelector } from '../components/TaskUserSelector';
import { TaskList } from '../components/TaskList';
import { TaskAddForm } from '../components/TaskAddForm';
import taskService from '../../../services/task.service';
import userService from '../../../services/user.service';
import categoryService from '../../../services/category.service';
import { Leaf, Sparkles, Plus, X } from "lucide-react";
import { jwtDecode } from 'jwt-decode';
import { tokenAtom } from '../../../atoms/auth.atom';

export const TaskHome = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = useAtomValue(tokenAtom);
    const connectedUserId = token ? jwtDecode(token).id : null;

    // Chargement initial des données pour le formulaire
    useEffect(() => {
        userService.getAll()
            .then(data => setAllUsers(data))
            .catch(err => console.error("Erreur membres:", err));

        categoryService.getAll()
            .then(data => setCategories(data))
            .catch(err => console.error("Erreur catégories:", err));

        if (connectedUserId && allUsers.length > 0) {
            const me = allUsers.find(u => u._id === connectedUserId);
            if (me) handleUserSelect(me);
        }

    }, [allUsers]);

    // LOGIQUE DU PROF : Sélectionner un utilisateur
    const handleUserSelect = async (user) => {
        setTasks([]);
        setSelectedUser(user);
        setIsLoading(true);

        try {
            const response = await taskService.getByUserId(user._id);

            // CORRECTION : On accède au premier élément [0], puis à tasksToDo
            // On ajoute des sécurités (?.) au cas où la réponse changerait
            const tasksToDisplay = response[0]?.tasksToDo || [];

            console.log("Les pousses sont prêtes :", tasksToDisplay);
            setTasks(tasksToDisplay);

        } catch (error) {
            console.error("Erreur lors de la récolte :", error);
        } finally {
            setIsLoading(false);
        }
    };



    // LOGIQUE : Ajouter une tâche (Traduction Front -> Back)
    const handleAddTask = async (formData) => {
        try {
            const cleanData = {
                name: formData.title,
                before: formData.before || "",
                categoryId: formData.categoryId,
                toUserId: formData.assignedTo,
                fromUserId: allUsers[0]?._id, // Simulation de l'auteur (toi)
                isDone: false
            };

            await taskService.create(cleanData);
            setShowAddForm(false);

            // Si on ajoute une tâche pour l'user actuellement affiché, on rafraîchit
            if (selectedUser && cleanData.toUserId === selectedUser._id) {
                handleUserSelect(selectedUser);
            }
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        }
    };

    return (
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header BambooFlow */}
            <section className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-main-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <img className="w-24 md:w-32" src="/icons/bambooflow_logo.svg" alt="Logo" />
                    <div>
                        <h1 className="text-3xl font-chewy text-main-800">Ma Forêt</h1>
                        <p className="text-main-600 font-medium italic">Gérez les pousses de l'équipe.</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`btn flex items-center gap-2 ${showAddForm ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                    {showAddForm ? <X size={20} /> : <Plus size={20} />}
                    {showAddForm ? 'Annuler' : 'Planter une pousse'}
                </button>
            </section>

            {/* Formulaire d'ajout */}
            {showAddForm && (
                <div className="animate-in fade-in zoom-in duration-300">
                    <TaskAddForm
                        users={allUsers}
                        categories={categories}
                        onAddTask={handleAddTask}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1 bento-card h-fit">
                    <h2 className="text-xl font-bold text-main-800 mb-6 flex items-center gap-2">
                        <Leaf className="text-main-500" size={20} /> Membres
                    </h2>
                    <TaskUserSelector onUserSelected={handleUserSelect} />
                </aside>

                <section className="lg:col-span-2">
                    {selectedUser ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-chewy text-main-800 px-2">
                                Pousses de {selectedUser.firstname}
                            </h2>
                            {isLoading ? (
                                <p className="p-10 text-center animate-pulse text-main-400">Récolte en cours...</p>
                            ) : (
                                <TaskList tasks={tasks} />
                            )}
                        </div>
                    ) : (
                        <div className="bg-white/50 border-2 border-dashed border-main-200 rounded-[3rem] p-20 text-center">
                            <p className="text-main-400 font-medium italic">
                                Sélectionnez un membre pour voir sa forêt.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};
