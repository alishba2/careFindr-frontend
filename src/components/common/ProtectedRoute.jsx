// components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const facilityType = localStorage.getItem("facilityType");

  const role = userType || facilityType;

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
