import { useId, useState } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';
import { Eye, EyeOff } from 'lucide-react'; // Importe les icônes

export function LoginForm() {

    const id = useId();
    const navigate = useNavigate();
    const setToken = useSetAtom(tokenAtom);
    const [showPassword, setShowPassword] = useState(false);

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
                <label className="label-form">Mot de passe</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input-form w-full pr-12" // pr-12 pour laisser de la place à l'icône
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-main-300 hover:text-main-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button type="submit" className="btn w-full py-4 text-lg shadow-lg shadow-main-200 mt-2 flex items-center justify-center gap-2 group">
                Se connecter
                <span className="group-hover:translate-x-1 transition-transform">🌿</span>
            </button>
        </form>
    );
}