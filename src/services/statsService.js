import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// ===== ADMIN STATISTICS SERVICES =====

// Get comprehensive admin dashboard statistics
export const getAdminStats = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/stats/overview`);
        console.log(response, 'resposne is here');
        return response.data;
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
    }
};


// Export all services as default object
const statsService = {
    // Admin stats
    getAdminStats,
   
};

export default statsService;