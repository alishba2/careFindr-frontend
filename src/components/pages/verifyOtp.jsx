import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { verifyOtp, sendOtp } from "../../services/auth.js";
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
  const phoneNumber = location.state?.phoneNumber || "";
  const [countdown, setCountdown] = useState(60);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Effect to handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Initial form values
  const initialValues = {
    otp: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await verifyOtp({ otp: values.otp, phone: phoneNumber });
      setSubmitting(false);

      toast.success("OTP verified successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      setSubmitting(false);
      toast.error(error.response?.data?.message || "Failed to verify OTP. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!phoneNumber) {
      toast.error("Phone number not available. Please register again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setIsResending(true);
    try {
      await sendOtp({ phone: phoneNumber });
      setCountdown(60);
      toast.success("New OTP sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.", {
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

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section (hidden on small screens) */}
      <div
        className="w-1/2 relative hidden md:flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* dark overlay */}
        <div className="relative z-10 text-white text-center px-8 py-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Verify Your OTP</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-md mx-auto">
            Enter the OTP sent to your phone to complete your registration with CareFindr.
          </p>
          <div className="flex flex-row items-center justify-center gap-10 text-xl sm:text-2xl font-semibold">
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-5xl">500+</span>
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
              {isOtpVerified ? "Facility Registration Successful" : "Verify OTP"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {isOtpVerified
                ? "Your facility has been successfully registered."
                : `Enter the 6-digit OTP sent to your registered phone number${phoneNumber ? ` (${phoneNumber})` : ""}.`}
            </p>
          </div>

          {/* Formik Form */}
          {isOtpVerified ? (
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
                        className="w-full h-12 text-[16px] bg-primarysolid text-white font-semibold rounded-md hover:bg-primarysolid/90"
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
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};