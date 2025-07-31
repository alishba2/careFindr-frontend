import React from "react";
import { Button } from "../../components/button.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import bgimg from "../../assets/medical.jpg";
import { Heart } from "lucide-react";
import { resetPassword } from "../../services/auth.js";

// Validation schema
const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const identifier = location.state?.identifier || "";
  const otp = location.state?.otp || "";
  const type = location.state?.type || ""; // optional if you need it

  // Form initial values
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!identifier || !otp) {
      toast.error("Missing identifier or OTP", {
        position: "top-right",
        autoClose: 5000,
      });
      setSubmitting(false);
      return;
    }

    try {
      await resetPassword(identifier, otp, values.newPassword);

      toast.success("Password reset successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to reset password", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section */}
      <div
        className="w-1/2 relative hidden md:flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white text-center px-8 py-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-md mx-auto">
            Set a new secure password for your CareFindr account.
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
            <div
              className="md:text-[27px] text-[22px] font-bold text-primarysolid cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Heart className="md:w-[31px] md:h-[31px] w-[24px] h-[24px] inline mr-2" />
              CareFindr
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Set a new password for the account linked to {identifier}.
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
                {/* New Password field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm sm:text-base font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <Field
                    name="newPassword"
                    type="password"
                    as={Input}
                    id="newPassword"
                    className="mt-2 w-full h-12 px-4 text-base sm:text-[17px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarysolid"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Confirm Password field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm sm:text-base font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    as={Input}
                    id="confirmPassword"
                    className="mt-2 w-full h-12 px-4 text-base sm:text-[17px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primarysolid"
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
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
                  {isSubmitting ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
