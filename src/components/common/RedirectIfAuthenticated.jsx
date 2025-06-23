// components/common/RedirectIfAuthenticated.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const facilityType = localStorage.getItem("facilityType");

  if (token && userType === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (token && facilityType) {
    return <Navigate to="/facility-dashboard" replace />;
  }

  return children;
};
