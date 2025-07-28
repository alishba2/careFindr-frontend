import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { adminLogin } from "../../services/auth.js";
import logo from "../../assets/logo.png";

import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    SafetyOutlined,
    //   ShieldCheckOutlined,
    SettingOutlined,
    DashboardOutlined
} from "@ant-design/icons";

// Validation schema using Yup
const validationSchema = Yup.object({
    identifier: Yup.string()
        .test(
            "is-phone-or-email",
            "Please enter a valid phone number or email address",
            (value) => {
                if (!value) return false;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                return emailRegex.test(value) || phoneRegex.test(value);
            }
        )
        .required("Phone number or email is required"),
    password: Yup.string()
        .required("Password is required"),
});

export const AdminLogin = () => {
    // Initial form values
    const initialValues = {
        identifier: "",
        password: "",
    };

    // For navigation after successful login
    const navigate = useNavigate();

    // State for error messages and password visibility
    const [loginError, setLoginError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Handle form submission
    const handleSubmit = async (values, { setStatus, setSubmitting }) => {
        const loginData = {
            email: values.identifier,
            password: values.password,
        };
        try {
            const response = await adminLogin(loginData);

            console.log(response.token, "admin token is here");
            // Store token in localStorage (or use context/auth provider)
            localStorage.setItem("token", response.token);
            localStorage.setItem("adminData", response.admin)
            localStorage.setItem("userType", "admin")

            setStatus(null); // Clear any previous errors
            setLoginError(null);

            // Show success message

            // Redirect to dashboard or home page
            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 1000);
        } catch (error) {
            console.error("Login failed:", error);
            const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
            setStatus({ error: errorMessage });
            setLoginError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>


            <div className="relative w-full max-w-md z-10">

                  <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
                            <img src={logo} className="h-12 mr-2" alt="CareFindr Logo" />
                
                          </div>
                {/* Header Section */}

                
                <div className="text-center mb-8">

                    <p className="text-gray-600">Secure access to admin dashboard</p>
                </div>

                {/* Login Card */}
                <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                        {/* Admin Badge */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                                <SafetyOutlined className="text-blue-600" />
                                <span className="text-sm font-semibold text-primarysolid">Administrator Access</span>
                            </div>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, status, values }) => (
                                <Form className="space-y-6">
                                    {/* Error Alert */}
                                    {status && status.error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">!</span>
                                            </div>
                                            <div className="text-red-700 text-sm font-medium">
                                                {status.error}
                                            </div>
                                        </div>
                                    )}

                                    {/* Email/Phone Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Email or Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserOutlined className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Field
                                                name="identifier"
                                                as={Input}
                                                className="block w-full pl-10 pr-3 py-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                                placeholder="Enter your email or phone"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="identifier"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LockOutlined className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Field
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                as={Input}
                                                className="block w-full pl-10 pr-12 py-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeInvisibleOutlined className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <EyeTwoTone className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primarysolid  hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Authenticating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <DashboardOutlined />
                                                    <span>Access Dashboard</span>
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                    </CardContent>
                </Card>

             
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .bg-grid-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
};