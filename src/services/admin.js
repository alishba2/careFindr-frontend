import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

export const createAdmin = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}/api/admin`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating admin:", error);
        throw error.response?.data || error;
    }
};

export const getAdmins = async (params = {}) => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching admins:", error);
        throw error.response?.data || error;
    }
};

export const getAdminById = async (id) => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin:", error);
        throw error.response?.data || error;
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

export const updateAdmin = async (id, data) => {
    try {
        const response = await axios.put(`${backendUrl}/api/admin/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating admin:", error);
        throw error.response?.data || error;
    }
};

export const deleteAdmin = async (id) => {
    try {
        const response = await axios.delete(`${backendUrl}/api/admin/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting admin:", error);
        throw error.response?.data || error;
    }
};

// export const loginAdmin = async (credentials) => {
//     try {
//         const response = await axios.post(`${backendUrl}/api/admin/login`, credentials);
//         return response.data;
//     } catch (error) {
//         console.error("Error logging in:", error);
//         throw error.response?.data || error;
//     }
// };
