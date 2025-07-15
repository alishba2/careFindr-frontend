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

// 5. Get facility by ID
export const getFacilityById = async (id) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/${id}`);
        console.log(response.data.facility, "response here");
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

// ========================= NEW ADMIN APIS ========================= //

// 8. Verify facility (Admin only)
export const verifyFacility = async (facilityId, verificationNotes = null) => {
    try {
        console.log(`Verifying facility ${facilityId}...`);
        const response = await axios.put(`${backendUrl}/api/facilities/${facilityId}/verify`, {
            verificationNotes
        });
        return response.data;
    } catch (error) {
        console.error("Error verifying facility:", error);
        throw error;
    }
};

// 9. Deactivate facility (Admin only)
export const deactivateFacility = async (facilityId, deactivationReason = null) => {
    try {
        console.log(`Deactivating facility ${facilityId}...`);
        const response = await axios.put(`${backendUrl}/api/facilities/${facilityId}/deactivate`, {
            deactivationReason
        });
        return response.data;
    } catch (error) {
        console.error("Error deactivating facility:", error);
        throw error;
    }
};

// 10. Reactivate facility (Admin only)
export const reactivateFacility = async (facilityId, reactivationNotes = null) => {
    try {
        console.log(`Reactivating facility ${facilityId}...`);
        const response = await axios.put(`${backendUrl}/api/facilities/${facilityId}/reactivate`, {
            reactivationNotes
        });
        return response.data;
    } catch (error) {
        console.error("Error reactivating facility:", error);
        throw error;
    }
};

// 11. Delete facility (Admin only) - Soft delete by default
export const deleteFacility = async (facilityId, hardDelete = false) => {
    try {
        console.log(`${hardDelete ? 'Hard' : 'Soft'} deleting facility ${facilityId}...`);
        const response = await axios.delete(`${backendUrl}/api/facilities/${facilityId}`, {
            params: { hardDelete }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting facility:", error);
        throw error;
    }
};

// ========================= HELPER FUNCTIONS ========================= //

// 12. Bulk facility operations (Admin only)
export const bulkVerifyFacilities = async (facilityIds, verificationNotes = null) => {
    try {
        const promises = facilityIds.map(id => verifyFacility(id, verificationNotes));
        const results = await Promise.allSettled(promises);
        
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;
        
        console.log(`Bulk verify completed: ${successful} successful, ${failed} failed`);
        return { successful, failed, results };
    } catch (error) {
        console.error("Error in bulk verify:", error);
        throw error;
    }
};

export const bulkDeactivateFacilities = async (facilityIds, deactivationReason = null) => {
    try {
        const promises = facilityIds.map(id => deactivateFacility(id, deactivationReason));
        const results = await Promise.allSettled(promises);
        
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;
        
        console.log(`Bulk deactivate completed: ${successful} successful, ${failed} failed`);
        return { successful, failed, results };
    } catch (error) {
        console.error("Error in bulk deactivate:", error);
        throw error;
    }
};

// 13. Get facilities by status filter
export const getFacilitiesByStatus = async (status, { page = 1, limit = 10 } = {}) => {
    try {
        const response = await axios.get(`${backendUrl}/api/facilities/all`, {
            params: { page, limit, status }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${status} facilities:`, error);
        throw error;
    }
};

// 14. Check facility status
export const checkFacilityStatus = async (facilityId) => {
    try {
        const facility = await getFacilityById(facilityId);
        return {
            id: facility._id,
            name: facility.name,
            status: facility.status,
            isVerified: facility.status === 'Verified',
            isActive: facility.status === 'Active',
            isDeactivated: facility.status === 'Deactivated',
            isDeleted: facility.status === 'Deleted',
            verifiedAt: facility.verifiedAt,
            deactivatedAt: facility.deactivatedAt,
            deletedAt: facility.deletedAt
        };
    } catch (error) {
        console.error("Error checking facility status:", error);
        throw error;
    }
};