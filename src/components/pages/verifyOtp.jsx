import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { verifyOtp, sendOtp, verifyOtpFlexible, sendOtpFlexible, forgotPassword } from "../../services/auth.js";
import { toast } from "react-toastify";
import bgimg from "../../assets/medical.jpg";
import { Heart } from "lucide-react";

// Validation schema using Yup
const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const phoneNumber = location.state?.phoneNumber || "";
  const identifier = location.state?.identifier || phoneNumber;
  const type = location.state?.type || "phone";
  const context = location.state?.context || "registration"; // 'registration' or 'forgot-password'
  
  const [countdown, setCountdown] = useState(60);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Helper function to detect if identifier is email
  const isEmail = (str) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  };

  // Effect to handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Redirect if no identifier is provided
  useEffect(() => {
    if (!identifier) {
      toast.error("No contact information provided. Please try again.");
      navigate(context === 'forgot-password' ? '/forgot-password' : '/register');
    }
  }, [identifier, navigate, context]);

  // Initial form values
  const initialValues = {
    otp: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (context === 'forgot-password') {
        // For forgot password, use flexible verify
        await verifyOtpFlexible({ 
          identifier,
          otp: values.otp,
          type: 'password_reset'
        });
        
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Navigate to reset password with identifier
        navigate("/reset-password", { 
          state: { 
            identifier,
            otp: values.otp,
            type 
          } 
        });
      } else {
        // For regular registration, use the original verify
        if (phoneNumber) {
          await verifyOtp({ otp: values.otp, phone: phoneNumber });
        } else {
          await verifyOtpFlexible({ 
            identifier,
            otp: values.otp,
            type
          });
        }
        
        setIsOtpVerified(true);
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to verify OTP. Please try again.";
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!identifier) {
      toast.error("Contact information not available. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    
    setIsResending(true);
    
    try {
      if (context === 'forgot-password') {
        // For forgot password, use forgotPassword function
        await forgotPassword(identifier);
        toast.success(`New OTP sent to your ${isEmail(identifier) ? 'email' : 'phone number'}!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // For regular registration
        if (phoneNumber) {
          await sendOtp({ phone: phoneNumber });
        } else {
          await sendOtpFlexible({ identifier, type });
        }
        toast.success(`New OTP sent to your ${isEmail(identifier) ? 'email' : 'phone number'}!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      setCountdown(60);
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to resend OTP. Please try again.";
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsResending(false);
    }
  };

  // Handle navigation to onboard
  const handleOnboardNavigation = () => {
    navigate("/onboard");
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    navigate(context === 'forgot-password' ? '/forgot-password' : '/register');
  };

  // Get display text based on context
  const getDisplayText = () => {
    if (context === 'forgot-password') {
      return {
        title: "Verify OTP",
        subtitle: `Enter the 6-digit OTP sent to your ${isEmail(identifier) ? 'email' : 'phone number'}`,
        contact: identifier,
        leftTitle: "Reset Your Password",
        leftSubtitle: "Enter your OTP to reset your password and regain access to your CareFindr account."
      };
    } else {
      return {
        title: isOtpVerified ? "Facility Registration Successful" : "Verify OTP",
        subtitle: isOtpVerified 
          ? "Your facility has been successfully registered."
          : `Enter the 6-digit OTP sent to your registered phone number`,
        contact: phoneNumber || identifier,
        leftTitle: "Verify Your OTP",
        leftSubtitle: "Enter the OTP sent to your phone to complete your registration with CareFindr."
      };
    }
  };

  const displayText = getDisplayText();

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section (hidden on small screens) */}
      <div
        className="w-1/2 relative hidden md:flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* dark overlay */}
        <div className="relative z-10 text-white text-center px-8 py-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">{displayText.leftTitle}</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-md mx-auto">
            {displayText.leftSubtitle}
          </p>
          <div className="flex flex-row items-center justify-center gap-10 text-xl sm:text-2xl font-semibold">
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-5xl">1000+</span>
              <span className="text-base sm:text-lg font-normal mt-2">Facilities Registered</span>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-5xl">94%</span>
              <span className="text-base sm:text-lg font-normal mt-2">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 md:px-12 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="md:text-[27px] text-[22px] font-bold text-primarysolid cursor-pointer">
              <Heart className="md:w-[31px] md:h-[31px] w-[24px] h-[24px] inline mr-2" />
              CareFindr
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {displayText.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {displayText.subtitle}{displayText.contact ? ` (${displayText.contact})` : ""}.
            </p>
          </div>

          {/* Formik Form */}
          {isOtpVerified && context !== 'forgot-password' ? (
            <div className="space-y-6">
              <p className="text-base sm:text-[17px] font-medium text-gray-900 text-center">
                Thank you for registering your facility!
              </p>
              <Button
                onClick={handleOnboardNavigation}
                className="w-full h-12 text-[16px] bg-primarysolid text-white font-semibold rounded-md hover:bg-primarysolid/90"
              >
                Complete the Onboarding Process
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* OTP Field */}
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm sm:text-base font-medium text-gray-700"
                    >
                      OTP
                    </label>
                    <Field
                      name="otp"
                      as={Input}
                      id="otp"
                      className="mt-2 w-full h-12 px-4 text-base sm:text-[17px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarysolid"
                      placeholder="Enter 6-digit OTP"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Resend OTP */}
                  <div className="flex justify-center items-center">
                    {countdown > 0 ? (
                      <p className="text-sm sm:text-base text-gray-600">
                        Resend OTP in {countdown} seconds
                      </p>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="w-full h-12 text-[16px] bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
                      >
                        {isResending ? "Resending..." : "Resend OTP"}
                      </Button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-[16px] bg-primarysolid text-white font-semibold rounded-md hover:bg-primarysolid/90"
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>

                  {/* Back Button */}
                  <Button
                    type="button"
                    onClick={handleBackNavigation}
                    className="w-full h-12 text-[16px] bg-white text-primarysolid border-[2px] border-primarysolid font-semibold rounded-md hover:bg-primarysolid/10"
                  >
                    Back to {context === 'forgot-password' ? 'Forgot Password' : 'Registration'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};