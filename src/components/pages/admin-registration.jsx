import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { createAdmin } from "../../services/admin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminRegister = () => {
  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      phone: Yup.string().required("Phone number is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: () => {}, // prevent default auto submission
  });

  const handleSubmit = async () => {
    if (!formik.isValid) {
      formik.handleSubmit(); // trigger validation errors display
      return;
    }

    const payload = {
      fullName: `${formik.values.firstName} ${formik.values.lastName}`,
      role: "admin",
      phone: formik.values.phone,
      email: formik.values.email,
      password: formik.values.password,
    };

    try {
      setLoading(true);
      const response = await createAdmin(payload);
      console.log("Admin created:", response);
      naviagte("/admin-login")

      // Optional: redirect or toast success
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.response.data.error)
      // Optional: show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-white">
      <header className="flex w-full h-20 items-center justify-between px-20 bg-bgdefault-bg">
        <div className="text-4xl font-bold text-primarysolid tracking-[-0.36px]">
          Logo
        </div>
      </header>

      <main className="flex flex-col items-center gap-10 py-10 w-full max-w-[768px] bg-[#DFE3E6]">
        <div className="w-full">
          <h1 className="text-[30px] font-semibold leading-9 tracking-[0.15px] text-fgtext-contrast">
            Create Your Admin Account
          </h1>
        </div>

        <form className="w-full ">
          <Card className="w-full border-[#dfe3e6] shadow-box-shadow-shadow">
            <CardContent className="p-5 space-y-4">
              {/* First and Last Name */}
              <div className="flex items-start gap-5 w-full">
                <div className="flex-1 space-y-2.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...formik.getFieldProps("firstName")}
                    placeholder="Enter your first name"
                    className="h-12 border-[#d7dbdf]"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...formik.getFieldProps("lastName")}
                    placeholder="Enter your last name"
                    className="h-12 border-[#d7dbdf]"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex h-12 items-center border border-[#d7dbdf] rounded-md overflow-hidden">
                  <div className="flex items-center gap-1 px-3 bg-gray-100 h-full">
                    <img
                      className="w-6 h-4 object-cover"
                      alt="Country flag"
                      src="https://c.animaapp.com/mc3puf2y2ZhdGN/img/image-1.png"
                    />
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    <span className="ml-1 text-sm text-gray-700">+234</span>
                  </div>
                  <Input
                    id="phone"
                    {...formik.getFieldProps("phone")}
                    type="tel"
                    placeholder="Enter phone number"
                    className="flex-1 h-full border-0 focus:ring-0 focus-visible:ring-0 rounded-none"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-sm">{formik.errors.phone}</div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter your email"
                  className="h-12 border-[#d7dbdf]"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                )}
              </div>

              {/* Passwords */}
              <div className="flex items-start gap-5 w-full">
                <div className="flex-1 space-y-2.5">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    placeholder="Enter a strong password"
                    className="h-12 border-[#d7dbdf]"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...formik.getFieldProps("confirmPassword")}
                    placeholder="Re-enter password to confirm"
                    className="h-12 border-[#d7dbdf]"
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="w-full mt-4">
            <Button
              type="button"
              className="w-full h-12 bg-primarysolid rounded-xl text-primaryon-primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Registering..." : "Submit & Complete Registration"}
            </Button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="text-center text-fgtext-muted text-sm">
          Already have an account?{" "}
          <a
            href="/admin-login"
            className="text-primarysolid font-medium hover:underline"
          >
            Sign In
          </a>
        </div>
      </main>
    </div>
  );
};
