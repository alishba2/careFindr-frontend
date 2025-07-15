
import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// Get all notifications for admin (with pagination)
export const getAllNotifications = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications/all`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};
