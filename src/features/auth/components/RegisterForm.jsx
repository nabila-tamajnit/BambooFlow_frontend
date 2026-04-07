import { useId } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { User, Mail, Lock, UserCircle } from "lucide-react";

export function RegisterForm() {
    const id = useId();
    const navigate = useNavigate();

    const handleRegisterSubmit = async (formData) => {
        const data = Object.fromEntries(formData.entries());
        await authService.register(data);
        navigate('/');
    }

    return (
        <form action={handleRegisterSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'firstname'} className="label-form">Prénom</label>
                    <input id={id + 'firstname'} type="text" className="input-form" name="firstname" placeholder="Ex: Jean" required />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'lastname'} className="label-form">Nom</label>
                    <input id={id + 'lastname'} type="text" className="input-form" name="lastname" placeholder="Ex: Dupont" required />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor={id + 'email'} className="label-form">Email</label>
                <input id={id + 'email'} type="email" className="input-form" name="email" placeholder="jean@exemple.com" required />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor={id + 'password'} className="label-form">Mot de passe</label>
                <input id={id + 'password'} type="password" className="input-form" name="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn w-full py-4 text-lg shadow-lg shadow-main-200 mt-4 flex items-center justify-center gap-2 group">
                Planter mon compte 
                <span className="group-hover:rotate-12 transition-transform">🌱</span>
            </button>
        </form>
    );
}
