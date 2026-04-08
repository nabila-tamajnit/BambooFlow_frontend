import { useId } from 'react';
import { Leaf, User, Tag, PlusCircle } from 'lucide-react';

export function TaskAddForm({ users, categories, onAddTask }) {
    const id = useId();

    const handleSubmit = async (formData) => {
        const data = Object.fromEntries(formData.entries());
        onAddTask(data);
    };

    return (
        <section className="bg-white rounded-[2.5rem] p-8 border border-main-100 shadow-xl relative overflow-hidden">
            {/* ILLUSTRATION IA : "Panda jardinier avec une petite pelle" */}
            <div className="absolute -top-4 -right-4 w-32 opacity-10 rotate-12 pointer-events-none">
                <img src="/icons/bambooflow_logo.svg" alt="" />
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-main-100 rounded-2xl text-main-600">
                    <PlusCircle size={24} />
                </div>
                <h2 className="text-2xl font-chewy text-main-800">Planter une pousse</h2>
            </div>

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor={id + 'title'} className="label-form">Nom de la tâche</label>
                    <input id={id + 'title'} name="title" type="text" className="input-form" placeholder="Arroser le projet..." required />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'assign'} className="label-form">Assigner à</label>
                    <select name="assignedTo" className="input-form">
                        <option value="">Choisir un membre...</option>
                        {Array.isArray(users) && users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.firstname} {user.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'cat'} className="label-form">Priorité</label>
                    <select name="categoryId" className="input-form">
                        <option value="">Priorité...</option>
                        {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="md:col-span-2 btn py-4 text-lg mt-4">
                    Planter la pousse 🎋
                </button>
            </form>
        </section>
    );
}
