// Set up communication with backend
import axios from 'axios';
//Extract login information from frontend 
export const login = async (email: string, password: string) => {
    const response = await axios.post(`/login`, {email, password});
    return response.data;
}

export const getDashboardData = async (email: string) => {
    const response = await axios.post(`/dashboard`, { email });
    return response.data;
}
