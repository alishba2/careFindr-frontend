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

// Get detailed facility statistics with filters
export const getDetailedFacilityStats = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                queryParams.append(key, filters[key]);
            }
        });
        
        const queryString = queryParams.toString();
        const url = queryString ? 
            `${backendUrl}/api/admin/stats/facilities?${queryString}` : 
            `${backendUrl}/api/admin/stats/facilities`;
            
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching detailed facility stats:", error);
        throw error;
    }
};

// Get time-based statistics (daily, weekly, monthly)
export const getTimeBasedStats = async (period = 'daily', days = 30) => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/time-based`, {
            params: { period, days }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching time-based stats:", error);
        throw error;
    }
};

// Get quick stats for admin dashboard
export const getAdminQuickStats = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/quick`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin quick stats:", error);
        throw error;
    }
};

// ===== FACILITY STATISTICS SERVICES =====

// Get quick stats for dashboard cards (from facility routes)
export const getQuickStats = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/stats/quick`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quick stats:", error);
        throw error;
    }
};

// Get facility distribution by type and status
export const getFacilityDistribution = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/stats/distribution`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility distribution:", error);
        throw error;
    }
};

// ===== ENHANCED STATISTICS SERVICES =====

// Get growth statistics for a specific period
export const getGrowthStats = async (period = 'weekly') => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/time-based`, {
            params: { 
                period, 
                days: period === 'monthly' ? 365 : period === 'weekly' ? 84 : 30 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching growth stats:", error);
        throw error;
    }
};

// Get onboarding statistics
export const getOnboardingStats = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/facilities`, {
            params: { onboardingCompleted: false }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching onboarding stats:", error);
        throw error;
    }
};

// Get verification statistics
export const getVerificationStats = async () => {
    try {
        const [pendingVerifications, verifiedFacilities] = await Promise.all([
            axios.get(`${backendUrl}/api/admin/stats/facilities`, {
                params: { status: 'Pending' }
            }),
            axios.get(`${backendUrl}/api/admin/stats/facilities`, {
                params: { status: 'Verified' }
            })
        ]);
        
        return {
            pending: pendingVerifications.data,
            verified: verifiedFacilities.data
        };
    } catch (error) {
        console.error("Error fetching verification stats:", error);
        throw error;
    }
};

// Get facility type breakdown
export const getFacilityTypeBreakdown = async () => {
    try {
        const facilityTypes = ['Hospital', 'Laboratory', 'Pharmacy', 'Ambulance', 'Insurance', 'SpecialistClinic', 'Blood Bank'];
        
        const typePromises = facilityTypes.map(type => 
            axios.get(`${backendUrl}/api/admin/stats/facilities`, {
                params: { type }
            })
        );
        
        const results = await Promise.all(typePromises);
        
        const breakdown = {};
        facilityTypes.forEach((type, index) => {
            breakdown[type] = results[index].data;
        });
        
        return {
            message: 'Facility type breakdown retrieved successfully',
            breakdown
        };
    } catch (error) {
        console.error("Error fetching facility type breakdown:", error);
        throw error;
    }
};

// Get recent activity stats
export const getRecentActivityStats = async (days = 7) => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/facilities`, {
            params: { 
                dateFrom: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recent activity stats:", error);
        throw error;
    }
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/overview`);
        
        if (response.data?.stats) {
            const { stats } = response.data;
            
            return {
                completionRate: stats.onboarding?.completionRate || 0,
                verificationRate: stats.documents?.verificationRate || 0,
                profileCompletionAvg: stats.profileCompletion?.average || 0,
                phoneVerificationRate: stats.verification?.phoneVerificationRate || 0,
                emailVerificationRate: stats.verification?.emailVerificationRate || 0,
                growthPercentage: stats.growth?.recentFacilities?.growthPercentage || 0
            };
        }
        
        return {};
    } catch (error) {
        console.error("Error fetching performance metrics:", error);
        throw error;
    }
};

// Get dashboard summary for admin overview
export const getDashboardSummary = async () => {
    try {
        console.log('Fetching dashboard summary...');
        
        const [overviewStats, quickStats, distributionStats] = await Promise.all([
            getAdminStats(),
            getQuickStats(),
            getFacilityDistribution()
        ]);
        
        console.log('Dashboard summary responses:', {
            overview: overviewStats,
            quickStats: quickStats,
            distribution: distributionStats
        });
        
        return {
            overview: overviewStats,
            quickStats: quickStats,
            distribution: distributionStats,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        throw error;
    }
};

// Get recent activity with better error handling
export const getRecentActivity = async (limit = 5) => {
    try {
        const response = await axios.get(`${backendUrl}/api/admin/stats/facilities`, {
            params: { 
                dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                limit
            }
        });
        
        console.log('Recent activity response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        throw error;
    }
};

// Export all services as default object
const statsService = {
    // Admin stats
    getAdminStats,
    getDetailedFacilityStats,
    getTimeBasedStats,
    getAdminQuickStats,
    
    // Facility stats
    getQuickStats,
    getFacilityDistribution,
    
    // Enhanced stats
    getGrowthStats,
    getOnboardingStats,
    getVerificationStats,
    getFacilityTypeBreakdown,
    getRecentActivityStats,
    getPerformanceMetrics,
    getDashboardSummary,
    getRecentActivity
};

export default statsService;