import { useId } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';

export function LoginForm() {

    const id = useId();
    const navigate = useNavigate();
    const setToken = useSetAtom(tokenAtom);

    const handleLoginSubmit = async (formData) => {
        // Conversion des données vers un objet JS
        const data = Object.fromEntries(formData.entries());

        // Utiliser le service qui permet de contacter la WebAPI
        const token = await authService.login(data);

        // Sauvegarder le token dans un Atom (via Jotai)
        setToken(token);

        // Redirection vers la page d'accueil
        navigate('/');
    };

    return (
        <form action={handleLoginSubmit} className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-2">
                <label htmlFor={id + 'email'} className="label-form">Email</label>
                <input 
                    id={id + 'email'} 
                    type="email" 
                    className="input-form" 
                    name="email" 
                    placeholder="panda@bambooflow.com" 
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor={id + 'password'} className="label-form">Mot de passe</label>
                <input 
                    id={id + 'password'} 
                    type="password" 
                    className="input-form" 
                    name="password" 
                    placeholder="••••••••" 
                />
            </div>

            <button type="submit" className="btn w-full py-4 text-lg shadow-lg shadow-main-200 mt-2 flex items-center justify-center gap-2 group">
                Se connecter 
                <span className="group-hover:translate-x-1 transition-transform">🌿</span>
            </button>
        </form>
    );
}