import React, { useState } from "react";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Checkbox } from "../../components/checkbox";
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
  contactEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  secondaryPhone: Yup.string().nullable(),
  whatsapp: Yup.string().nullable(),
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
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms"),
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
    country: "Nigeria", // Default to Nigeria
    state: "",
    lga: "",
    lcda: "",
    registration: "",
    website: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    // Prepend +234 to phone numbers if not already present
    const formatPhoneNumber = (number) => {
      if (!number) return undefined;
      return number.startsWith("+234")
        ? number
        : `+234${number.replace(/^\+234/, "")}`;
    };

    const facilityData = {
      name: values.facilityName,
      type: values.facilityType,
      email: values.contactEmail,
      phone: formatPhoneNumber(values.phoneNumber),
      secondaryPhone: formatPhoneNumber(values.secondaryPhone) || undefined,
      whatsapp: formatPhoneNumber(values.whatsapp) || undefined,
      address: values.address,
      country: values.country,
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
      setError(
        error.response?.data?.error ||
          "Failed to register facility. Please try again."
      );
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
    <main className="flex flex-col min-h-screen items-center bg-white mb-20 ">
      <header className="w-full h-20 flex items-center justify-between px-20 bg-bgdefault-bg">
        <h1 className="text-4xl font-bold text-primarysolid">Logo</h1>
      </header>

      <div className="flex flex-col w-full max-w-[768px] mt-10 px-4 border-[#c9cbcd] shadow ">
        <div className="mb-6 m-2 p-4 rounded-lg h-24 flex flex-col items-center justify-center">
          <h2 className="text-[30px] font-semibold text-fgtext-contrast">
            Create Your Account
          </h2>
          <p className="text-base text-fgtext">
            Join hundreds of verified healthcare providers
          </p>
        </div>

        <Card >
          <CardContent className="p-6 ">
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
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
                      <label className="text-sm font-semibold">
                        Facility Type <span className="text-red-600">*</span>
                      </label>
                      <Field name="facilityType">
                        {({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) =>
                              setFieldValue("facilityType", val)
                            }
                          >
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Choose facility type" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Hospital",
                                "Laboratory",
                                "Specialist Clinic",
                                "Pharmacy",
                                "Ambulance",
                                "Insurance",
                              ].map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="facilityType"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Facility Name <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as={Input}
                        name="facilityName"
                        placeholder="Enter facility name"
                        className="h-12 border-[#d7dbdf]"
                      />
                      <ErrorMessage
                        name="facilityName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Contact Email <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as={Input}
                        name="contactEmail"
                        placeholder="johndoe@mail.com"
                        className="h-12 border-[#d7dbdf]"
                      />
                      <ErrorMessage
                        name="contactEmail"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        </div>
                        <Field
                          as={Input}
                          name="phoneNumber"
                          placeholder="+234"
                          className="h-12 border-[#d7dbdf] focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) =>
                            handlePhoneInput(e, setFieldValue, "phoneNumber")
                          }
                          
                        />
                        
                      </div>
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 3: Facility Director/Manager's number + WhatsApp */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Facility Director/Manager's number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                                </div>
                        <Field
                          as={Input}
                          name="secondaryPhone"
                          placeholder="+234"
                          className="h-12 border-[#d7dbdf] focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) =>
                            handlePhoneInput(e, setFieldValue, "secondaryPhone")
                          }
                        />
                      </div>
                      <ErrorMessage
                        name="secondaryPhone"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        WhatsApp Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                         
                        </div>
                        <Field
                          as={Input}
                          name="whatsapp"
                          placeholder="+234"
                          className="h-12 border-[#d7dbdf]  focus:border-primarysolid transition-all duration-200"
                          type="tel"
                          onChange={(e) =>
                            handlePhoneInput(e, setFieldValue, "whatsapp")
                          }
                        />
                      </div>
                      <ErrorMessage
                        name="whatsapp"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 4: Country + State */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Country <span className="text-red-600">*</span>
                      </label>
                      <Field name="country">
                        {({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => setFieldValue("country", val)}
                          >
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Nigeria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Nigeria">Nigeria</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        State <span className="text-red-600">*</span>
                      </label>
                      <Field name="state">
                        {({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              setFieldValue("state", val);
                              setFieldValue("lga", "");
                              setFieldValue("lcda", "");
                              setSelectedState(val);
                            }}
                          >
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 5: Facility Registration Number + Local Government Area */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Facility Registration Number
                      </label>
                      <Field
                        as={Input}
                        name="registration"
                        placeholder="Enter your registration number"
                        className="h-12 border-[#d7dbdf] focus:border-primarysolid transition-all duration-200"
                      />
                      <ErrorMessage
                        name="registration"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Local Government Area
                      </label>
                      <Field name="lga">
                        {({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              setFieldValue("lga", val);
                              setFieldValue("lcda", "");
                            }}
                          >
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select your LGA" />
                            </SelectTrigger>
                            <SelectContent>
                              {(lgas[selectedState] || []).map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                  {lga}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="lga"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 6: LCDA (if Lagos) */}
                  {values.state === "Lagos" && (
                    <div>
                      <label className="text-sm font-semibold">LCDA</label>
                      <Field name="lcda">
                        {({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => setFieldValue("lcda", val)}
                          >
                            <SelectTrigger className="h-12 border-[#d7dbdf]">
                              <SelectValue placeholder="Select LCDA" />
                            </SelectTrigger>
                            <SelectContent>
                              {(lcdas[values.lga] || []).map((lcda) => (
                                <SelectItem key={lcda} value={lcda}>
                                  {lcda}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="lcda"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}

                  {/* Row 7: Passwords */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as={Input}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="h-12 border-[#d7dbdf]"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Confirm Password <span className="text-red-600">*</span>
                      </label>
                      <Field
                        as={Input}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm you password"
                        className="h-12 border-[#d7dbdf]"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 8: Website URL */}
                  <div>
                    <label className="text-sm font-semibold">Website URL</label>
                    <Field
                      as={Input}
                      name="website"
                      placeholder="https://hospital.com"
                      className="h-12 border-[#d7dbdf] w-2/4"
                    />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                      
                  {/* Terms and Conditions Checkbox */}
                  <div className="flex items-start space-x-2">
                    <Field name="termsAccepted">
                      {({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            setFieldValue("termsAccepted", checked)
                          }
                          className="mt-1"
                        />
                      )}
                    </Field>
                    <div className="text-base">
                      By registering, you agree to our{" "}
                      <a href="#" className="text-[#05A2C2]">
                        Terms of Services
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#05A2C2] ">
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                  <ErrorMessage
                    name="termsAccepted"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primarysolid text-white rounded-xl"
                  >
                    {isSubmitting
                      ? "Registering..."
                      : "Create Hospital Account"}
                  </Button>
                </Form>
              )}
            </Formik>
            <div className="text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-primarysolid font-medium">
                Sign in here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};