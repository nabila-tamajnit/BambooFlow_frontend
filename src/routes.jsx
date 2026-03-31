import App from "./App"

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
                element : <div>Home Page</div>
            },
            {
                path : 'tasks',
                element : <div>Mes tâches à faire</div>
            },
            {

            }
        ]
    }
]