import App from "./App"
import { Login } from "./features/auth/pages/Login"
import { Register } from "./features/auth/pages/Register"
import { Faq } from "./features/faq/pages/Faq"
import { TaskDetails } from "./features/tasks/pages/TaskDetails"
import { TaskHome } from "./features/tasks/pages/TastHome"
import { About } from "./layout/pages/About"
import { Home } from "./layout/pages/Home"
import { NotFound } from "./layout/pages/NotFound"

/**
 * @type {import("react-router").RouteObject[]}
 */
export const routes = [
    {
        path : '/',
        element : <App />,
        children : [
            {
                index : true,
                element : <Home />
            },
            {
                path : 'tasks',
                element : <TaskHome />
            },
            {
                path : 'task/:id',
                element : <TaskDetails />
            },
            {
                path : 'about',
                element : <About />
            },
            {
                path : 'faq',
                element : <Faq />
            },
            {
                path : 'auth',
                children : [
                    {
                        path : 'register',
                        element : <Register />
                    },
                    {
                        path : 'login',
                        element : <Login />
                    }
                ]
            },
            // Si aucun chemin n'est défini au dessus
            {
                path : '*',
                element : <NotFound />
            }
        ]
    }
]