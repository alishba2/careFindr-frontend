import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFacility } from '../../services/facility';
import { getCurrentAdmin } from '../../services/admin';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState('');
  const [adminToken, setAdminToken] = useState('');
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

  const getActiveToken = () => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType === 'admin') {
      return adminToken || localStorage.getItem('adminToken') || '';
    } else {
      return token || localStorage.getItem('token') || '';
    }
  };

  const initializeTokens = () => {
    const facilityToken = localStorage.getItem('token') || '';
    const adminTokenStored = localStorage.getItem('token') || '';

    setToken(facilityToken);
    setAdminToken(adminTokenStored);

    return { facilityToken, adminTokenStored };
  };

  const decodeAndSetRole = (jwtToken) => {
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);
        console.log(decoded, "decoded role is here");
        setRole(decoded.role || null);

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
      if (error.status === 401 || error.status === 403) {
        logoutAdmin();
      }
    }
  };

  const fetchFacilityData = async () => {
    try {
      const res = await getFacility();
      if (res && res.facility) {
        setAuthData(res.facility);
        setFacilityType(res.facility.type);
        localStorage.setItem('facilityType', res.facility.type);

        setIsPharmacy(res.facility.type === 'Pharmacy');
        setHasLab(res.facility.hasLab || false);
        setIsAmbulance(res.facility.type === 'Ambulance');
      }
    } catch (err) {
      console.error('Failed to fetch facility data:', err);
      if (err.status === 401 || err.status === 403) {
        logoutFacility();
      }
    }
  };

  const fetchAuthData = async () => {
    const { facilityToken, adminTokenStored } = initializeTokens();
    const storedUserType = localStorage.getItem('userType');

    let activeToken = '';
    if (storedUserType === 'admin' && adminTokenStored) {
      activeToken = adminTokenStored;
    } else if (storedUserType === 'facility' && facilityToken) {
      activeToken = facilityToken;
    } else if (adminTokenStored) {
      const decoded = decodeAndSetRole(adminTokenStored);
      if (decoded && (decoded.role === 'admin' || decoded.role === 'super-admin')) {
        activeToken = adminTokenStored;
      }
    } else if (facilityToken) {
      activeToken = facilityToken;
    }

    if (!activeToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const decoded = decodeAndSetRole(activeToken);

      if (!decoded) {
        setLoading(false);
        return;
      }

      if (decoded.role === 'admin' || decoded.role === 'super-admin') {
        await fetchCurrentAdmin();
      } else {
        await fetchFacilityData();
      }
    } catch (error) {
      console.error('Error fetching auth data:', error);
      if (userType === 'admin') {
        logoutAdmin();
      } else {
        logoutFacility();
      }
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (userType === 'admin' && adminToken) {
      fetchCurrentAdmin();
    } else if (userType === 'facility' && token) {
      fetchFacilityData();
    }
  }, [userType, token, adminToken]);

  useEffect(() => {
    fetchAuthData();
  }, []);

  const login = (data, loginToken, loginUserType) => {
    let finalUserType = loginUserType;
    if (!finalUserType) {
      if (data && (data.role === 'admin' || data.role === 'super-admin')) {
        finalUserType = 'admin';
      } else {
        finalUserType = 'facility';
      }
    }

    if (finalUserType === 'admin') {
      setAdminToken(loginToken);
      localStorage.setItem('adminToken', loginToken);
    } else {
      setToken(loginToken);
      localStorage.setItem('token', loginToken);
    }

    setUserType(finalUserType);
    setAuthData(data);

    localStorage.setItem('userType', finalUserType);

    decodeAndSetRole(loginToken);

    if (finalUserType === 'facility' && data) {
      setFacilityType(data.type || 'Hospital');
      localStorage.setItem('facilityType', data.type || 'Hospital');
      setIsPharmacy(data.type === 'Pharmacy');
      setHasLab(data.hasLab || false);
      setIsAmbulance(data.type === 'Ambulance');
    }
  };

  const loginAdmin = async (adminData, adminTokenValue) => {
    setAdminToken(adminTokenValue);
    localStorage.setItem('adminToken', adminTokenValue);
    
    setUserType('admin');
    localStorage.setItem('userType', 'admin');
    
    setAuthData(adminData);
    
    decodeAndSetRole(adminTokenValue);
    
    if (adminData) {
      setRole(adminData.role);
      setAdminAccessType(adminData.accessType || null);
    }
    
    try {
      await fetchCurrentAdmin();
    } catch (error) {
      console.error('Error fetching fresh admin data:', error);
    }
  };

  const loginFacility = (facilityData, facilityTokenValue) => {
    login(facilityData, facilityTokenValue, 'facility');
  };

  const logoutAdmin = () => {
    setAdminToken('');
    setAdminAccessType(null);
    localStorage.removeItem('adminToken');

    if (userType === 'admin') {
      const facilityTokenStored = localStorage.getItem('token');
      if (facilityTokenStored) {
        setUserType('facility');
        localStorage.setItem('userType', 'facility');
        decodeAndSetRole(facilityTokenStored);
        fetchFacilityData();
      } else {
        setAuthData(null);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
    }
  };

  const logoutFacility = () => {
    setToken('');
    setFacilityType('Hospital');
    setIsPharmacy(false);
    setHasLab(false);
    setIsAmbulance(false);
    localStorage.removeItem('token');
    localStorage.removeItem('facilityType');

    if (userType === 'facility') {
      const adminTokenStored = localStorage.getItem('adminToken');
      if (adminTokenStored) {
        setUserType('admin');
        localStorage.setItem('userType', 'admin');
        decodeAndSetRole(adminTokenStored);
        fetchCurrentAdmin();
      } else {
        setAuthData(null);
        setRole(null);
        setUserType(null);
        localStorage.removeItem('userType');
      }
    }
  };

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

    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('facilityType');
    localStorage.removeItem('userType');
  };

  const updateAuthData = (newData) => {
    setAuthData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const isAuthenticated = () => {
    const activeToken = getActiveToken();
    return !!(activeToken && authData);
  };

  const isAdminLoggedIn = () => {
    return !!(adminToken || localStorage.getItem('adminToken'));
  };

  const isFacilityLoggedIn = () => {
    return !!(token || localStorage.getItem('token'));
  };

  const isAdmin = () => {
    return role === 'admin' || role === 'super-admin';
  };

  const isFacility = () => {
    return userType === 'facility' && !isAdmin();
  };

  const getCurrentToken = () => {
    return getActiveToken();
  };

  const contextValue = {
    authData,
    token,
    adminToken,
    role,
    userType,
    loading,
    facilityType,
    isPharmacy,
    hasLab,
    isAmbulance,
    adminAccessType,
    login,
    loginAdmin,
    loginFacility,
    logout,
    logoutAdmin,
    logoutFacility,
    switchUserType,
    fetchAuthData,
    updateAuthData,
    updateIsAmbulance,
    setAuthData,
    setFacilityType,
    setIsPharmacy,
    setHasLab,
    isAuthenticated,
    isAdmin,
    isFacility,
    isAdminLoggedIn,
    isFacilityLoggedIn,
    getCurrentToken,
    getActiveToken,
    setToken
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