import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginFacility } from "../../services/auth.js";
import bgimg from "../../assets/medical.jpg";
import { Heart, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
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
  password: Yup.string().required("Password is required"),
});

export const Login = () => {
  const initialValues = {
    identifier: "",
    password: "",
  };

  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (values, { setStatus }) => {
    const loginData = {
      loginId: values.identifier,
      password: values.password,
    };

    try {
      const response = await loginFacility(loginData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("facilityType", response.facility.type.toLowerCase());
      setStatus(null);
      setLoginError(null);
      window.location.href = "/facility-dashboard"; // hard reload
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setStatus({ error: errorMessage });
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section (hidden on small screens) */}
      <div
        className="w-1/2 relative hidden md:flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* dark overlay */}

        <div className="relative z-10 text-white text-center px-8 py-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-md mx-auto">
            Join thousands of trusted medical professionals managing their facilities with ease and confidence.
          </p>

          <div className="flex flex-row items-center justify-center gap-10 text-xl sm:text-2xl font-semibold">
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-5xl">1000+</span>
              <span className="text-base sm:text-lg font-normal mt-2">Facilities Registered</span>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-5xl">94%</span>
              <span className="text-base sm:text-lg font-normal  mt-2">Success Rate</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} className="h-12 mr-2" alt="CareFindr Logo" />

          </div>
          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Access your CareFindr account
            </p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-6">
                {/* Error Message */}
                {status?.error && (
                  <div className="text-red-500 text-sm text-center">
                    {status.error}
                  </div>
                )}

                {/* Identifier Field */}
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm sm:text-base font-medium text-gray-700"
                  >
                    Phone or Email
                  </label>
                  <Field
                    name="identifier"
                    as={Input}
                    id="identifier"
                    className="mt-2 w-full h-12 px-4 text-base sm:text-[17px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarysolid"
                    placeholder="Enter phone or email"
                  />
                  <ErrorMessage
                    name="identifier"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm sm:text-base font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    as={Input}
                    id="password"
                    className="mt-2 w-full h-12 px-4 text-base sm:text-[17px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarysolid"
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="remember"
                      id="remember"
                      className="h-4 w-4 text-primarysolid focus:ring-primarysolid"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>


                  <Link
                    to="/forgot-password"
                    className="text-sm text-primarysolid hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-[16px] bg-primarysolid text-white font-semibold rounded-md hover:bg-primarysolid/90"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center">
                  <p className="text-sm sm:text-base text-gray-600">
                    Don’t have an account?{" "}
                  </p>

                  <Button
                    onClick={() => navigate("/register")}
                    className="order-1 mt-2 w-full h-12 text-[16px] bg-transparent  border-[2px] border-primarysolid text-primarysolid font-semibold rounded-md hover:bg-primarysolid/10 hover:bg-primarysolid hover:text-white"
                  >
                    Create Account
                  </Button>


                </div>
              </Form>
            )}
          </Formik>

          {/* Create Account */}

        </div>
      </div>
    </div>
  );
};
