import { NavLink } from "react-router"

export const Header = () => {

    return (
        <header className="flex justify-between items-center py-4 px-8 bg-main-100">
            <div className="flex items-center gap-4">
                <img className="w-12" src="/icons/producktivity_logo.svg" alt="logo du site Pro'Duck'Tivity" />
                <p className="text-main-800 text-2xl uppercase font-bold font-chewy tracking-widest">Pro'<span className="text-secondary-400">Duck</span>'Tivity</p>
            </div>

            <nav>

                <ul className="flex items-center gap-4 text-lg font-bold">
                    <li>
                        <NavLink to="/">Accueil</NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks">Tâches</NavLink>
                    </li>
                    <li>
                        <NavLink to="/promodoro">Pomodoro</NavLink>
                    </li>
                    <li>
                        <NavLink to="about" >À propos</NavLink>
                    </li>
                    <li>
                        <NavLink to="/faq" >FAQ</NavLink>
                    </li>
                    <li>
                        <NavLink className="btn" to="/auth/login">Me connecter</NavLink>
                    </li>
                    <li>
                        <NavLink className="btn" to="/auth/register" >Créer un compte</NavLink>
                    </li>
                </ul>

            </nav>
        </header>
    )
}