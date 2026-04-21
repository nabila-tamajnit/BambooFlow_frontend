import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { NavLink } from "react-router";
import { isConnectAtom } from '../../atoms/auth.atom';
import { BtnLogout } from '../../features/auth/components/BtnLogout';
import { Menu, X, Home, CheckSquare, Timer, HelpCircle, LogIn, UserPlus, UserCircle } from "lucide-react";

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isConnect = useAtomValue(isConnectAtom);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
            isActive
            ? "bg-main-100 text-main-800 shadow-sm"
            : "text-main-600 hover:bg-main-50 hover:text-main-800"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-main-100 px-6 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-3 group">
                    <div className="bg-main-100 p-2 rounded-2xl group-hover:scale-110 transition-transform">
                        <img className="w-8 h-8" src="/icons/bambooflow_logo.svg" alt="Logo" />
                    </div>
                    <p className="text-xl font-chewy text-main-800 tracking-tight">
                        Bamboo<span className="text-main-500">Flow</span>
                    </p>
                </NavLink>

                {/* Navigation Desktop */}
                <nav className="hidden lg:block">
                    <ul className="flex items-center gap-2">
                        <li><NavLink to="/" className={navLinkClass}><Home size={18}/> Accueil</NavLink></li>
                        <li><NavLink to="/tasks" className={navLinkClass}><CheckSquare size={18}/> Tâches</NavLink></li>
                        <li><NavLink to="/pomodoro" className={navLinkClass}><Timer size={18}/> Pomodoro</NavLink></li>
                        <li><NavLink to="/faq" className={navLinkClass}><HelpCircle size={18}/> FAQ</NavLink></li>
                    </ul>
                </nav>

                {/* Actions Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    {!isConnect ? (
                        <div className="flex items-center gap-2 bg-main-50 p-1 rounded-2xl border border-main-100">
                            <NavLink to="/auth/login" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-main-700 hover:bg-white rounded-xl transition-all">
                                <LogIn size={16}/> Connexion
                            </NavLink>
                            <NavLink to="/auth/register" className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-main-600 text-white rounded-xl hover:bg-main-700 shadow-md shadow-main-200 transition-all">
                                <UserPlus size={16}/> S'inscrire
                            </NavLink>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Lien vers le profil */}
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `p-2 rounded-xl transition-all ${isActive ? 'bg-main-100 text-main-800' : 'text-main-500 hover:bg-main-50 hover:text-main-700'}`
                                }
                                aria-label="Mon profil"
                            >
                                <UserCircle size={24} />
                            </NavLink>
                            <BtnLogout />
                        </div>
                    )}
                </div>

                {/* Bouton Menu Mobile */}
                <button className="lg:hidden p-2 text-main-800" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Menu Mobile */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-main-100 p-6 flex flex-col gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <NavLink to="/" onClick={() => setIsOpen(false)} className={navLinkClass}><Home size={18}/> Accueil</NavLink>
                    <NavLink to="/tasks" onClick={() => setIsOpen(false)} className={navLinkClass}><CheckSquare size={18}/> Tâches</NavLink>
                    <NavLink to="/pomodoro" onClick={() => setIsOpen(false)} className={navLinkClass}><Timer size={18}/> Pomodoro</NavLink>
                    <NavLink to="/faq" onClick={() => setIsOpen(false)} className={navLinkClass}><HelpCircle size={18}/> FAQ</NavLink>
                    <hr className="my-2 border-main-100" />
                    {!isConnect ? (
                        <div className="flex flex-col gap-3">
                            <NavLink to="/auth/login" onClick={() => setIsOpen(false)} className="btn text-center justify-center flex items-center gap-2">
                                <LogIn size={18}/> Connexion
                            </NavLink>
                            <NavLink to="/auth/register" onClick={() => setIsOpen(false)} className="text-center font-bold text-main-800 p-2">
                                Créer un compte
                            </NavLink>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <NavLink to="/profile" onClick={() => setIsOpen(false)} className={navLinkClass}>
                                <UserCircle size={18}/> Mon profil
                            </NavLink>
                            <BtnLogout />
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};