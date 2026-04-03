import { useId } from 'react';
import authService from '../../../services/auth.service';
import { useNavigate } from 'react-router';

export function RegisterForm() {

    const id = useId(); // Id d'accessibilité → :r1: (UNIQUEMENT pour l'UX)
    const navigate = useNavigate();

    const handleRegisterSubmit = async (formData) => {
        // Les données sont récupéré sous la forme d'une FormData -> Necessite un name !!!
        console.log('FormData', formData);

        // Conversion des données vers un objet JS
        //* Attention, se base sur la valeur des champs (checkbox → "on")
        const data = Object.fromEntries(formData.entries());
        console.log('Data', data);
        // Dans notre cas, il faut transformer le formData en object JS car la WebAPI ne s'attend pas a recevoir des données du type "FormData"

        // Utiliser le service qui permet de contacter la WebAPI
        await authService.register(data);

        // Redirection vers la page d'accueil
        navigate('/');
    }

    return (
        <form action={handleRegisterSubmit}  className='flex flex-col gap-2'>
            <div  className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'email'} className='label-form'>Email d'utilisateur :</label>
                <input id={id + 'email'} type='email'  className='input-form' name='email' />
            </div>
            <div  className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'firstname'} className='label-form'>Prénom :</label>
                <input id={id + 'firstname'} type='text'  className='input-form' name='firstname' />
            </div>
            <div  className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'lastname'} className='label-form'>Nom :</label>
                <input id={id + 'lastname'} type='text'  className='input-form' name='lastname' />
            </div>
            <div  className='flex flex-row gap-2 items-center'>
                <label htmlFor={id + 'password'} className='label-form'>Mot de passe :</label>
                <input id={id + 'password'} type='password'  className='input-form' name='password' />
            </div>
            <div>
                <button type="submit" className='btn'>S'enregister 💖</button>
            </div>
        </form>
    );
}