import axios from "axios";

const authService = {

    register: async (userData) => {

        const response = await axios.post("http://localhost:3000/api/auth/register", userData)

        return response.data;
    }
};

export default authService;