import { useId, useState } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from "lucide-react";
import { useServerWakeup } from '../../../hooks/useServerWakeup';
import { WakeupBanner } from '../../../components/WakeupBanner';

export function RegisterForm() {
    const id = useId();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isWakingUp, startWatch, stopWatch } = useServerWakeup();

    const handleRegisterSubmit = async (formData) => {
        setError(null);
        setIsLoading(true);
        startWatch();
        const data = Object.fromEntries(formData.entries());

        try {
            await authService.register(data);
            navigate('/auth/login', {
                state: { successMessage: 'Compte créé avec succès ! Tu peux maintenant te connecter 🌿' }
            });
        } catch (err) {
            console.error('Erreur inscription:', err);
            if (err.response?.status === 409) {
                setError('Cet email est déjà utilisé.');
            } else if (err.response?.status === 400) {
                setError(err.response.data?.message || 'Données invalides.');
            } else {
                setError('Une erreur est survenue. Réessayez.');
            }
        } finally {
            stopWatch();
            setIsLoading(false);
        }
    };

    return (
        <>
            <WakeupBanner visible={isWakingUp} />
            <form action={handleRegisterSubmit} className="flex flex-col gap-5">

                {/* Erreur globale */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={id + 'firstname'} className="label-form">Prénom</label>
                        <input id={id + 'firstname'} type="text" className="input-form" name="firstname"
                            placeholder="Ex: Jean" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={id + 'lastname'} className="label-form">Nom</label>
                        <input id={id + 'lastname'} type="text" className="input-form" name="lastname"
                            placeholder="Ex: Dupont" required />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'email'} className="label-form">Email</label>
                    <input id={id + 'email'} type="email" className="input-form" name="email"
                        placeholder="jean@exemple.com" required />
                </div>

                {/* Mot de passe avec toggle œil */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={id + 'password'} className="label-form">Mot de passe</label>
                    <div className="relative">
                        <input
                            id={id + 'password'}
                            type={showPassword ? "text" : "password"}
                            className="input-form w-full pr-12"
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn w-full py-4 text-lg shadow-lg shadow-main-200 mt-4 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Plantation en cours...
                        </>
                    ) : (
                        <>
                            Planter mon compte
                            <span className="group-hover:rotate-12 transition-transform">🌱</span>
                        </>
                    )}
                </button>
            </form>
        </>
    );
}