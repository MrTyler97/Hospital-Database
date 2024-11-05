// Set up communication with backend
import axios from 'axios';
//Extract login information from frontend 
export const login = async (email: string, password: string) => {
    const response = await axios.post(`http://localhost:5000/login`, {email, password});
    return response.data;
}
