import { useId } from 'react';
import { PlusCircle } from 'lucide-react';

/**
 * Props :
 * - users      : liste des users (utilisée uniquement si role === 'Admin')
 * - categories : liste des catégories
 * - onAddTask  : callback(formData)
 * - userRole   : 'Admin' | 'User' — adapte le formulaire
 */
export function TaskAddForm({ users, categories, onAddTask, userRole = 'User' }) {
    const id = useId();
    const isAdmin = userRole === 'Admin';

    const handleSubmit = async (formData) => {
        const data = Object.fromEntries(formData.entries());
        onAddTask(data);
    };

    return (
        <section className="bg-white rounded-[2.5rem] p-8 border border-main-100 shadow-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 opacity-10 rotate-12 pointer-events-none">
                <img src="/icons/bambooflow_logo.svg" alt="" />
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-main-100 rounded-2xl text-main-600">
                    <PlusCircle size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-chewy text-main-800">Planter une pousse</h2>
                    {!isAdmin && (
                        <p className="text-sm text-main-400 mt-0.5">
                            La tâche vous sera assignée automatiquement.
                        </p>
                    )}
                </div>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nom de la tâche */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor={id + 'title'} className="label-form">Nom de la tâche</label>
                    <input
                        id={id + 'title'}
                        name="title"
                        type="text"
                        className="input-form"
                        placeholder="Ex : Arroser les bambous..."
                        required
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="label-form">Description (optionnelle)</label>
                    <textarea
                        name="description"
                        className="input-form resize-none"
                        rows={3}
                        placeholder="Décris cette pousse en détail..."
                    />
                </div>

                {/* Date limite */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'before'} className="label-form">Date limite</label>
                    <input
                        id={id + 'before'}
                        name="before"
                        type="date"
                        className="input-form"
                    />
                </div>

                {/* Catégorie / Priorité */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'cat'} className="label-form">Priorité</label>
                    <select name="categoryId" id={id + 'cat'} className="input-form">
                        <option value="">Choisir une priorité...</option>
                        {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Assigner à — visible uniquement pour l'admin */}
                {isAdmin && (
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label htmlFor={id + 'assign'} className="label-form">
                            Assigner à
                        </label>
                        <select name="assignedTo" id={id + 'assign'} className="input-form">
                            <option value="">Choisir un membre...</option>
                            {Array.isArray(users) && users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.firstname} {user.lastname}
                                    {user.role === 'Admin' ? ' (Admin)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    className="md:col-span-2 btn py-4 text-lg mt-2 flex items-center justify-center gap-2 group"
                >
                    Planter la pousse 🎋
                </button>
            </form>
        </section>
    );
}