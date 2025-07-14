import axios from './axiosConfig';
let backendUrl = import.meta.env.VITE_APP_BASE_URL;

export const createAdmin = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}/api/admin`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error);
        throw error;
    }
}

export const getAdmins = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
}
export const getCurrentAdmin = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/me`);
        return response.data;
    }
    catch (error) {
        console.error("error fetching admin");
        throw error;
    }
}

export const editAdmin = async (id, data) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/admin/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error editing admin:", error);
        throw error;
    }
}
export const deleteAdmin = async (id) => {
    try {
        const response = await axios.delete(`${backendUrl}/api/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting admin:", error);
        throw error;
    }
}
