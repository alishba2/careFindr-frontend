import React from "react";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import bgimg from "../../assets/medical.jpg";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { sendOtp } from "../../services/auth.js";

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
});

export const ForgotPassword = () => {
  // Initial form values
  const initialValues = {
    identifier: "",
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Forgot Password submitted:", values);
    setSubmitting(false);
    
    toast.success("OTP sent to your phone number or email!");
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-md mx-auto">
            Securely reset your password and regain access to your CareFindr account with ease.
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Enter your phone number or email to receive an OTP for password reset.
            </p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-[16px] bg-primarysolid text-white font-semibold rounded-md hover:bg-primarysolid/90"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};