import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFacility } from '../../services/facility';
import { getCurrentAdmin } from '../../services/admin';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [facilityType, setFacilityType] = useState(localStorage.getItem('facilityType') || 'Hospital');
  const [role, setRole] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem('userType') || null);
  const [isPharmacy, setIsPharmacy] = useState(false);
  const [hasLab, setHasLab] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminAccessType, setAdminAccessType] = useState(null); // Default to 'admin'

  const updateIsAmbulance = (value) => {
    setIsAmbulance(value);
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
      } catch (err) {
        console.error('Error decoding token:', err);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
    } else {
      setRole(null);
      setUserType(null);
      localStorage.removeItem('userType');
    }
  };

  // Fetch current admin data
  const fetchCurrentAdmin = async () => {
    try {
      const res = await getCurrentAdmin();
      console.log(res, "respons ere");
      if (res && res.admin) {
        setAdminAccessType(res?.admin?.accessType)
        setAuthData(res.admin);
        setRole(res.admin.role);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      // If admin fetch fails, might need to logout
      if (error.status === 401 || error.status === 403) {
        logout();
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
      return;
      // If facility fetch fails, might need to logout
      if (err.status === 401 || err.status === 403) {
        logout();
      }
    }
  };

  // Main function to fetch auth data based on user type
  const fetchAuthData = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Decode token first to determine user type
      decodeAndSetRole(storedToken);
      
      // Fetch data based on user type
      if (storedUserType === 'admin' || role === 'admin' || role === 'super-admin') {
        await fetchCurrentAdmin();
      } else {
        await fetchFacilityData();
      }
    } catch (error) {
      console.error('Error fetching auth data:', error);
      // Clear invalid data
      setAuthData(null);
      setToken('');
      setRole(null);
      setUserType(null);
    } finally {
      setLoading(false);
    }
  };

  // Watch for userType changes to fetch appropriate data
  useEffect(() => {
    if (userType === 'admin' && token) {
      fetchCurrentAdmin();
    } else if (userType === 'facility' && token) {
      fetchFacilityData();
    }
  }, [userType, token]);

  // Initial data fetch on mount
  useEffect(() => {
    fetchAuthData();
  }, []);

  // Watch token changes to decode role
  useEffect(() => {
    if (token) {
      decodeAndSetRole(token);
    }
  }, [token]);

  // Login function
  const login = (data, loginToken, loginUserType) => {
    // Set token and user type
    const finalToken = loginToken || localStorage.getItem('token') || '';
    const finalUserType = loginUserType || localStorage.getItem('userType') || 'facility';
    
    setToken(finalToken);
    setUserType(finalUserType);
    setAuthData(data);
    
    // Store in localStorage
    if (finalToken) {
      localStorage.setItem('token', finalToken);
    }
    localStorage.setItem('userType', finalUserType);
    
    // Decode and set role
    decodeAndSetRole(finalToken);
    
    // Set facility-specific data if it's a facility login
    if (finalUserType === 'facility' && data) {
      setFacilityType(data.type || 'Hospital');
      localStorage.setItem('facilityType', data.type || 'Hospital');
      setIsPharmacy(data.type === 'Pharmacy');
      setHasLab(data.hasLab || false);
      setIsAmbulance(data.type === 'Ambulance');
    }
  };

  // Logout function
  const logout = () => {
    setAuthData(null);
    setToken('');
    setFacilityType('Hospital');
    setRole(null);
    setUserType(null);
    setIsPharmacy(false);
    setHasLab(false);
    setIsAmbulance(false);
    setLoading(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
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
    return !!(token && authData);
  };

  // Check if user is admin
  const isAdmin = () => {
    return role === 'admin' || role === 'super-admin';
  };

  // Check if user is facility
  const isFacility = () => {
    return userType === 'facility' && !isAdmin();
  };

  const contextValue = {
    // Auth state
    authData,
    token,
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
    logout,
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