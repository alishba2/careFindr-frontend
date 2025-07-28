import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFacility } from '../../services/facility';
import { getCurrentAdmin } from '../../services/admin';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState(''); // For facilities
  const [adminToken, setAdminToken] = useState(''); // For admins
  const [facilityType, setFacilityType] = useState(localStorage.getItem('facilityType') || 'Hospital');
  const [role, setRole] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || null);
  const [isPharmacy, setIsPharmacy] = useState(false);
  const [hasLab, setHasLab] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminAccessType, setAdminAccessType] = useState(null);

  const updateIsAmbulance = (value) => {
    setIsAmbulance(value);
  };

  // Get the active token based on user type
  const getActiveToken = () => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType === 'admin') {
      return adminToken || localStorage.getItem('adminToken') || '';
    } else {
      return token || localStorage.getItem('token') || '';
    }
  };

  // Initialize tokens from localStorage
  const initializeTokens = () => {
    const facilityToken = localStorage.getItem('token') || '';
    const adminTokenStored = localStorage.getItem('adminToken') || '';

    setToken(facilityToken);
    setAdminToken(adminTokenStored);

    return { facilityToken, adminTokenStored };
  };

  // Decode JWT and set role
  const decodeAndSetRole = (jwtToken) => {
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);
        console.log(decoded, "decoded role is here");
        setRole(decoded.role || null);

        // Set user type based on token data
        if (decoded.role === 'admin' || decoded.role === 'super-admin') {
          setUserType('admin');
          localStorage.setItem('userType', 'admin');
        } else {
          setUserType('facility');
          localStorage.setItem('userType', 'facility');
        }

        return decoded;
      } catch (err) {
        console.error('Error decoding token:', err);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
        return null;
      }
    } else {
      setRole(null);
      setUserType(null);
      localStorage.removeItem('userType');
      return null;
    }
  };

  // Fetch current admin data
  const fetchCurrentAdmin = async () => {
    try {
      const res = await getCurrentAdmin();
      console.log(res, "admin response here");
      if (res && res.admin) {
        setAdminAccessType(res?.admin?.accessType);
        setAuthData(res.admin);
        setRole(res.admin.role);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      // If admin fetch fails, might need to logout admin only
      if (error.status === 401 || error.status === 403) {
        logoutAdmin();
      }
    }
  };

  // Fetch facility data
  const fetchFacilityData = async () => {
    try {
      const res = await getFacility();
      if (res && res.facility) {
        setAuthData(res.facility);
        setFacilityType(res.facility.type);
        localStorage.setItem('facilityType', res.facility.type);

        // Set facility-specific states
        setIsPharmacy(res.facility.type === 'Pharmacy');
        setHasLab(res.facility.hasLab || false);
        setIsAmbulance(res.facility.type === 'Ambulance');
      }
    } catch (err) {
      console.error('Failed to fetch facility data:', err);
      // If facility fetch fails, might need to logout facility only
      if (err.status === 401 || err.status === 403) {
        logoutFacility();
      }
    }
  };

  // Main function to fetch auth data based on user type
  const fetchAuthData = async () => {
    const { facilityToken, adminTokenStored } = initializeTokens();
    const storedUserType = localStorage.getItem('userType');

    // Determine which token to use
    let activeToken = '';
    if (storedUserType === 'admin' && adminTokenStored) {
      activeToken = adminTokenStored;
    } else if (storedUserType === 'facility' && facilityToken) {
      activeToken = facilityToken;
    } else if (adminTokenStored) {
      // Fallback: if we have admin token, decode it to check
      const decoded = decodeAndSetRole(adminTokenStored);
      if (decoded && (decoded.role === 'admin' || decoded.role === 'super-admin')) {
        activeToken = adminTokenStored;
      }
    } else if (facilityToken) {
      // Fallback: if we have facility token
      activeToken = facilityToken;
    }

    if (!activeToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Decode token first to determine user type
      const decoded = decodeAndSetRole(activeToken);

      if (!decoded) {
        setLoading(false);
        return;
      }

      // Fetch data based on user type
      if (decoded.role === 'admin' || decoded.role === 'super-admin') {
        await fetchCurrentAdmin();
      } else {
        await fetchFacilityData();
      }
    } catch (error) {
      console.error('Error fetching auth data:', error);
      // Clear invalid data for current user type only
      if (userType === 'admin') {
        logoutAdmin();
      } else {
        logoutFacility();
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch between user types without logging out
  const switchUserType = (targetUserType) => {
    if (targetUserType === 'admin') {
      const adminTokenStored = localStorage.getItem('adminToken');
      if (adminTokenStored) {
        setUserType('admin');
        localStorage.setItem('userType', 'admin');
        decodeAndSetRole(adminTokenStored);
        fetchCurrentAdmin();
      }
    } else if (targetUserType === 'facility') {
      const facilityTokenStored = localStorage.getItem('token');
      if (facilityTokenStored) {
        setUserType('facility');
        localStorage.setItem('userType', 'facility');
        decodeAndSetRole(facilityTokenStored);
        fetchFacilityData();
      }
    }
  };

  // Watch for userType changes to fetch appropriate data
  useEffect(() => {
    if (userType === 'admin' && adminToken) {
      fetchCurrentAdmin();
    } else if (userType === 'facility' && token) {
      fetchFacilityData();
    }
  }, [userType, token, adminToken]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchAuthData();
  }, []);

  // Login function with support for both token types
  const login = (data, loginToken, loginUserType) => {
    // Determine user type
    let finalUserType = loginUserType;
    if (!finalUserType) {
      // Try to determine from data or token
      if (data && (data.role === 'admin' || data.role === 'super-admin')) {
        finalUserType = 'admin';
      } else {
        finalUserType = 'facility';
      }
    }

    // Set appropriate token based on user type (keep both tokens)
    if (finalUserType === 'admin') {
      setAdminToken(loginToken);
      localStorage.setItem('adminToken', loginToken);
      // Don't clear facility token - keep it for independent sessions
    } else {
      setToken(loginToken);
      localStorage.setItem('token', loginToken);
      // Don't clear admin token - keep it for independent sessions
    }

    setUserType(finalUserType);
    setAuthData(data);

    // Store user type
    localStorage.setItem('userType', finalUserType);

    // Decode and set role
    decodeAndSetRole(loginToken);

    // Set facility-specific data if it's a facility login
    if (finalUserType === 'facility' && data) {
      setFacilityType(data.type || 'Hospital');
      localStorage.setItem('facilityType', data.type || 'Hospital');
      setIsPharmacy(data.type === 'Pharmacy');
      setHasLab(data.hasLab || false);
      setIsAmbulance(data.type === 'Ambulance');
    }
  };

  // Admin-specific login function
  const loginAdmin = (adminData, adminTokenValue) => {
    login(adminData, adminTokenValue, 'admin');
  };

  // Facility-specific login function
  const loginFacility = (facilityData, facilityTokenValue) => {
    login(facilityData, facilityTokenValue, 'facility');
  };

  // Logout admin only
  const logoutAdmin = () => {
    // Clear admin-specific data
    setAdminToken('');
    setAdminAccessType(null);
    localStorage.removeItem('adminToken');

    // If currently viewing admin, try to switch to facility if available
    if (userType === 'admin') {
      const facilityTokenStored = localStorage.getItem('token');
      if (facilityTokenStored) {
        // Switch to facility view
        setUserType('facility');
        localStorage.setItem('userType', 'facility');
        decodeAndSetRole(facilityTokenStored);
        fetchFacilityData();
      } else {
        // No facility token available, clear everything
        setAuthData(null);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
    }
    // If currently viewing facility, don't change anything
  };

  // Logout facility only
  const logoutFacility = () => {
    // Clear facility-specific data
    setToken('');
    setFacilityType('Hospital');
    setIsPharmacy(false);
    setHasLab(false);
    setIsAmbulance(false);
    localStorage.removeItem('token');
    localStorage.removeItem('facilityType');

    // If currently viewing facility, try to switch to admin if available
    if (userType === 'facility') {
      const adminTokenStored = localStorage.getItem('adminToken');
      if (adminTokenStored) {
        // Switch to admin view
        setUserType('admin');
        localStorage.setItem('userType', 'admin');
        decodeAndSetRole(adminTokenStored);
        fetchCurrentAdmin();
      } else {
        // No admin token available, clear everything
        setAuthData(null);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
    }
    // If currently viewing admin, don't change anything
  };

  // Full logout (clears everything)
  const logout = () => {
    setAuthData(null);
    setToken('');
    setAdminToken('');
    setFacilityType('Hospital');
    setRole(null);
    setUserType(null);
    setIsPharmacy(false);
    setHasLab(false);
    setIsAmbulance(false);
    setLoading(false);
    setAdminAccessType(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('facilityType');
    localStorage.removeItem('userType');
  };

  // Update auth data (useful for profile updates)
  const updateAuthData = (newData) => {
    setAuthData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const activeToken = getActiveToken();
    return !!(activeToken && authData);
  };

  // Check if admin is logged in
  const isAdminLoggedIn = () => {
    return !!(adminToken || localStorage.getItem('adminToken'));
  };

  // Check if facility is logged in
  const isFacilityLoggedIn = () => {
    return !!(token || localStorage.getItem('token'));
  };

  // Check if user is admin
  const isAdmin = () => {
    return role === 'admin' || role === 'super-admin';
  };

  // Check if user is facility
  const isFacility = () => {
    return userType === 'facility' && !isAdmin();
  };

  // Get current auth token (useful for API calls)
  const getCurrentToken = () => {
    return getActiveToken();
  };

  const contextValue = {
    // Auth state
    authData,
    token, // Facility token
    adminToken, // Admin token
    role,
    userType,
    loading,

    // Facility-specific state
    facilityType,
    isPharmacy,
    hasLab,
    isAmbulance,
    adminAccessType,

    // Actions
    login,
    loginAdmin, // Specific admin login
    loginFacility, // Specific facility login
    logout, // Full logout
    logoutAdmin, // Admin-only logout
    logoutFacility, // Facility-only logout
    switchUserType, // Switch between user types
    fetchAuthData,
    updateAuthData,
    updateIsAmbulance,

    // Setters (if needed)
    setAuthData,
    setFacilityType,
    setIsPharmacy,
    setHasLab,

    // Utility functions
    isAuthenticated,
    isAdmin,
    isFacility,
    isAdminLoggedIn,
    isFacilityLoggedIn,
    getCurrentToken,
    getActiveToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};