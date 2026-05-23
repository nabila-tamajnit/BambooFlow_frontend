import { useId, useState } from 'react';
import { PlusCircle, X, Plus, Tag } from 'lucide-react';
import categoryService from '../../../services/category.service';
import { ICON_MAP, ICON_OPTIONS } from '../utils/categoryIcons';

export function TaskAddForm({ categories = [], onAddTask, onEditTask, taskToEdit = null, onCancel, onCategoryCreated, preselectedCategoryId = null }) {
    const id = useId();
    const isEditing = !!taskToEdit;

    // ── État du formulaire ───────────────────────────────────
    const [title, setTitle] = useState(taskToEdit?.name || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [before, setBefore] = useState(taskToEdit?.before || '');
    const [priority, setPriority] = useState(taskToEdit?.priority || 'medium');
    const [categoryId, setCategoryId] = useState(taskToEdit?.categoryId?._id || taskToEdit?.categoryId || preselectedCategoryId || '');

    // ── Mini-formulaire catégorie ──────────────────────────────────
    const [showQuickCat, setShowQuickCat] = useState(false);
    const [quickCatName, setQuickCatName] = useState('');
    const [quickCatIcon, setQuickCatIcon] = useState('Clipboard');
    const [quickCatLoading, setQuickCatLoading] = useState(false);
    const [quickCatError, setQuickCatError] = useState(null);

    const QUICK_ICONS = ICON_OPTIONS;

    const handleCreateQuickCat = async () => {
        if (!quickCatName.trim()) { setQuickCatError('Nom obligatoire'); return; }
        setQuickCatLoading(true);
        setQuickCatError(null);
        try {
            const created = await categoryService.create({ name: quickCatName.trim(), icon: quickCatIcon });
            onCategoryCreated?.(created);
            setCategoryId(created._id); // ← présélectionne immédiatement
            setShowQuickCat(false);
            setQuickCatName('');
            setQuickCatIcon('Clipboard');;
        } catch (err) {
            setQuickCatError(err.response?.data?.message || 'Erreur');
        } finally {
            setQuickCatLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { title, description, before, priority, categoryId };
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
                    <button type="button" onClick={onCancel} className="p-2 text-main-400 hover:text-main-700 rounded-xl hover:bg-main-50 transition-all">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nom */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor={id + 'title'} className="label-form">Nom de la tâche</label>
                    <input
                        id={id + 'title'}
                        type="text"
                        className="input-form"
                        placeholder="Ex : Réviser les hooks React..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="label-form">Description (optionnelle)</label>
                    <textarea
                        className="input-form resize-none"
                        rows={3}
                        placeholder="Quelques détails sur cette tâche..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                {/* Date limite */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'before'} className="label-form">Date limite</label>
                    <input
                        id={id + 'before'}
                        type="date"
                        className="input-form"
                        value={before}
                        onChange={e => setBefore(e.target.value)}
                    />
                </div>

                {/* Priorité */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'priority'} className="label-form">Priorité</label>
                    <select
                        id={id + 'priority'}
                        className="input-form"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="high">Haute — urgent</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Faible</option>
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

                    {/* Select catégorie */}
                    <select
                        id={id + 'cat'}
                        className="input-form"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        <option value="">Sans catégorie</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
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
                            <input
                                type="text"
                                placeholder="Nom de la catégorie..."
                                value={quickCatName}
                                onChange={e => setQuickCatName(e.target.value)}
                                className="input-form py-2 text-sm w-full"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateQuickCat())}
                            />
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_ICONS.map(iconName => {
                                    const Icon = ICON_MAP[iconName];

                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setQuickCatIcon(iconName)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${quickCatIcon === iconName
                                                    ? 'bg-main-200 ring-2 ring-main-500'
                                                    : 'bg-white hover:bg-main-100'
                                                }`}
                                        >
                                            {Icon && <Icon size={16} />}
                                        </button>
                                    );
                                })}
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