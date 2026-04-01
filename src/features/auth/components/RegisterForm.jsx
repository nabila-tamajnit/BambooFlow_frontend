import { useId } from "react";
import authService from "../../../services/auth.service";
import { useNavigate } from "react-router";



export const RegisterForm = () => {

    const id = useId();
    const navigate = useNavigate();

    const handleRegisterSubmit = async (formData) => {
        console.log('FormData', formData);

        const data = Object.fromEntries(formData.entries());
        console.log('Data', data);
        
        await authService.register(data);
        
        navigate('/');
    }

    return (
        <form action={handleRegisterSubmit}>
            <div>
                <label htmlFor={id + 'email'}>Email d'utilisateur :</label>
                <input id={id + 'email'} type="email" className="border" name="email" />
            </div>
            <div>
                <label htmlFor={id + 'firstname'}>Prénom :</label>
                <input id={id + 'firstname'} type="text" className="border" name="firstname" />
            </div>
            <div>
                <label htmlFor={id + 'lastname'}>Nom :</label>
                <input id={id + 'lastname'} type="text" className="border" name="lastname" />
            </div>
            <div>
                <label htmlFor={id + 'password'}>Mot de passe :</label>
                <input id={id + 'password'} type="password" className="border" name="password" />
            </div>
            <div>
                <button type="submit" className="btn">S'enregistrer</button>
            </div>
        </form>
    )
}