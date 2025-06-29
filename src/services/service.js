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

export const GetFacilityService = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/services`);
        console.log(response, "facility services here");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}