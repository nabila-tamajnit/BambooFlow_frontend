import { LoginForm } from '../components/LoginForm'
import { useLocation } from 'react-router';

export const Login = () => {
    const location = useLocation();
    const successMessage = location.state?.successMessage;
    return (
        <main className="min-h-[80vh] flex items-center justify-center p-6 bg-main-50/50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-main-200/50 border border-main-100 relative overflow-hidden">
                {successMessage && (
                    <div className="mb-6 bg-main-50 border border-main-200 text-main-700 rounded-2xl p-4 text-sm font-medium">
                        {successMessage}
                    </div>
                )}
                <div className="absolute -top-10 -right-10 text-main-50 opacity-50 rotate-12">
                    <img src="/icons/bambooflow_logo.svg" className="w-40 opacity-10" alt="" />
                </div>

                {successMessage ? (
                    <div className="text-center mb-10 relative">
                        <h1 className="text-4xl text-main-800 font-chewy mb-2">Bienvenue dans ta forêt !</h1>
                        <p className="text-main-500 font-medium text-sm px-8">Le panda a hâte de voir tes progrès aujourd'hui. 🌿</p>
                    </div>
                ) : (
                    <div className="text-center mb-10 relative">
                        <h1 className="text-4xl text-main-800 font-chewy mb-2">Bon retour !</h1>
                        <p className="text-main-500 font-medium text-sm px-8">Le panda a hâte de voir tes progrès aujourd'hui. 🌿</p>
                    </div>
                )}

                <LoginForm />

                <p className="text-center mt-8 text-sm text-main-400">
                    Pas encore de forêt ? <a href="/auth/register" className="text-main-600 font-bold hover:underline">Inscris-toi</a>
                </p>
            </div>
        </main>
    )
}
