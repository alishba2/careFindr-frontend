import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginFacility } from "../../services/auth.js";
import { toast } from "react-toastify";

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

export const Login = () => {
  // Initial form values
  const initialValues = {
    identifier: "",
    password: "",
  };

  // For navigation after successful login
  const navigate = useNavigate();

  // State for error messages
  const [loginError, setLoginError] = useState(null);

  // Handle form submission
  const handleSubmit = async (values, { setStatus }) => {
    const loginData = {
      loginId: values.identifier,
      password: values.password,
    };
    try {
      const response = await loginFacility(loginData);
      // Store token in localStorage (or use context/auth provider)
      localStorage.setItem("token", response.token);
      setStatus(null); // Clear any previous errors
      setLoginError(null);
      // Redirect to dashboard or home page

      localStorage.setItem("facilityType", response.facility.type.toLowerCase());

      if (response.facility.onBoardingCompleted) {
        navigate("/facility-dashboard");
      } else {
        navigate("/onboarding");
      }

    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      setStatus({ error: errorMessage });
      setLoginError(errorMessage);
    }
  };

  return (
    <main
      className="flex flex-col min-h-screen items-center relative bg-white"
      data-model-id="2:1264"
    >
      {/* Header */}
      <header className="flex w-full h-20 items-center justify-around px-20 py-0 relative bg-bgdefault-bg">
        <div className="flex items-center gap-[775px] relative flex-1 grow">
          <div className="inline-flex items-center gap-10 relative flex-[0_0_auto]">
            <div className="relative w-[83px] h-9">
              <h1 className="text-4xl font-bold text-primarysolid tracking-[-0.36px]">
                Logo
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col items-center gap-10 pt-10 pb-0 px-0 relative flex-1 self-stretch w-full grow">
        <div className="flex flex-col w-[480px] items-center gap-6 relative">
          {/* Title section */}
          <div className="flex flex-col items-center justify-center gap-2.5 relative self-stretch w-full">
            <div className="flex flex-col w-full items-start gap-2.5 relative">
              <h2 className="text-[30px] font-semibold text-fgtext-contrast tracking-[0.15px] leading-9">
                Login
              </h2>
              <p className="text-base font-medium text-fgtext tracking-[0.08px] leading-6">
                Sign in to your account using your phone number or email and password.
              </p>
            </div>
          </div>

          {/* Form card */}
          <Card className="w-full border-[#dfe3e6] shadow-rounded-xl">
            <CardContent className="flex flex-col gap-6 p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, status }) => (
                  <Form>
                    <div className="flex flex-col gap-4">
                      {/* Display error message if login fails */}
                      {status && status.error && (
                        <div className="text-red-500 text-[14px] text-center">
                          {status.error}
                        </div>
                      )}

                      {/* Identifier field */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="identifier"
                          className="text-[14px] font-semibold text-fgtext-contrast tracking-[0.07px]"
                        >
                          Phone Number or Email
                        </label>
                        <Field
                          name="identifier"
                          as={Input}
                          id="identifier"
                          className="h-12 px-4 py-3.5 text-[15px] font-medium text-fgsolid tracking-[0.075px] border-[#d7dbdf]"
                          placeholder="Enter phone number or email"
                        />
                        <ErrorMessage
                          name="identifier"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>

                      {/* Password field */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="password"
                          className="text-[14px] font-semibold text-fgtext-contrast tracking-[0.07px]"
                        >
                          Password
                        </label>
                        <Field
                          name="password"
                          type="password"
                          as={Input}
                          id="password"
                          className="h-12 px-4 py-3.5 text-[15px] font-medium text-fgsolid tracking-[0.075px] border-[#d7dbdf]"
                          placeholder="Enter password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>
                    </div>

                    {/* Forgot Password link */}
                    <div className="flex justify-end mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-[14px] font-medium text-primarysolid hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 w-full bg-primarysolid text-primaryon-primary rounded-xl hover:bg-primarysolid/90 mt-4"
                    >
                      <span className="text-[15px] font-semibold tracking-[0.075px]">
                        {isSubmitting ? "Logging in..." : "Login"}
                      </span>
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};