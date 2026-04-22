// src/features/tasks/components/TaskAddForm.jsx
import { useId, useState } from 'react';
import { PlusCircle, X, Plus, Tag } from 'lucide-react';
import categoryService from '../../../services/category.service';

export function TaskAddForm({ categories = [], onAddTask, onEditTask, taskToEdit = null, onCancel, onCategoryCreated }) {
    const id = useId();
    const isEditing = !!taskToEdit;

    // Mini-formulaire catégorie inline
    const [showQuickCat, setShowQuickCat] = useState(false);
    const [quickCatName, setQuickCatName] = useState('');
    const [quickCatIcon, setQuickCatIcon] = useState('📋');
    const [quickCatLoading, setQuickCatLoading] = useState(false);
    const [quickCatError, setQuickCatError] = useState(null);
    const [newCatId, setNewCatId] = useState(null); // pour présélectionner la nouvelle cat

    const handleCreateQuickCat = async () => {
        if (!quickCatName.trim()) { setQuickCatError('Nom obligatoire'); return; }
        setQuickCatLoading(true);
        setQuickCatError(null);
        try {
            const created = await categoryService.create({ name: quickCatName.trim(), icon: quickCatIcon });
            onCategoryCreated?.(created);
            setNewCatId(created._id);
            setShowQuickCat(false);
            setQuickCatName('');
            setQuickCatIcon('📋');
        } catch (err) {
            setQuickCatError(err.response?.data?.message || 'Erreur');
        } finally {
            setQuickCatLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        const data = Object.fromEntries(formData.entries());
        if (isEditing) {
            onEditTask(taskToEdit._id, data);
        } else {
            onAddTask(data);
        }
    };

    // Catégorie présélectionnée : celle en cours d'édition OU la nouvelle créée
    const defaultCatId = newCatId || taskToEdit?.categoryId?._id || '';

    const QUICK_ICONS = ['📋', '💼', '🏠', '🎯', '📚', '💡', '🛒', '❤️', '🎨', '⚙️'];

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
                    <select
                        name="priority"
                        id={id + 'priority'}
                        className="input-form"
                        defaultValue={taskToEdit?.priority || 'medium'}
                    >
                        <option value="high">🔥 Haute — urgent</option>
                        <option value="medium">⚡ Moyenne</option>
                        <option value="low">🌿 Faible</option>
                    </select>
                </div>

                {/* Catégorie + création rapide */}
                <div className="md:col-span-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor={id + 'cat'} className="label-form mb-0">Catégorie (optionnelle)</label>
                        <button
                            type="button"
                            onClick={() => setShowQuickCat(v => !v)}
                            className="text-xs font-bold text-main-500 hover:text-main-700 flex items-center gap-1 transition-colors"
                        >
                            <Plus size={12} />
                            {showQuickCat ? 'Annuler' : 'Nouvelle catégorie'}
                        </button>
                    </div>

                    {/* Sélecteur catégorie */}
                    <select
                        name="categoryId"
                        id={id + 'cat'}
                        className="input-form"
                        value={defaultCatId}
                        onChange={() => {}} // contrôlé par defaultCatId
                        key={defaultCatId} // force re-render si nouvelle cat
                        defaultValue={defaultCatId}
                    >
                        <option value="">Sans catégorie</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Mini-formulaire création rapide */}
                    {showQuickCat && (
                        <div className="bg-main-50 rounded-2xl p-4 border border-main-200 space-y-3">
                            <p className="text-xs font-bold text-main-500 flex items-center gap-1.5">
                                <Tag size={12} />
                                Créer une nouvelle catégorie
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nom de la catégorie..."
                                    value={quickCatName}
                                    onChange={e => setQuickCatName(e.target.value)}
                                    className="input-form flex-1 py-2 text-sm"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateQuickCat())}
                                />
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_ICONS.map(ico => (
                                    <button
                                        key={ico}
                                        type="button"
                                        onClick={() => setQuickCatIcon(ico)}
                                        className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all
                                            ${quickCatIcon === ico ? 'bg-main-200 ring-2 ring-main-500' : 'bg-white hover:bg-main-100'}`}
                                    >
                                        {ico}
                                    </button>
                                ))}
                            </div>

                            {quickCatError && <p className="text-red-500 text-xs">{quickCatError}</p>}

                            <button
                                type="button"
                                onClick={handleCreateQuickCat}
                                disabled={quickCatLoading}
                                className="btn py-2 text-sm w-full disabled:opacity-60"
                            >
                                {quickCatLoading ? '...' : `Créer "${quickCatName || '...'}"`}
                            </button>
                        </div>
                    )}
                </div>

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
            </form>
        </section>
    );
}