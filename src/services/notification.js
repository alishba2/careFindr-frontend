import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// ======================== EXISTING FUNCTION ========================
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

// ======================== NEW ADMIN FUNCTIONS ========================

// Get notifications with advanced filters (Admin)
export const getNotificationsWithFilters = async (filters = {}, page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications/filtered`, {
            params: { 
                page, 
                limit, 
                ...filters 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered notifications:", error);
        throw error;
    }
};

// Get admin unread notifications count
export const getAdminUnreadCount = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications/admin/unread-count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin unread count:", error);
        throw error;
    }
};

// Mark all notifications as admin read
export const markAllAsAdminRead = async () => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/admin/mark-all-read`);
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as admin read:", error);
        throw error;
    }
};

// Mark single notification as admin read
export const markNotificationAsAdminRead = async (notificationId) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/${notificationId}/admin-read`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as admin read:", error);
        throw error;
    }
};

// Mark multiple notifications as admin read
export const markMultipleAsAdminRead = async (notificationIds) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/multiple/admin-read`, {
            notificationIds
        });
        return response.data;
    } catch (error) {
        console.error("Error marking multiple notifications as admin read:", error);
        throw error;
    }
};

// Delete notification (Admin)
export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete(`${backendUrl}/api/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};

// ======================== FACILITY FUNCTIONS ========================

// Get notifications for a specific facility
export const getFacilityNotifications = async (facilityId, page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications/facility/${facilityId}`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching facility notifications:", error);
        throw error;
    }
};

// Get unread count for facility
export const getFacilityUnreadCount = async (facilityId) => {
    try {
        const response = await axios.get(`${backendUrl}/api/notifications/facility/${facilityId}/unread-count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility unread count:", error);
        throw error;
    }
};

// Mark all notifications as read for facility
export const markAllFacilityNotificationsAsRead = async (facilityId) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/facility/${facilityId}/mark-all-read`);
        return response.data;
    } catch (error) {
        console.error("Error marking all facility notifications as read:", error);
        throw error;
    }
};

// ======================== SHARED FUNCTIONS ========================

// Create notification
export const createNotification = async (facilityId, action) => {
    try {
        const response = await axios.post(`${backendUrl}/api/notifications`, {
            facilityId,
            action
        });
        return response.data;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Mark notification as read by facility
export const markNotificationAsRead = async (notificationId, facilityId) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/${notificationId}/read`, {
            facilityId
        });
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

// Mark multiple notifications as read by facility
export const markMultipleAsRead = async (notificationIds, facilityId) => {
    try {
        const response = await axios.patch(`${backendUrl}/api/notifications/multiple/read`, {
            notificationIds,
            facilityId
        });
        return response.data;
    } catch (error) {
        console.error("Error marking multiple notifications as read:", error);
        throw error;
    }
};


export const markNotificationAsReadLegacy = async (notificationId) => {
    try {
        const response = await axios.put(`${backendUrl}/api/notifications/mark-read/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read (legacy):", error);
        throw error;
    }
};

export const markAllAsReadLegacy = async (facilityId) => {
    try {
        const response = await axios.put(`${backendUrl}/api/notifications/mark-all-read/${facilityId}`);
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read (legacy):", error);
        throw error;
    }
};