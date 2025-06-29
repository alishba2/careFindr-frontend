import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { RegistrationStep } from "./components/pages/registerFacility";
import { VerifyOtp } from "./components/pages/verifyOtp";
import { Login } from "./components/pages/login";
import { ForgotPassword } from "./components/pages/forgotPassword";
import { ResetPassword } from "./components/pages/resetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminDashboard from "./components/AdminDashboard/dasboard";
import FacilityDashboard from "./components/FacilityDashboard/facilityDashboard";
import { AdminLogin } from "./components/pages/admin-login";
import { AdminRegister } from "./components/pages/admin-registration";

import { AuthProvider } from "./components/hook/auth";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

import { RedirectIfAuthenticated } from "./components/common/RedirectIfAuthenticated";
import FacilityDetail from "./components/AdminDashboard/facility-detail";
import 'react-phone-input-2/lib/style.css';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public routes with redirect if already logged in */}
          <Route
            path="/"
            element={
              <RedirectIfAuthenticated>
                <RegistrationStep />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <RedirectIfAuthenticated>
                <VerifyOtp />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectIfAuthenticated>
                <ForgotPassword />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/reset-password"
            element={
              <RedirectIfAuthenticated>
                <ResetPassword />
              </RedirectIfAuthenticated>
            }
          />

          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />



          {/* Facility dashboard route */}
          <Route
            path="/facility-dashboard"
            element={
              // <ProtectedRoute
              //   allowedRoles={[
              //     "Hospital",
              //     "Laboratory",
              //     "Pharmacy",
              //     "Ambulance",
              //   ]} // Add all valid facility types
              // >
                <FacilityDashboard />
             
            }
          />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
