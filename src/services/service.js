import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

export const FacilityServices = async (services) => {
    try {
        console.log("Updating facility services with payload:", services);
        const response = await axios.put(`${backendUrl}/api/services/createOrUpdate`, services);
        return response.data;
    } catch (error) {
        console.error("Error updating facility services:", error);
        throw error;
    }
};

export const GetFacilityService = async (facilityId) => {
    try {
        const response = await axios.get(`${backendUrl}/api/services/${facilityId}`);
        console.log(response, "facility services here");
        return response.data;
    }
    catch (error) {
        throw error;
    }
};

export const GetFacilityServiceFiltered = async (facilityId) => {
    try {
        const response = await axios.get(`${backendUrl}/api/services/${facilityId}/filtered`);
        console.log(response, "filtered facility services here");
        return response.data;
    }
    catch (error) {
        console.error("Error getting filtered facility services:", error);
        throw error;
    }
};