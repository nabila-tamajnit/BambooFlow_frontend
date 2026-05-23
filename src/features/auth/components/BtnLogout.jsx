import { useSetAtom } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';
import { userProfileAtom } from '../../../atoms/user.atom';
import { LogOut } from 'lucide-react';

export function BtnLogout() {
    const setToken   = useSetAtom(tokenAtom);
    const setProfile = useSetAtom(userProfileAtom);

    const handleLogout = () => {
        setToken(null);
        setProfile(null);
    };

    return (
        <button className='btn flex flex-row gap-2 items-center' onClick={handleLogout}>
            <LogOut size={16} />
            <span className='uppercase font-bold text-xs tracking-widest'>Déconnexion</span>
        </button>
    );
}