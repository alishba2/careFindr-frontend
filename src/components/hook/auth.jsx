import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFacility } from '../../services/facility';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [facilityType, setFacilityType] = useState(localStorage.getItem('facilityType') || 'Hospital');

  const [isPharmacy, setIsPharmacy] = useState(false);
  const [isAmbulance, setIsAmbulance] = useState(false);


  const updateIsAmbulance = (value) => {
    setIsAmbulance(value);
  }


  // Fetch auth data on mount if token exists

  const fetchAuthData = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const res = await getFacility();
        setAuthData(res.facility);
        setFacilityType(res.facility.type); // Update facilityType from response
        localStorage.setItem('facilityType', res.facility.type); // Sync with localStorage
      } catch (err) {
        console.error('Failed to fetch facility data:', err);
        // Optionally clear token and authData on failure
        setAuthData(null);
        setToken('');
        setFacilityType('Hospital');
        localStorage.removeItem('token');
        localStorage.removeItem('facilityType');
      }
    }
  };

  useEffect(() => {

    fetchAuthData();
  }, []);

  // Debug authData changes (optional, remove in production)

  const login = (data) => {
    setAuthData(data);
    setToken(localStorage.getItem('token') || '');
    setFacilityType(localStorage.getItem('facilityType') || 'Hospital');
  };

  const logout = () => {
    setAuthData(null);
    setToken('');
    setFacilityType('Hospital');
    localStorage.removeItem('token');
    localStorage.removeItem('facilityType');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, facilityType, fetchAuthData, setAuthData, updateIsAmbulance,isAmbulance }}>
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