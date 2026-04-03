import axios from "axios";
import { getDefaultStore } from 'jotai';
import { tokenAtom } from "../atoms/auth.atom";

const userService = {

    getAll: async () => {

        const token = getDefaultStore().get(tokenAtom);

        const response = await axios.get("http://localhost:3000/api/users", {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    }
};

export default userService;