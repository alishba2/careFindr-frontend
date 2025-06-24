import React, { useState } from "react";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { lgas } from "../../components/enums/lgas.jsx";
import { states } from "../enums/state.jsx";
import { useNavigate } from "react-router-dom";
import { lcdas } from "../enums/lcdas.jsx";
import { registerFacility } from "../../services/auth.js";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  facilityType: Yup.string().required("Facility type is required"),
  facilityName: Yup.string().required("Facility name is required"),
  contactEmail: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required"),
  secondaryPhone: Yup.string()
    .nullable(),
  whatsapp: Yup.string()
    .nullable(),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  lga: Yup.string().required("LGA is required"),
  lcda: Yup.string().when("state", {
    is: "Lagos",
    then: (schema) => schema.required("LCDA is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  registration: Yup.string().required("Registration number is required"),
  website: Yup.string().url("Invalid URL").nullable(),
  password: Yup.string().min(6, "Min 6 characters").required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

export const RegistrationStep = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [error, setError] = useState(null);

  const initialValues = {
    facilityType: "",
    facilityName: "",
    contactEmail: "",
    phoneNumber: "",
    secondaryPhone: "",
    whatsapp: "",
    address: "",
    state: "",
    lga: "",
    lcda: "",
    registration: "",
    website: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    // Prepend +234 to phone numbers if not already present
    const formatPhoneNumber = (number) => {
      if (!number) return undefined;
      return number.startsWith("+234") ? number : `+234${number.replace(/^\+234/, "")}`;
    };

    const facilityData = {
      name: values.facilityName,
      type: values.facilityType,
      email: values.contactEmail,
      phone: formatPhoneNumber(values.phoneNumber),
      secondaryPhone: formatPhoneNumber(values.secondaryPhone) || undefined,
      whatsapp: formatPhoneNumber(values.whatsapp) || undefined,
      address: values.address,
      state: values.state,
      lga: values.lga,
      lcda: values.lcda || undefined,
      registrationNumber: values.registration,
      website: values.website || undefined,
      password: values.password,
    };

    try {
      await registerFacility(facilityData);
      setSubmitting(false);
      toast.success("Facility registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/verify-otp", { state: { phoneNumber: facilityData.phone } });
    } catch (error) {
      setSubmitting(false);
      console.log("Registration error:", error);
      setError(error.response?.data?.error || "Failed to register facility. Please try again.");
    }
  };

  // Handle phone input to strip +234 for display but include it in value
  const handlePhoneInput = (e, setFieldValue, fieldName) => {
    let value = e.target.value;

    // Remove all non-digit characters
    value = value.replace(/\D/g, "");

    // Remove '234' if user types it
    if (value.startsWith("234")) {
      value = value.slice(3);
    }

    // Keep only the last 10 digits
    if (value.length > 10) {
      value = value.slice(-10);
    }

    setFieldValue(fieldName, value);
  };


  return (
    <main className="flex flex-col min-h-screen items-center bg-white mb-20">
      <header className="w-full h-20 flex items-center justify-between px-20 bg-bgdefault-bg">
        <h1 className="text-4xl font-bold text-primarysolid">Logo</h1>
      </header>

      <div className="flex flex-col w-full max-w-[768px] mt-10 px-4">
        <div className="mb-6">
          <h2 className="text-[30px] font-semibold text-fgtext-contrast">Facility Registration</h2>
          <p className="text-base text-fgtext">
            Provide details to create a trusted profile for your hospital, lab, clinic, or pharmacy.
          </p>
        </div>

        <Card className="w-full border-[#dfe3e6] shadow">
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Row 1: Facility Type and Name */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Facility Type</label>
                      <Field name="facilityType">
                        {({ field }) => (
                          <Select value={field.value} onValueChange={(val) => setFieldValue("facilityType", val)}>
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Hospital", "Laboratory", "Specialist Clinic", "Pharmacy", "Ambulance", "Insurance"].map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="facilityType" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">Facility Name</label>
                      <Field as={Input} name="facilityName" placeholder="Enter name" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="facilityName" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Contact Email</label>
                      <Field as={Input} name="contactEmail" placeholder="Enter email" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="contactEmail" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">Phone Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
                          +234
                        </span>
                        <Field
                          as={Input}
                          name="phoneNumber"
                          placeholder="8012345678"
                          className="h-12 border-[#d7dbdf] pl-14 focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) => handlePhoneInput(e, setFieldValue, "phoneNumber")}
                        />
                      </div>
                      <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Row 3: WhatsApp + Secondary */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">WhatsApp Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
                          +234
                        </span>
                        <Field
                          as={Input}
                          name="whatsapp"
                          placeholder="8012345678"
                          className="h-12 border-[#d7dbdf] pl-14 focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) => handlePhoneInput(e, setFieldValue, "whatsapp")}
                        />
                      </div>
                      <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">Secondary Phone</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
                          +234
                        </span>
                        <Field
                          as={Input}
                          name="secondaryPhone"
                          placeholder="8012345678"
                          className="h-12 border-[#d7dbdf] pl-14 focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) => handlePhoneInput(e, setFieldValue, "secondaryPhone")}
                        />
                      </div>
                      <ErrorMessage name="secondaryPhone" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Row 4: Address */}
                  <div>
                    <label className="text-sm font-semibold">Facility Address</label>
                    <Field as={Input} name="address" placeholder="Enter address" className="h-12 border-[#d7dbdf]" />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Row 5: State + LGA */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">State</label>
                      <Field name="state">
                        {({ field }) => (
                          <Select value={field.value} onValueChange={(val) => {
                            setFieldValue("state", val);
                            setFieldValue("lga", "");
                            setFieldValue("lcda", "");
                            setSelectedState(val);
                          }}>
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">LGA</label>
                      <Field name="lga">
                        {({ field }) => (
                          <Select value={field.value} onValueChange={(val) => {
                            setFieldValue("lga", val);
                            setFieldValue("lcda", "");
                          }}>
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select LGA" />
                            </SelectTrigger>
                            <SelectContent>
                              {(lgas[selectedState] || []).map((lga) => (
                                <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="lga" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Row 6: LCDA (if Lagos) */}
                  {values.state === "Lagos" && (
                    <div>
                      <label className="text-sm font-semibold">LCDA</label>
                      <Field name="lcda">
                        {({ field }) => (
                          <Select value={field.value} onValueChange={(val) => setFieldValue("lcda", val)}>
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select LCDA" />
                            </SelectTrigger>
                            <SelectContent>
                              {(lcdas[values.lga] || []).map((lcda) => (
                                <SelectItem key={lcda} value={lcda}>{lcda}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="lcda" component="div" className="text-red-500 text-sm" />
                    </div>
                  )}

                  {/* Row 7: Registration + Website */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Registration Number</label>
                      <Field as={Input} name="registration" placeholder="Enter registration number" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="registration" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">Website</label>
                      <Field as={Input} name="website" placeholder="Enter website URL" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="website" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Row 8: Passwords */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Password</label>
                      <Field as={Input} type="password" name="password" placeholder="Enter password" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">Confirm Password</label>
                      <Field as={Input} type="password" name="confirmPassword" placeholder="Confirm password" className="h-12 border-[#d7dbdf]" />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primarysolid text-white rounded-xl"
                  >
                    {isSubmitting ? "Registering..." : "Submit"}
                  </Button>
                </Form>
              )}
            </Formik>
            <div className="text-center mt-4">
              Already have an account? <a href="/login" className="text-primarysolid font-medium">Login</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};