import { useEffect, useState } from 'react';
import userService from '../../../services/user.service';

// Composant "TaskUserSelector" a pour but de selectionner un utilisateur
//  - La props "onUserSelected" transmet l'objet "user"
//  - La valeur par default "() => {}" de la props, permet d'évité les bugs si le composant parent n'utilise pas la props. Cette valeur se surnomme "NOOP" pour "No operation"
export function TaskUserSelector({ onUserSelected = () => { } }) {

    // Charger la liste des utilisateurs via l'api (userService)
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Restauration des valeurs par defaut
        setLoading(true);
        setData(null);
        setError(null);

        // Utilisation du service pour envoyer la requete
        userService.getAll()
            .then((users) => {
                setData(users);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error);
                setLoading(false);
            });
    }, []);


    // Un state pour manipuler l'affichage de la liste
    const [userIdSelected, setUserIdSelected] = useState(null)

    // Méthode utiliser quand on clique sur un utilisateur
    const handleUserClick = (user) => {

        // Sauvegarde l'id de l'utilisateur selectionné
        setUserIdSelected(user._id);

        // Via les props, on préviens le "parent" qu'on a selectionné un utilisateur
        onUserSelected(user);
    }

    return (
        <div className='border border-main-700 p-3 flex flex-col gap-2'>
            <p>Selectionner un utilisateur : </p>
            {isLoading ? (
                <p>Chargement en cours...</p>
            ) : (data !== null) ? (
                <ul>
                    {data.map(user => (
                        <li key={user._id} onClick={() => handleUserClick(user)}
                            className={user._id === userIdSelected ? 'text-secondary-700' : 'text-main-700'}>
                            {user.firstname} {user.lastname}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Il y eu un quack lors de la requete 🦆</p>
            )}
        </div>
    )
}