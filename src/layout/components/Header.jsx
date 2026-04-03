import { useAtomValue } from 'jotai'
import { NavLink } from "react-router"
import { isConnectAtom } from '../../atoms/auth.atom'
import { BtnLogout } from '../../features/auth/components/BtnLogout';

export const Header = () => {

    const isConnect = useAtomValue(isConnectAtom);

    return (
        <header className="flex justify-between items-center py-4 px-8 bg-main-100 ">

            <div className="items-center gap-4 hidden lg:flex">
                <img className="w-12" src="/icons/producktivity_logo.svg" alt="logo du site Pro'Duck'Tivity représentant un canard" />

                <p className="text-main-800 text-2xl uppercase font-bold font-chewy tracking-widest">Pro'<span className="text-secondary-400">Duck</span>'Tivity</p>
            </div>

            <nav className='flex flex-row justify-between gap-10 w-full lg:w-auto'>
                <ul className="flex items-center gap-6 text-lg font-bold">
                    <li>
                        <NavLink to="/" className='whitespace-nowrap'>Accueil</NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className='whitespace-nowrap'>Tâches</NavLink>
                    </li>
                    <li>
                        <NavLink to="/pomodoro" className='whitespace-nowrap'>Pomodoro</NavLink>
                    </li>
                    <li>
                        <NavLink to="/faq" className='whitespace-nowrap'>Faq</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className='whitespace-nowrap'>A propos</NavLink>
                    </li>
                </ul>
                <ul>
                    <li>
                        {!isConnect ? (
                            <div className='btn-grp'>
                                <NavLink className="btn flex flex-row gap-0.5" to="/auth/login">
                                    <span>🐤</span>
                                    <span className='whitespace-nowrap hidden lg:block'>Me connecter</span>
                                </NavLink>
                                <NavLink className="btn flex flex-row gap-0.5" to="/auth/register">
                                    <span>🐣</span>
                                    <span className='whitespace-nowrap hidden lg:block'>Créer un compte</span>
                                </NavLink>
                            </div>
                        ) : (
                            <BtnLogout />
                        )}
                    </li>
                </ul>

            </nav>
        </header>
    )
}