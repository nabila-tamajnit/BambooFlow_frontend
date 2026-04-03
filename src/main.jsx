import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes.jsx'

// Création d'un router à partir du fichier des routes qu'on a créé (routes.jsx)
const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Utilisation du router en lui fournissant ce qu'on vient de créé au dessus */}
    <RouterProvider router={router} />
  </StrictMode>,
)
