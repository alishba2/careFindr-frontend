import axios from './axiosConfig';

let backendUrl = import.meta.env.VITE_APP_BASE_URL ;
export const updateFacilityServices = async (services) => {

    try {
        console.log("Updating facility services with payload:", services);
        const response = await axios.put(`${backendUrl}/api/facilities/services`, services, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error registering facility:", error);
        throw error;
    }
};

export const getFacility = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/facility`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
}

export const getFacilitiesByType = async ({ type }) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/by-type?type=${type}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
}
export const editServices = async ({ type }) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/facilities/edit-services`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
}


export const editFacility = async (facility) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/facilities/edit`, facility);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
}
