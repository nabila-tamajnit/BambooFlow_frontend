import { header } from "motion/react-client"

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
                        <a href="">Accueil</a>
                    </li>
                    <li>
                        <a href="">Tâches</a>
                    </li>
                    <li>
                        <a href="">Pomodoro</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}