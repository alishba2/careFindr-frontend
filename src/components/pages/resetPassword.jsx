import React from "react";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export const ResetPassword = () => {
  // Initial form values
  const initialValues = {
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Reset Password submitted:", values);
    setSubmitting(false);
    alert("Password reset successful!");
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
                Reset Password
              </h2>
              <p className="text-base font-medium text-fgtext tracking-[0.08px] leading-6">
                Enter the OTP sent to your phone or email and set a new password.
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
                {({ isSubmitting }) => (
                  <Form>
                    <div className="flex flex-col gap-4">
                      {/* OTP field */}
                      <div className="flex flex-col gap-2">
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

                      {/* New Password field */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="newPassword"
                          className="text-[14px] font-semibold text-fgtext-contrast tracking-[0.07px]"
                        >
                          New Password
                        </label>
                        <Field
                          name="newPassword"
                          type="password"
                          as={Input}
                          id="newPassword"
                          className="h-12 px-4 py-3.5 text-[15px] font-medium text-fgsolid tracking-[0.075px] border-[#d7dbdf]"
                          placeholder="Enter new password"
                        />
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>

                      {/* Confirm Password field */}
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="confirmPassword"
                          className="text-[14px] font-semibold text-fgtext-contrast tracking-[0.07px]"
                        >
                          Confirm Password
                        </label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          as={Input}
                          id="confirmPassword"
                          className="h-12 px-4 py-3.5 text-[15px] font-medium text-fgsolid tracking-[0.075px] border-[#d7dbdf]"
                          placeholder="Confirm new password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 w-full bg-primarysolid text-primaryon-primary rounded-xl hover:bg-primarysolid/90 mt-4"
                    >
                      <span className="text-[15px] font-semibold tracking-[0.075px]">
                        Reset Password
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
