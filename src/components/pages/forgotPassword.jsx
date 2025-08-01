import React from "react";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import bgimg from "../../assets/medical.jpg";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/auth.js";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  identifier: Yup.string()
    .required("Phone number or email is required")
    .test(
      "is-valid-phone-or-email",
      "Enter a valid email or phone number (phone must include country code like +2343001234567)",
      (value) => {
        if (!value) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const internationalPhoneRegex = /^\+\d{10,15}$/;

        return emailRegex.test(value) || internationalPhoneRegex.test(value);
      }
    ),
});


export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    identifier: "",
  };

  // Helper function to detect if identifier is email or phone
  const isEmail = (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { identifier } = values;

      console.log("Sending OTP for password reset to:", identifier);

      // Use the forgotPassword API function
      const response = await forgotPassword(identifier);

      // Navigate to OTP verification with the identifier and context
      navigate("/verify-otp", {
        state: {
          identifier: identifier,
          type: response.type || (isEmail(identifier) ? 'email' : 'phone'),
          context: 'forgot-password' // This helps the OTP page know the context
        }
      });

      // Show success message based on type
      if (isEmail(identifier)) {
        toast.success("OTP sent to your email address!");
      } else {
        toast.success("OTP sent to your phone number!");
      }

    } catch (error) {
      console.error("Error sending OTP:", error);

      // Handle different error types
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.error;

        if (statusCode === 404) {
          toast.error("No account found with this email or phone number.");
        } else if (statusCode === 400) {
          toast.error(errorMessage || "Please enter a valid email or phone number.");
        } else if (statusCode === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(errorMessage || "Failed to send OTP. Please try again.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
          <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} className="h-12 mr-2" alt="CareFindr Logo" />
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Enter your email or phone number to reset your password
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

                <p className="mt-2 text-sm sm:text-base text-center text-gray-600">
                  Remember your password? <Link to="/login" className="text-primarysolid hover:underline">Login</Link>
                </p>

                <Button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-12 text-[16px] bg-white text-primarysolid border-[2px] border-primarysolid font-semibold rounded-md hover:bg-primarysolid/10"
                >
                  Back to Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};