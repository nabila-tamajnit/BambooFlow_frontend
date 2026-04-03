import { NavLink, useParams } from "react-router"

export const TaskDetails = () => {
    // Pour récupérer les paramètres de route
    // useParams() est une hook qui renvoie un objet contenant tous les paramètres de la route actuelle
    // On doit en extraire celui qui nous intéresse via le petit nom qu'on lui a donné après les : dans notre fichier de routes
    const { id } = useParams();


    return (
        <>
            <section className="py-4 px-12">
                <NavLink className="text-secondary-400 underline" to="/tasks">Revenir à la liste des tâches</NavLink>

                <h1 className="text-3xl text-main-800">Tâche n°{id} </h1>
            </section>
        </>
    )
}