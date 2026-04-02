import { useId } from "react";
import authService from "../../../services/auth.service";
import { useNavigate } from "react-router";

export const LoginForm = () => {

    const id = useId();
    const navigate = useNavigate();

    const handleLoginSubmit = async (formData) => {
        console.log('FormData', formData);

        const data = Object.fromEntries(formData.entries());
        console.log('Data', data);

        const token = await authService.login(data);
        console.log('Token', token);

        navigate('/');
    }

    return (

        <form action={handleLoginSubmit}>
            <div>
                <label htmlFor={id + 'email'}>Email :</label>
                <input id={id + 'email'} type="email" className="border" name="email" />
            </div>
            <div>
                <label htmlFor={id + 'password'}>Mot de passe :</label>
                <input id={id + 'password'} type="password" className="border" name="password" />
            </div>
            <div>
                <button type="submit" className="btn">Se connecter</button>
            </div>
        </form>
    )
}