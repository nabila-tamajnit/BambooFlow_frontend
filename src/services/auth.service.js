import axios from 'axios';

const authService = {

    register: async (userData) => {
        // Utilisation d'une requete AJAX pour contacter le serveur WebAPI
        const response = await axios.post("http://localhost:3000/api/auth/register", userData);
        return response.data;
    },

    login: async ({ email, password }) => {
        const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
        const token = response.data.token;
        localStorage.setItem('bamboo_token', token); // On stocke le token
        return token;
    }

};

export default authService;
