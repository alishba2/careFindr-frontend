import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-phone-input-2/lib/style.css';

import { RegistrationStep } from "./components/pages/registerFacility";
import { VerifyOtp } from "./components/pages/verifyOtp";
import { Login } from "./components/pages/login";
import { ForgotPassword } from "./components/pages/forgotPassword";
import { ResetPassword } from "./components/pages/resetPassword";
import AdminDashboard from "./components/AdminDashboard/dasboard";
import FacilityDashboard from "./components/FacilityDashboard/facilityDashboard";
import { AdminLogin } from "./components/pages/admin-login";
import { AdminRegister } from "./components/pages/admin-registration";
import { AuthProvider } from "./components/hook/auth";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { RedirectIfAuthenticated } from "./components/common/RedirectIfAuthenticated";
import FacilityDetail from "./components/AdminDashboard/facility-detail";
import DashboardHome from "./components/FacilityDashboard/dashboardHome";
import Services from "./components/FacilityDashboard/services";
import Referrals from "./components/FacilityDashboard/referrals";
import Feedback from "./components/FacilityDashboard/feedback";
import { FacilityInformation } from "./components/FacilityDashboard/facilityInformation";
import { DocumentUpload } from "./components/FacilityDashboard/documentUpload";
import Notifications from "./components/FacilityDashboard/notification";

import Users from "./components/AdminDashboard/users";
import Landing from "./components/pages/home";
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
                <Landing />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/register"
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
              <AdminDashboard />
            }
          />

          {/* Facility dashboard routes */}
          <Route
            path="/facility-dashboard"
            element={
              <ProtectedRoute>
                <FacilityDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="facility-info" element={<FacilityInformation />} />
            <Route path="service-capacity" element={<Services />} />
            <Route path="document-upload" element={<DocumentUpload />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support" element={<Feedback />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};