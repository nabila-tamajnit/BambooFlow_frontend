import App from "./App";
import { ProtectedPage } from './features/auth/components/ProtectedPage';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { About } from './features/info/pages/About';
import { Faq } from './features/info/pages/Faq';
import { TaskDetails } from "./features/tasks/pages/TaskDetails";
import { TaskHome } from "./features/tasks/pages/TaskHome";
import { Home } from "./layout/pages/Home";
import { NotFound } from "./layout/pages/NotFound";
import { Pomodoro } from './features/pomodoro/pages/Pomodoro';

/**
 * @type { import("react-router").RouteObject}
 */
export const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                /* pour indiquer que c'est l'accueil du path '/' */
                element: <Home />
            },
            {
                path: 'tasks',
                element: <ProtectedPage><TaskHome /></ProtectedPage>
            },
            // Pour créer une route dynamique
            {
                path: 'task/:id',
                element: <ProtectedPage><TaskDetails /></ProtectedPage>
            },
            {
                path: 'auth',
                children: [
                    {
                        path: 'register',
                        element: <Register />
                    },
                    {
                        path: 'login',
                        element: <Login />
                    },
                ]
            },
            {
                path: 'pomodoro',
                element: <Pomodoro />
            },
            {
                path: 'faq',
                element: <Faq />
            },
            {
                path: 'about',
                element: <About />
            },




            // Chemin qui signifie "si aucun des chemins définis au dessus" donc attention à toujours le mettre en dernier
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]