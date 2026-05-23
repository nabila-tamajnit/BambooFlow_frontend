import { Plus, Tag, LayoutGrid, Pencil, Trash2 } from 'lucide-react';

import { ICON_MAP } from '../utils/categoryIcons';

export function CategorySidebar({ categories = [], selectedCategoryId, onSelect, onAdd, onEdit, onDelete }) {

    return (
        <aside className="w-full md:w-60 shrink-0">
            <div className="bg-white rounded-[2rem] border border-main-100 shadow-sm p-4 flex flex-col gap-2">

                {/* Header sidebar */}
                <div className="flex items-center justify-between px-2 pb-2 border-b border-main-100">
                    <span className="text-xs font-black uppercase tracking-widest text-main-400 flex items-center gap-1.5">
                        <Tag size={11} />
                        Catégories
                    </span>
                    <button
                        onClick={onAdd}
                        className="p-1.5 rounded-lg text-main-400 hover:text-main-600 hover:bg-main-50 transition-all"
                        title="Nouvelle catégorie"
                    >
                        <Plus size={13} />
                    </button>
                </div>

                {/* Toutes les tâches */}
                <button
                    onClick={() => onSelect(null)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-left w-full
                        ${!selectedCategoryId
                            ? 'bg-main-800 text-white shadow-sm'
                            : 'text-main-600 hover:bg-main-50'
                        }`}
                >
                    <LayoutGrid size={15} />
                    Toutes les tâches
                </button>

                {/* Liste catégories */}
                {categories.length === 0 ? (
                    <p className="text-xs text-main-300 italic px-3 py-2">Aucune catégorie.</p>
                ) : (
                    <div className="space-y-0.5">
                        {categories.map(cat => (
                            <div key={cat._id} className="group flex items-center gap-1">
                                <button
                                    onClick={() => onSelect(cat._id)}
                                    className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left
                                        ${selectedCategoryId === cat._id
                                            ? 'bg-main-100 text-main-800 font-bold'
                                            : 'text-main-600 hover:bg-main-50 font-medium'
                                        }`}
                                >
                                    <span className="text-base shrink-0">
                                        {ICON_MAP[cat.icon] ? (() => {
                                            const Icon = ICON_MAP[cat.icon];
                                            return <Icon size={18} />;
                                        })() : null}
                                    </span>
                                    <span className="truncate">{cat.name}</span>
                                </button>

                                {!cat.isSystem && (
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="p-1.5 rounded-lg text-main-300 hover:text-main-600 hover:bg-main-100 transition-all"
                                        >
                                            <Pencil size={11} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(cat)}
                                            className="p-1.5 rounded-lg text-main-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Bouton ajout */}
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-main-400
                               border-2 border-dashed border-main-200 hover:border-main-400 hover:text-main-600
                               transition-all mt-1 w-full"
                >
                    <Plus size={13} />
                    Nouvelle catégorie
                </button>
            </div>
        </aside>
    );
}