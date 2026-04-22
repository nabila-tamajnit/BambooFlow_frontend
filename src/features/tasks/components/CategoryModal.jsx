// src/features/tasks/components/CategoryModal.jsx
import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import categoryService from '../../../services/category.service';

const ICON_OPTIONS = ['📋', '💼', '🏠', '🎯', '📚', '💡', '🛒', '❤️', '🎨', '⚙️', '🌱', '🏋️'];
const COLOR_OPTIONS = [
    { label: 'Vert',    value: 'green',  cls: 'bg-emerald-500' },
    { label: 'Bleu',    value: 'blue',   cls: 'bg-blue-500'    },
    { label: 'Rouge',   value: 'red',    cls: 'bg-red-500'     },
    { label: 'Orange',  value: 'orange', cls: 'bg-orange-500'  },
    { label: 'Violet',  value: 'purple', cls: 'bg-purple-500'  },
    { label: 'Rose',    value: 'pink',   cls: 'bg-pink-500'    },
    { label: 'Jaune',   value: 'yellow', cls: 'bg-yellow-400'  },
    { label: 'Gris',    value: 'gray',   cls: 'bg-gray-500'    },
];

export function CategoryModal({ onClose, onCreated, editCategory = null }) {
    const isEditing = !!editCategory;
    const [name,  setName]  = useState(editCategory?.name  || '');
    const [icon,  setIcon]  = useState(editCategory?.icon  || '📋');
    const [color, setColor] = useState(editCategory?.color || 'green');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Le nom est obligatoire.'); return; }

        setLoading(true);
        setError(null);
        try {
            let result;
            if (isEditing) {
                result = await categoryService.update(editCategory._id, { name: name.trim(), icon, color });
            } else {
                result = await categoryService.create({ name: name.trim(), icon, color });
            }
            onCreated(result, isEditing);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-main-900/30 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-main-100 animate-in fade-in slide-in-from-bottom-4 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-main-100 rounded-2xl text-main-600">
                            <Tag size={20} />
                        </div>
                        <h2 className="text-xl font-chewy text-main-800">
                            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-main-400 hover:text-main-700 rounded-xl hover:bg-main-50 transition-all">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Nom */}
                    <div className="flex flex-col gap-1.5">
                        <label className="label-form">Nom</label>
                        <input
                            type="text"
                            className="input-form"
                            placeholder="Ex : Travail, Perso..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Icône */}
                    <div className="flex flex-col gap-1.5">
                        <label className="label-form">Icône</label>
                        <div className="flex flex-wrap gap-2">
                            {ICON_OPTIONS.map(ico => (
                                <button
                                    key={ico}
                                    type="button"
                                    onClick={() => setIcon(ico)}
                                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all
                                        ${icon === ico
                                            ? 'bg-main-100 ring-2 ring-main-500 scale-110'
                                            : 'bg-main-50 hover:bg-main-100'
                                        }`}
                                >
                                    {ico}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Couleur */}
                    <div className="flex flex-col gap-1.5">
                        <label className="label-form">Couleur</label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTIONS.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-8 h-8 rounded-full ${c.cls} transition-all
                                        ${color === c.value ? 'ring-2 ring-offset-2 ring-main-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Prévisualisation */}
                    <div className="bg-main-50 rounded-2xl p-3 flex items-center gap-3 border border-main-100">
                        <span className="text-2xl">{icon}</span>
                        <span className="font-bold text-main-700">{name || 'Aperçu...'}</span>
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn py-3 disabled:opacity-60"
                        >
                            {loading ? '...' : isEditing ? 'Modifier' : 'Créer la catégorie'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-2xl font-bold text-main-500 border-2 border-main-200 hover:bg-main-50"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}