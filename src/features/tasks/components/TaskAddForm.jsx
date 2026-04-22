// src/features/tasks/components/TaskAddForm.jsx
import { useId, useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

/**
 * Formulaire d'ajout ET d'édition d'une tâche personnelle.
 * - mode "add"  : création
 * - mode "edit" : modification (taskToEdit fourni)
 *
 * Plus de logique admin, plus d'assignation.
 */
export function TaskAddForm({ categories = [], onAddTask, onEditTask, taskToEdit = null, onCancel }) {
    const id = useId();
    const isEditing = !!taskToEdit;

    const handleSubmit = async (formData) => {
        const data = Object.fromEntries(formData.entries());
        if (isEditing) {
            onEditTask(taskToEdit._id, data);
        } else {
            onAddTask(data);
        }
    };

    return (
        <section className="bg-white rounded-[2.5rem] p-8 border border-main-100 shadow-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 opacity-10 rotate-12 pointer-events-none">
                <img src="/icons/bambooflow_logo.svg" alt="" />
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-main-100 rounded-2xl text-main-600">
                        <PlusCircle size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-chewy text-main-800">
                            {isEditing ? 'Modifier la pousse' : 'Planter une pousse'}
                        </h2>
                        <p className="text-sm text-main-400 mt-0.5">
                            {isEditing ? 'Mets à jour ta tâche.' : 'Une nouvelle tâche rien que pour toi.'}
                        </p>
                    </div>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="p-2 text-main-400 hover:text-main-700 rounded-xl hover:bg-main-50 transition-all">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nom */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor={id + 'title'} className="label-form">Nom de la tâche</label>
                    <input
                        id={id + 'title'}
                        name="title"
                        type="text"
                        className="input-form"
                        placeholder="Ex : Réviser les hooks React..."
                        defaultValue={taskToEdit?.name || ''}
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
                        placeholder="Quelques détails sur cette tâche..."
                        defaultValue={taskToEdit?.description || ''}
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
                        defaultValue={taskToEdit?.before || ''}
                    />
                </div>

                {/* Priorité */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'priority'} className="label-form">Priorité</label>
                    <select name="priority" id={id + 'priority'} className="input-form">
                        <option value="high"   defaultValue={taskToEdit?.priority === 'high'}>🔥 Haute</option>
                        <option value="medium" defaultValue={taskToEdit?.priority === 'medium'}>⚡ Moyenne</option>
                        <option value="low"    defaultValue={taskToEdit?.priority === 'low'}>🌿 Faible</option>
                    </select>
                </div>

                {/* Catégorie (optionnelle) */}
                {categories.length > 0 && (
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label htmlFor={id + 'cat'} className="label-form">Catégorie (optionnelle)</label>
                        <select name="categoryId" id={id + 'cat'} className="input-form">
                            <option value="">Sans catégorie</option>
                            {categories.map(cat => (
                                <option
                                    key={cat._id}
                                    value={cat._id}
                                    selected={taskToEdit?.categoryId?._id === cat._id}
                                >
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Submit */}
                <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="flex-1 btn py-4 text-lg flex items-center justify-center gap-2">
                        {isEditing ? '✏️ Modifier' : '🎋 Planter la pousse'}
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel}
                            className="px-6 py-4 rounded-2xl font-bold text-main-500 border-2 border-main-200 hover:bg-main-50 transition-all">
                            Annuler
                        </button>
                    )}
                </div>

                {/* ADMIN désactivé — conservé pour future évolution (assignation à un membre) */}
                {/* {isAdmin && (
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label htmlFor={id + 'assign'} className="label-form">Assigner à</label>
                        <select name="assignedTo" id={id + 'assign'} className="input-form">
                            <option value="">Choisir un membre...</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.firstname} {user.lastname}
                                </option>
                            ))}
                        </select>
                    </div>
                )} */}
            </form>
        </section>
    );
}