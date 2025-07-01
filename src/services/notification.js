import axios from './axiosConfig';
const backendUrl = import.meta.env.VITE_APP_BASE_URL;
export const getNotification = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications`);
        return response.data;
    } catch (error) {
        console.error("Error updating facility services:", error);
        throw error;
    }
};

