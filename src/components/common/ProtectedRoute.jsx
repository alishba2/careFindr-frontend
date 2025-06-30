// components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
