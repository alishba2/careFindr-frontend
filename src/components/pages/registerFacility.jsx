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
import { sendOtp, verifyOtp } from "../../services/auth.js";
import { toast } from "react-toastify";
import Header from "./header.jsx";
import PhoneInput from "react-phone-input-2";
import { CheckCircle, Info } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const validationSchema = Yup.object({
  facilityType: Yup.string().required("Facility type is required"),
  facilityName: Yup.string().required("Facility name is required"),
  hospitalType: Yup.string().when("facilityType", {
    is: "Hospital",
    then: (schema) => schema.required("Hospital type is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  insuranceType: Yup.string().when("facilityType", {
    is: "Insurance",
    then: (schema) => schema.required("Insurance type is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  contactEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  secondaryPhone: Yup.string()
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  whatsapp: Yup.string().required("WhatsApp number is required"),
  state: Yup.string().required("State is required"),
  lga: Yup.string().required("LGA is required"),
  lcda: Yup.string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .when("state", {
      is: "Lagos",
      then: (schema) => schema.required("LCDA is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  registration: Yup.string().required("Registration number is required"),
  website: Yup.string()
    .url("Invalid URL")
    .transform((val) => (val === "" ? null : val))
    .nullable(),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const OtpInput = ({ otp, setOtp, onVerify }) => {
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-verify when all OTP digits are filled
    if (newOtp.every((digit) => digit !== "") && value !== "") {
      onVerify(newOtp.join(""));
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          maxLength="1"
          value={digit}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          className="w-12 h-12 text-center border border-gray-300 rounded focus:border-primarysolid"
        />
      ))}
    </div>
  );
};

export const RegistrationStep = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [whatsappOtp, setWhatsappOtp] = useState(["", "", "", "", "", ""]);

  const initialValues = {
    facilityType: "",
    facilityName: "",
    hospitalType: null,
    insuranceType: null,
    contactEmail: "",
    phoneNumber: "",
    secondaryPhone: "",
    whatsapp: "",
    country: "Nigeria",
    state: "",
    lga: "",
    lcda: "",
    registration: "",
    website: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  };

  const handleSendOtp = async (phone, type) => {
    try {
      await sendOtp({ phone });
      toast.success(`OTP sent to ${phone}`, {
        position: "top-right",
        autoClose: 3000,
      });
      if (type === "phone") {
        setShowPhoneOtp(true);
      } else {
        setShowWhatsappOtp(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleVerifyOtp = async (otp, phone, type) => {
    try {
      await verifyOtp({ otp, phone, type });
      if (type === "phone") {
        setPhoneVerified(true);
        setShowPhoneOtp(false);
        setPhoneOtp(["", "", "", "", "", ""]);
        toast.success("Phone number verified!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setWhatsappVerified(true);
        setShowWhatsappOtp(false);
        setWhatsappOtp(["", "", "", "", "", ""]);
        toast.success("WhatsApp number verified!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!phoneVerified || !whatsappVerified) {
      setError("Please verify both phone and WhatsApp numbers before submitting.");
      setSubmitting(false);
      return;
    }

    setError(null);
    const formatPhoneNumber = (number) => {
      if (!number) return null;
      return number.startsWith("+234")
        ? number
        : `+234${number.replace(/^\+234/, "").replace(/^0/, "")}`;
    };

    const facilityData = {
      name: values.facilityName,
      type: values.facilityType,
      hospitalType: values.hospitalType || null,
      insuranceType: values.insuranceType || null,
      email: values.contactEmail,
      phone: formatPhoneNumber(values.phoneNumber),
      secondaryPhone: formatPhoneNumber(values.secondaryPhone) || null,
      whatsapp: formatPhoneNumber(values.whatsapp) || null,
      registrationNumber: values.registration,
      country: values.country,
      state: values.state,
      lga: values.lga,
      lcda: values.lcda || null,
      website: values.website || null,
      password: values.password,
      isPhoneVerified: phoneVerified,
      isWhatsappNumberVerified: whatsappVerified,
    };


    try {

      if (!(phoneVerified && whatsappVerified)) {
        toast.error("Please verify both phone and WhatsApp numbers before submitting.");
        setSubmitting(false);
        return;
      }
      let response = await registerFacility(facilityData);
      setSubmitting(false);
      toast.success("Facility registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("facilityType", response.facility.type.toLowerCase());
      navigate("/facility-dashboard");
    } catch (error) {
      setSubmitting(false);
      setError(
        error.response?.data?.error ||
        "Failed to register facility. Please try again."
      );
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center pb-20 bg-[#F8F9FA]">
      <Header />
      <div className="flex flex-col w-full max-w-[768px] mt-10 px-4 md:bg-white rounded-[15px] border-none shadow-none md:shadow-[0px_0px_4px_rgba(0,_0,_0,_0.25)] md:border">

       <div className="mb-6 py-4 rounded-[5px] flex flex-col items-center justify-center text-center">
          <h2 className="text-[24px] md:text-[30px] font-semibold text-fgtext-contrast">
            Create Your Account
          </h2>
          <p className="text-sm md:text-base font-medium text-fgtext">
            Join hundreds of verified healthcare providers
          </p>
        </div>
        <Card className="border-none shadow-none">
          <CardContent className="p-6">
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
<Form className="space-y-6 w-full">
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
                            onValueChange={(val) => {
                              setFieldValue("facilityType", val);
                              setFieldValue("hospitalType", null);
                              setFieldValue("insuranceType", null);
                            }}
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
                    {/* Conditional Hospital Type */}
                    {values.facilityType === "Hospital" && (
                      <div className="flex-1">
                        <label className="text-sm font-semibold">
                          Hospital Type <span className="text-red-600">*</span>
                        </label>
                        <Field name="hospitalType">
                          {({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => setFieldValue("hospitalType", val)}
                            >
                              <SelectTrigger className="h-12 border-[#d7dbdf]">
                                <SelectValue placeholder="Select hospital type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">Secondary</SelectItem>
                                <SelectItem value="Tertiary">Tertiary</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="hospitalType"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    )}

                    {/* Conditional Insurance Type */}
                    {values.facilityType === "Insurance" && (
                      <div className="flex-1">
                        <label className="text-sm font-semibold">
                          Insurance Type <span className="text-red-600">*</span>
                        </label>
                        <Field name="insuranceType">
                          {({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => setFieldValue("insuranceType", val)}
                            >
                              <SelectTrigger className="h-12 border-[#d7dbdf]">
                                <SelectValue placeholder="Select insurance type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="HMO">HMO (Health Maintenance Organization)</SelectItem>
                                <SelectItem value="PPO">PPO (Preferred Provider Organization)</SelectItem>
                                <SelectItem value="NHIA">NHIA (Government-backed)</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="insuranceType"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Facility Name */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold">
                        Facility Name <span className="text-red-600">*</span>
                      </label>
                      <span
                        data-tooltip-id="facility-name-tooltip"
                        data-tooltip-content="If your facility has more than one branch, name it as: Facility Name (Branch Location)."
                        className="text-blue-500 cursor-pointer"
                      >
                        <Info className="h-4 w-4 text-gray-500" />
                      </span>
                      <ReactTooltip
                        id="facility-name-tooltip"
                        place="right"
                        effect="solid"
                        className="max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2"
                      />
                    </div>
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


                  {/* Row 2: Email + Phone */}
                  <div className="flex flex-wrap gap-4 md:flex-row flex-col">
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
                        <Field name="phoneNumber">
                          {({ field }) => (
                            <div className="flex items-center">
                              <PhoneInput
                                country={"ng"}
                                value={phoneNumber}
                                onChange={(val) => {
                                  setPhoneNumber(val);
                                  setFieldValue("phoneNumber", val);
                                  setPhoneVerified(false);
                                  setShowPhoneOtp(false);
                                }}
                                inputClass="!h-12 !border !border-[#d7dbdf] !rounded !pr-24"
                                inputStyle={{ width: "100%" }}
                                countryCodeEditable={false}
                              />
                              {phoneVerified ? (
                                <div className="absolute px-2 right-2 flex items-center h-6 text-green-600 rounded-full border bg-[#E4FAEF]">
                                  <span className="text-xs">Verified</span>
                                </div>
                              ) : (
                                phoneNumber && (
                                  <Button
                                    type="button"
                                    onClick={() => handleSendOtp(phoneNumber, "phone")}
                                    className="absolute right-2 h-8 bg-primarysolid text-white px-3 text-sm"
                                  >
                                    Verify
                                  </Button>
                                )
                              )}
                            </div>
                          )}
                        </Field>
                        {showPhoneOtp && (
                          <div className="mt-2">
                            <label className="text-sm font-medium">Enter OTP</label>
                            <OtpInput
                              otp={phoneOtp}
                              setOtp={setPhoneOtp}
                              onVerify={(otp) => handleVerifyOtp(otp, phoneNumber, "phone")}
                            />
                            <div className="text-sm mt-1">
                              Didn’t receive?{" "}
                              <button
                                type="button"
                                onClick={() => handleSendOtp(phoneNumber, "phone")}
                                className="text-blue-600"
                              >
                                Send again
                              </button>
                            </div>
                          </div>
                        )}
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row 3: Facility Director/Manager's number + WhatsApp */}
                  <div className="flex gap-4 md:flex-row flex-col">
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        Facility Director/Manager's number
                      </label>
                      <div className="relative">
                        <Field name="secondaryPhone">
                          {({ field }) => (
                            <PhoneInput
                              country={"ng"}
                              value={secondaryPhone}
                              onChange={(val) => {
                                setSecondaryPhone(val);
                                setFieldValue("secondaryPhone", val);
                              }}
                              inputClass="!h-12 !border !border-[#d7dbdf] !rounded"
                              inputStyle={{ width: "100%" }}
                              countryCodeEditable={false}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="secondaryPhone"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold">
                        WhatsApp Number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Field name="whatsapp">
                          {({ field }) => (
                            <div className="flex items-center">
                              <PhoneInput
                                country={"ng"}
                                value={whatsapp}
                                onChange={(val) => {
                                  setWhatsapp(val);
                                  setFieldValue("whatsapp", val);
                                  setWhatsappVerified(false);
                                  setShowWhatsappOtp(false);
                                }}
                                inputClass="!h-12 !border !border-[#d7dbdf] !rounded !pr-24"
                                inputStyle={{ width: "100%" }}
                                countryCodeEditable={false}
                              />
                              {whatsappVerified ? (
                                <div className="absolute px-2 right-2 flex items-center h-6 text-green-600 rounded-full border bg-[#E4FAEF]">
                                  <span className="text-xs">Verified</span>
                                </div>
                              ) : (
                                whatsapp && (
                                  <Button
                                    type="button"
                                    onClick={() => handleSendOtp(whatsapp, "whatsapp")}
                                    className="absolute right-2 h-8 bg-primarysolid text-white px-3 text-sm"
                                  >
                                    Verify
                                  </Button>
                                )
                              )}
                            </div>
                          )}
                        </Field>
                        {showWhatsappOtp && (
                          <div className="mt-2">
                            <label className="text-sm font-medium">Enter OTP</label>
                            <OtpInput
                              otp={whatsappOtp}
                              setOtp={setWhatsappOtp}
                              onVerify={(otp) => handleVerifyOtp(otp, whatsapp, "whatsapp")}
                            />
                            <div className="text-sm mt-1">
                              Didn’t receive?{" "}
                              <button
                                type="button"
                                onClick={() => handleSendOtp(whatsapp, "whatsapp")}
                                className="text-blue-600"
                              >
                                Send again
                              </button>
                            </div>
                          </div>
                        )}
                        <ErrorMessage
                          name="whatsapp"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row 4: Country + State */}
                  <div className="flex gap-4 md:flex-row flex-col">
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
                  <div className="flex gap-4 md:flex-row flex-col">
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
                  <div className="flex gap-4 md:flex-row flex-col">
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
                        placeholder="Confirm your password"
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
                      <a href="#" className="text-[#05A2C2]">
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                  <ErrorMessage
                    name="termsAccepted"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !phoneVerified || !whatsappVerified}

                    className="w-full h-12 bg-primarysolid text-white rounded-xl"
                  >
                    {isSubmitting ? "Registering..." : "Create Hospital Account"}
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