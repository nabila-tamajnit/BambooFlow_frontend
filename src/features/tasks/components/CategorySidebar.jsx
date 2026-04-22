// src/features/tasks/components/CategorySidebar.jsx
import { Plus, Tag, LayoutGrid, Pencil, Trash2 } from 'lucide-react';

export function CategorySidebar({
    categories = [],
    selectedCategoryId,
    onSelect,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-3">

            {/* Titre */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-main-400 flex items-center gap-1.5">
                    <Tag size={12} />
                    Catégories
                </h3>
                <button
                    onClick={onAdd}
                    className="p-1.5 rounded-lg text-main-400 hover:text-main-700 hover:bg-main-100 transition-all"
                    title="Ajouter une catégorie"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Toutes les tâches */}
            <button
                onClick={() => onSelect(null)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left
                    ${!selectedCategoryId
                        ? 'bg-main-800 text-white shadow-md shadow-main-200'
                        : 'text-main-600 hover:bg-main-50'
                    }`}
            >
                <LayoutGrid size={16} />
                Toutes les tâches
            </button>

            {/* Liste des catégories */}
            {categories.length === 0 ? (
                <p className="text-xs text-main-300 italic px-2">Aucune catégorie pour l'instant.</p>
            ) : (
                <div className="space-y-1">
                    {categories.map(cat => (
                        <div key={cat._id} className="group flex items-center gap-1">
                            <button
                                onClick={() => onSelect(cat._id)}
                                className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all text-left
                                    ${selectedCategoryId === cat._id
                                        ? 'bg-main-100 text-main-800 font-bold'
                                        : 'text-main-600 hover:bg-main-50'
                                    }`}
                            >
                                <span className="text-base shrink-0">{cat.icon}</span>
                                <span className="truncate">{cat.name}</span>
                            </button>

                            {/* Actions (visibles au hover, masquées pour les catégories système) */}
                            {!cat.isSystem && (
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 shrink-0">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="p-1.5 rounded-lg text-main-400 hover:text-main-700 hover:bg-main-100 transition-all"
                                        title="Modifier"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat)}
                                        className="p-1.5 rounded-lg text-main-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Bouton ajout bas de sidebar */}
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-main-400
                           border-2 border-dashed border-main-200 hover:border-main-400 hover:text-main-600
                           transition-all mt-2"
            >
                <Plus size={14} />
                Ajouter une catégorie
            </button>
        </aside>
    );
}