
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { verifyOtp, sendOtp } from "../../services/auth.js";
import { toast } from "react-toastify";

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
      navigate("/login")
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
    <main
      className="flex flex-col min-h-screen items-center relative bg-white"
      data-model-id="2:1264"
    >
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

      <div className="flex flex-col items-center gap-10 pt-10 pb-0 px-0 relative flex-1 self-stretch w-full grow">
        <div className="flex flex-col w-[768px] items-center gap-10 relative">
          <div className="flex flex-col items-center justify-center gap-2.5 relative self-stretch w-full">
            <div className="flex flex-col w-full items-start gap-2.5 relative">
              <h2 className="text-[30px] font-semibold text-fgtext-contrast tracking-[0.15px] leading-9">
                {isOtpVerified ? "Facility Registration Successful" : "Verify OTP"}
              </h2>
              <p className="text-base font-medium text-fgtext tracking-[0.08px] leading-6">
                {isOtpVerified
                  ? "Your facility has been successfully registered."
                  : `Enter the 6-digit OTP sent to your registered phone number${phoneNumber ? ` (${phoneNumber})` : ""}.`}
              </p>
            </div>
          </div>

          <Card className="w-full border-[#dfe3e6] shadow-box-shadow-shadow">
            <CardContent className="flex flex-col gap-6 p-5">
              {isOtpVerified ? (
                <div className="flex flex-col items-center gap-6">
                  <p className="text-[18px] font-medium text-fgtext-contrast tracking-[0.09px] leading-7">
                    Thank you for registering your facility!
                  </p>
                  <Button
                    onClick={handleOnboardNavigation}
                    className="h-12 w-full bg-primarysolid text-primaryon-primary rounded-xl hover:bg-primarysolid/90"
                  >
                    <span className="text-[15px] font-semibold tracking-[0.075px]">
                      Complete the Onboarding Process
                    </span>
                  </Button>
                </div>
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="flex flex-col gap-2.5">
                        <label
                          htmlFor="otp"
                          className="text-[14px] font-semibold text-fgtext-contrast tracking-[0.07px]"
                        >
                          OTP
                        </label>
                        <Field
                          name="otp"
                          as={Input}
                          id="otp"
                          className="h-12 px-4 py-3.5 text-[15px] font-medium text-fgsolid tracking-[0.075px] border-[#d7dbdf]"
                          placeholder="Enter 6-digit OTP"
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>

                      <div className="flex justify-center items-center mt-4">
                        {countdown > 0 ? (
                          <p className="text-base font-medium text-fgtext tracking-[0.08px] leading-6">
                            Resend OTP in {countdown} seconds
                          </p>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="h-12 w-full bg-primarysolid text-primaryon-primary rounded-xl hover:bg-primarysolid/90"
                          >
                            <span className="text-[15px] font-semibold tracking-[0.075px]">
                              {isResending ? "Resending..." : "Resend OTP"}
                            </span>
                          </Button>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 h-12 w-full bg-primarysolid text-primaryon-primary rounded-xl hover:bg-primarysolid/90"
                      >
                        <span className="text-[15px] font-semibold tracking-[0.075px]">
                          {isSubmitting ? "Verifying..." : "Verify OTP"}
                        </span>
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};