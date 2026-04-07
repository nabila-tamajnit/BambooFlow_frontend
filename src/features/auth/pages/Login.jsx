import { LoginForm } from '../components/LoginForm'

export const Login = () => {
    return (
        <main className="min-h-[80vh] flex items-center justify-center p-6 bg-main-50/50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-main-200/50 border border-main-100 relative overflow-hidden">
                {/* Touche décorative : une feuille de bambou en fond */}
                <div className="absolute -top-10 -right-10 text-main-50 opacity-50 rotate-12">
                    <img src="/icons/bambooflow_logo.svg" className="w-40 opacity-10" alt="" />
                </div>

                <div className="text-center mb-10 relative">
                    <h1 className="text-4xl text-main-800 font-chewy mb-2">Bon retour !</h1>
                    <p className="text-main-500 font-medium text-sm px-8">Le panda a hâte de voir tes progrès aujourd'hui. 🌿</p>
                </div>

                <LoginForm />

                <p className="text-center mt-8 text-sm text-main-400">
                    Pas encore de forêt ? <a href="/auth/register" className="text-main-600 font-bold hover:underline">Inscris-toi</a>
                </p>
            </div>
        </main>
    )
}
