import { useId, useState } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';
import { Eye, EyeOff } from 'lucide-react';
import { useServerWakeup } from '../../../hooks/useServerWakeup';
import { WakeupBanner } from '../../../components/WakeupBanner';

export function LoginForm() {
    const id = useId();
    const navigate = useNavigate();
    const setToken = useSetAtom(tokenAtom);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isWakingUp, startWatch, stopWatch } = useServerWakeup();

    const handleLoginSubmit = async (formData) => {
        setError(null);
        setIsLoading(true);
        startWatch();
        const data = Object.fromEntries(formData.entries());

        try {
            const token = await authService.login(data);
            setToken(token);
            navigate('/tasks');
        } catch (err) {
            console.error('Erreur login:', err);
            // Gestion propre des codes HTTP
            if (err.response?.status === 401) {
                setError('Email ou mot de passe incorrect.');
            } else if (err.response?.status === 400) {
                setError('Veuillez remplir tous les champs.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Impossible de contacter le serveur. Réessayez plus tard.');
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
            <form action={handleLoginSubmit} className="flex flex-col gap-6 relative">

                {/* Message d'erreur propre — plus de crash UI */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label htmlFor={id + 'email'} className="label-form">Email</label>
                    <input
                        id={id + 'email'}
                        type="email"
                        className="input-form"
                        name="email"
                        placeholder="panda@bambooflow.com"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="label-form">Mot de passe</label>
                    <div className="relative">
                        <input
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
                    className="btn w-full py-4 text-lg shadow-lg shadow-main-200 mt-2 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connexion...
                        </>
                    ) : (
                        <>
                            Se connecter
                            <span className="group-hover:translate-x-1 transition-transform">🌿</span>
                        </>
                    )}
                </button>
            </form>
        </>
    );
}