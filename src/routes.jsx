import App from "./App";
import { ProtectedPage } from './features/auth/components/ProtectedPage';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { Faq } from './features/info/pages/Faq';
import { TaskDetails } from "./features/tasks/pages/TaskDetails";
import { TaskHome } from "./features/tasks/pages/TaskHome";
import { Home } from "./layout/pages/Home";
import { NotFound } from "./layout/pages/NotFound";
import { Pomodoro } from './features/pomodoro/pages/Pomodoro';
import { Profile } from './layout/pages/Profile';

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
                element: <Home />
            },
            {
                path: 'tasks',
                element: <ProtectedPage><TaskHome /></ProtectedPage>
            },
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
                path: 'profile',
                element: <ProtectedPage><Profile /></ProtectedPage>
            },
            {
                path: 'faq',
                element: <Faq />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]