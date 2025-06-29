import React, { useState, useEffect } from "react";
import { Button } from "../../components/button.jsx";
import { Card, CardContent } from "../../components/card.jsx";
import { Input } from "../../components/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/select.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { lgas } from "../../components/enums/lgas.jsx";
import { states } from "../enums/state.jsx";
import { lcdas } from "../enums/lcdas.jsx";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { useAuth } from "../hook/auth.jsx";
import StepProgress from "./stepProgress.jsx";
import { updateFacility } from "../../services/auth.js";

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
    website: Yup.string()
        .url("Invalid URL")
        .transform((val) => (val === "" ? null : val))
        .nullable(),
});

export const FacilityInformation = () => {
    const { authData, fetchAuthData } = useAuth(); // Assuming useAuth provides a loading state
    const [selectedState, setSelectedState] = useState("");
    const [error, setError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [secondaryPhone, setSecondaryPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    const [initialValues, setInitialValues] = useState({
        facilityType: "Hospital",
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
        website: "",
    });

    useEffect(() => {
        if (authData) {
            setSelectedState(authData?.state || "");
            setPhoneNumber(authData?.phone || "");
            setSecondaryPhone(authData?.secondaryPhone || "");
            setWhatsapp(authData?.whatsapp || "");
            setInitialValues({
                facilityType: authData?.type || "Hospital",
                facilityName: authData?.name || "",
                hospitalType: authData?.hospitalType || null,
                insuranceType: authData?.insuranceType || null,
                contactEmail: authData?.email || "",
                phoneNumber: authData?.phone || "",
                secondaryPhone: authData?.secondaryPhone || "",
                whatsapp: authData?.whatsapp || "",
                country: "Nigeria",
                state: authData?.state || "",
                lga: authData?.lga || "",
                lcda: authData?.lcda || "",
                website: authData?.website || "",
            });
        }
    }, [authData]);



    const handleSubmit = async (values, { setSubmitting }) => {
        setError(null);

        const formatPhoneNumber = (number) => {
            if (!number) return null;
            return number.startsWith("+234")
                ? number
                : `+234${number.replace(/^\+234/, "").replace(/^0/, "")}`;
        };

        const facilityData = {
            facilityId: authData?._id,
            name: values.facilityName,
            type: values.facilityType,
            hospitalType: values.hospitalType || null,
            insuranceType: values.insuranceType || null,
            email: values.contactEmail,
            phone: formatPhoneNumber(values.phoneNumber),
            secondaryPhone: formatPhoneNumber(values.secondaryPhone) || null,
            whatsapp: formatPhoneNumber(values.whatsapp) || null,
            country: values.country,
            state: values.state,
            lga: values.lga,
            lcda: values.lcda || null,
            website: values.website || null,
        };

        try {
            await updateFacility(facilityData);
            setSubmitting(false);
            fetchAuthData();
            toast.success("Facility information updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            setSubmitting(false);
            setError(
                error?.response?.data?.error ||
                "Failed to update facility information. Please try again."
            );
        }
    };


    return (
        <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border">
            <StepProgress currentStep={authData?.onBoardingStep} />
            <div className="mb-10 p-6 h-24 flex flex-col gap-2">
                <h2 className="text-[30px] font-semibold text-fgtext-contrast leading-[36px] tracking-[0.5%]">
                    Facility Information
                </h2>
                <p className="text-base font-inter font-medium text-[16px] leading-[24px] tracking-[0.5%] font-[500]">
                    Manage and update facility information
                </p>
            </div>
            <Card className="border-none shadow-none">
                <CardContent className="px-6">
                    {error && (
                        <div className="mb-4 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
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
                                                        uencia
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
                                    <div className="flex-1 relative">
                                        <label className="text-sm font-semibold">
                                            Phone Number <span className="text-red-600">*</span>
                                        </label>
                                        <Field name="phoneNumber">
                                            {({ field }) => (
                                                <PhoneInput
                                                    country={"ng"}
                                                    value={field.value}
                                                    onChange={(val) => {
                                                        setPhoneNumber(val);
                                                        setFieldValue("phoneNumber", val);
                                                    }}
                                                    inputClass="!h-12 !border !border-[#d7dbdf] !rounded"
                                                    inputStyle={{ width: "100%" }}
                                                    countryCodeEditable={false}
                                                />
                                            )}
                                        </Field>
                                        <ErrorMessage
                                            name="phoneNumber"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Row 3: Secondary Phone + WhatsApp */}
                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <label className="text-sm font-semibold">
                                            Secondary Phone
                                        </label>
                                        <Field name="secondaryPhone">
                                            {({ field }) => (
                                                <PhoneInput
                                                    country={"ng"}
                                                    value={field.value}
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
                                    <div className="flex-1 relative">
                                        <label className="text-sm font-semibold">
                                            WhatsApp Number <span className="text-red-600">*</span>
                                        </label>
                                        <Field name="whatsapp">
                                            {({ field }) => (
                                                <PhoneInput
                                                    country={"ng"}
                                                    value={field.value}
                                                    onChange={(val) => {
                                                        setWhatsapp(val);
                                                        setFieldValue("whatsapp", val);
                                                    }}
                                                    inputClass="!h-12 !border !border-[#d7dbdf] !rounded"
                                                    inputStyle={{ width: "100%" }}
                                                    countryCodeEditable={false}
                                                />
                                            )}
                                        </Field>
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
                                {/* Row 5: LGA */}
                                <div className="flex-1">
                                    <label className="text-sm font-semibold">
                                        Local Government Area <span className="text-red-600">*</span>
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
                                {/* Row 6: LCDA (if Lagos) */}
                                {values.state === "Lagos" && (
                                    <div className="flex-1">
                                        <label className="text-sm font-semibold">
                                            LCDA <span className="text-red-600">*</span>
                                        </label>
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
                                {/* Row 7: Website URL */}
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
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-primarysolid text-white rounded-xl"
                                >
                                    {isSubmitting ? "Updating..." : "Update Facility Information"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </div>
    );
};