import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// 1. Update services with FormData
export const updateFacilityServices = async (services) => {
    try {
        console.log("Updating facility services with payload:", services);
        const response = await axios.put(`${backendUrl}/api/facilities/services`, services, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating facility services:", error);
        throw error;
    }
};

// 2. Get logged-in facility's own data
export const getFacility = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/facility`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility services:", error);
        throw error;
    }
};

// 3. Get facilities by type
export const getFacilitiesByType = async ({ type, page = 1, limit = 10 }) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/by-type`, {
            params: { type, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching facilities by type:", error);
        throw error;
    }
};

// 4. Get all facilities (paginated)
export const getAllFacilities = async ({ page = 1, limit = 10 }) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/all`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all facilities:", error);
        throw error;
    }
};

// ✅ 5. Get facility by ID (NEW)
export const getFacilityById = async (id) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/${id}`);

        console.log(response.data.facility, "response4 hre");
        return response.data.facility;
    } catch (error) {
        console.error("Error fetching facility by ID:", error);
        throw error;
    }
};

// 6. Edit services (PATCH)
export const editServices = async (services) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/facilities/edit-services`, { services });
        return response.data;
    } catch (error) {
        console.error("Error editing services:", error);
        throw error;
    }
};

// 7. Edit facility profile
export const editFacility = async (facility) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/facilities/edit`, facility);
        return response.data;
    } catch (error) {
        console.error("Error editing facility:", error);
        throw error;
    }
};
