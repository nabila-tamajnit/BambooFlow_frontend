import { useSetAtom } from 'jotai'
import { tokenAtom } from '../../../atoms/auth.atom'

export function BtnLogout() {

    // Récupère le setter de l'atome
    const setToken = useSetAtom(tokenAtom);

    // Suppression du token
    const handleLogout = () => {
        // 1. On vide le localStorage (pour que F5 ne nous reconnecte pas)
        localStorage.removeItem('bamboo_token');

        // 2. On vide l'atome (pour mettre à jour l'interface immédiatement)
        setToken(null);
    }

    return (
        <button className='btn flex flex-row gap-2 items-center' onClick={handleLogout}>
            <span>💤</span>
            <span className='whitespace-nowrap hidden lg:block uppercase font-bold text-xs tracking-widest'>Se déconnecter</span>
        </button>
    )
}
