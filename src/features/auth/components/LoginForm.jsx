import { useId } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../../../atoms/auth.atom';

export function LoginForm() {

    const id = useId();
    const navigate = useNavigate();
    const setToken = useSetAtom(tokenAtom);

    const handleLoginSubmit = async (formData) => {
        // Conversion des données vers un objet JS
        const data = Object.fromEntries(formData.entries());

        // Utiliser le service qui permet de contacter la WebAPI
        const token = await authService.login(data);

        // Sauvegarder le token dans un Atom (via Jotai)
        setToken(token);

        // Redirection vers la page d'accueil
        navigate('/');
    };

    return (
        <form action={handleLoginSubmit} className='flex flex-col gap-2'>
            <div className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'email'} className='label-form'>Email :</label>
                <input id={id + 'email'} type='email' className='input-form' name='email' />
            </div>
            <div className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'password'} className='label-form'>Mot de passe :</label>
                <input id={id + 'password'} type='password' className='input-form' name='password' />
            </div>
            <div>
                <button type="submit" className='btn'>Se connecter 🦊</button>
            </div>
        </form>
    )
}