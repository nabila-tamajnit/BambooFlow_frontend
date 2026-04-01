import { NavLink } from "react-router"

export const TaskHome = () => {

    return (
        <>
            <section className="py-6 px-12 flex items-center gap-6">
                <img className="w-40" src="/icons/producktivity_logo.svg" alt="La grosse tête de Ducky" />
                <h1 className="text-3xl text-main-800 font-chewy">Olala, tu as pleins de tâches à faire !</h1>
            </section>

            <section className="flex flex-col px-12">
                <NavLink to="/task/1" >
                    Voir détails tâche 1
                </NavLink>

                <NavLink to="/task/2">
                    Voir détails tâche 2
                </NavLink>

                <NavLink to="/task/3">
                    Voir détails tâche 3
                </NavLink>
            </section>
        </>
    )
}