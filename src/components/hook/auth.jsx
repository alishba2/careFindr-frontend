import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFacility } from '../../services/facility';
import { jwtDecode } from 'jwt-decode';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [facilityType, setFacilityType] = useState(localStorage.getItem('facilityType') || 'Hospital');
  const [role, setRole] = useState(null);
  const [isPharmacy, setIsPharmacy] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);

  const updateIsAmbulance = (value) => {
    setIsAmbulance(value);
  };

  // Decode JWT and set role
  const decodeAndSetRole = (jwtToken) => {
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);
        console.log(decoded,"decode role is here");
        setRole(decoded.role || null);
      } catch (err) {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  };

  // Fetch auth data on mount if token exists
  const fetchAuthData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const res = await getFacility();
        setAuthData(res.facility);
        setFacilityType(res.facility.type);
        localStorage.setItem('facilityType', res.facility.type);
        decodeAndSetRole(storedToken);
      } catch (err) {
        console.error('Failed to fetch facility data:', err);
        setAuthData(null);
        setToken('');
        setFacilityType('Hospital');
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('facilityType');
      }
    } else {
      setRole(null);
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  // Watch token changes to decode role
  useEffect(() => {
    decodeAndSetRole(token);
  }, [token]);

  const login = (data) => {
    setAuthData(data);
    const storedToken = localStorage.getItem('token') || '';
    setToken(storedToken);
    setFacilityType(localStorage.getItem('facilityType') || 'Hospital');
    decodeAndSetRole(storedToken);
  };

  const logout = () => {
    setAuthData(null);
    setToken('');
    setFacilityType('Hospital');
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('facilityType');
  };

  return (
    <AuthContext.Provider value={{ role,authData, login, logout, facilityType, fetchAuthData, setAuthData, updateIsAmbulance, isAmbulance, token, role }}>
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