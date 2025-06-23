import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
import { getFacility } from '../../services/facility';
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null); 
  const [token, setToken] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('token');
    setToken(token);
  },[])

  const login = (data) => {
    setAuthData(data);
  };

useEffect(() => {
  const fetchAuthData = async () => {
    const token = localStorage.getItem('token');
    setToken(token);

    if (token) {
      try {
        const res = await getFacility(); 
        console.log(res, "response here");
        setAuthData(res.services);
      } catch (err) {
        console.error("Failed to fetch facility data", err);
      }
    }
  };

  fetchAuthData();
}, []);

useEffect(()=>{

    console.log(authData, "auth data is here");

},[authData])

  const logout = () => {
    setAuthData(null);
    // localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
