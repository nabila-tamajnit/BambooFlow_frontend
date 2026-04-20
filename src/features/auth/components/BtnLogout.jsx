import { useSetAtom } from 'jotai'
import { tokenAtom } from '../../../atoms/auth.atom'
import { LogOut } from 'lucide-react'

export function BtnLogout() {
    const setToken = useSetAtom(tokenAtom);

    const handleLogout = () => {
        localStorage.removeItem('bamboo_token');
        setToken(null);
    }

    return (
        // Texte toujours visible — suppression du hidden lg:block qui masquait le texte sur mobile
        <button className='btn flex flex-row gap-2 items-center' onClick={handleLogout}>
            <LogOut size={16} />
            <span className='uppercase font-bold text-xs tracking-widest'>Déconnexion</span>
        </button>
    )
}