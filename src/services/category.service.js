import axios from "axios";

const categoryService = {
    getAll: async () => {
        const response = await axios.get("http://localhost:3000/api/categories");
        return response.data;
    }
};
export default categoryService;
