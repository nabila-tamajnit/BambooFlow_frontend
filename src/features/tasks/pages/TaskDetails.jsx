import { useParams } from "react-router"
import { NavLink } from "react-router"

export const TaskDetails = () => {

    const { id } = useParams();

    return (
        <>
        <section className="py-4 px-12">
            <NavLink className="text-secondary-400 underline" to="/tasks">Revenir à la liste de tâches</NavLink>
            <h1 className="text-3xl text-main-800 " >Tâche n°{id}</h1>
        </section>
        
        </>
    )
}