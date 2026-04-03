import { useSetAtom } from 'jotai'
import { tokenAtom } from '../../../atoms/auth.atom'

export function BtnLogout() {

    // Récupere le setter de l'atom
    const setToken = useSetAtom(tokenAtom);

    // Suppression du token
    const handleLogout = () => {
        setToken(null);
    }

    return (
        <button className='btn flex flex-row gap-0.5' onClick={handleLogout}>
            <span>💤</span>
            <span className='whitespace-nowrap hidden lg:block'>Se déconnecter</span>
        </button>
    )
}

