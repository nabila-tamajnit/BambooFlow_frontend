import { RegisterForm } from '../components/RegisterForm'

export const Register = () => {
    return (
        <main className="min-h-[90vh] flex items-center justify-center p-6 bg-main-50/30">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-main-200/40 border border-main-100">
                <div className="text-center mb-8">
                    <h1 className="text-4xl text-main-800 font-chewy mb-3">Rejoindre la forêt</h1>
                    <p className="text-main-500 font-medium">Commence à cultiver ta productivité dès aujourd'hui.</p>
                </div>

                <RegisterForm />

                <p className="text-center mt-8 text-sm text-main-400 font-medium">
                    Déjà un compte ? <a href="/auth/login" className="text-main-600 font-bold hover:underline">Se connecter</a>
                </p>
            </div>
        </main>
    )
}
