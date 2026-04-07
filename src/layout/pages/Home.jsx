import { NavLink } from "react-router";
import { ArrowRight, Leaf, Timer, Target, Sparkles } from "lucide-react";

export const Home = () => {
    return (
        <main className="overflow-hidden">
            {/* --- HERO SECTION --- */}
            <section className="relative py-20 lg:py-32 px-6 lg:px-44 flex flex-col items-center text-center bg-gradient-to-b from-main-100/50 to-white">
                
                {/* Badge flottant "Nouveau" */}
                {/* <div className="mb-6 flex items-center gap-2 bg-white border border-main-200 px-4 py-1.5 rounded-full shadow-sm animate-bounce-slow">
                    <Sparkles size={16} className="text-secondary-500" />
                    <span className="text-sm font-bold text-main-800">La V2 est arrivée !</span>
                </div> */}

                <h1 className="text-5xl lg:text-7xl font-chewy text-main-800 mb-6 leading-tight">
                    Cultivez votre focus avec <br />
                    <span className="text-main-500 relative">
                        BambooFlow
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="#429942" strokeWidth="2" fill="transparent" />
                        </svg>
                    </span>
                </h1>

                <p className="text-xl text-main-600 max-w-2xl mb-10 font-medium">
                    Bienvenue dans votre forêt personnelle. Gérez vos tâches, restez concentré avec le Pomodoro et nourrissez votre productivité... littéralement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <NavLink to="/auth/register" className="btn text-lg px-10 py-4 flex items-center gap-2 group">
                        Commencer l'aventure 
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </NavLink>
                    <NavLink to="/faq" className="px-10 py-4 rounded-2xl font-bold text-main-700 hover:bg-main-100 transition-colors">
                        Comment ça marche ?
                    </NavLink>
                </div>

                {/* Image / Mascotte Preview */}
                <div className="mt-16 relative">
                    <div className="absolute inset-0 bg-main-400 blur-[100px] opacity-20 rounded-full"></div>
                    <img 
                        className="relative w-48 lg:w-64 drop-shadow-2xl animate-float" 
                        src="/icons/bambooflow_logo.svg" 
                        alt="Panda BambooFlow" 
                    />
                </div>
            </section>

            {/* --- ARGUMENTS / FEATURES (Style Bento) --- */}
            <section className="py-20 px-6 lg:px-44">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="p-8 rounded-[2rem] bg-white border border-main-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-main-100 rounded-2xl flex items-center justify-center text-main-600 mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-main-800 mb-3">Gestion par Pousses</h3>
                        <p className="text-main-600">Organisez vos tâches comme une forêt. Priorisez ce qui compte vraiment.</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-main-800 text-white shadow-xl">
                        <div className="w-12 h-12 bg-main-700 rounded-2xl flex items-center justify-center text-main-200 mb-6">
                            <Timer size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Focus Zen</h3>
                        <p className="text-main-200">Un Timer Pomodoro intégré pour rester dans le flow sans jamais s'épuiser.</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white border border-main-100 shadow-sm hover:shadow-xl transition-all">
                        <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center text-secondary-600 mb-6">
                            <Leaf size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-main-800 mb-3">Récompenses</h3>
                        <p className="text-main-600">Plus vous avancez, plus votre forêt grandit. La productivité devient un jeu.</p>
                    </div>

                </div>
            </section>
        </main>
    );
};
