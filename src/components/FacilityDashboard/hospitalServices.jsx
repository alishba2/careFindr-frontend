// ===== 1. hospitalServices/index.jsx - Main Component =====
import React, { useEffect, useState, useMemo } from "react";
import StepProgress from "./stepProgress";
import { Card } from "../card";
import { useAuth } from "../hook/auth";
import { FacilityServices, GetFacilityService } from "../../services/service";
import { message } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../button";

// Import service-specific components
import HospitalForm from "./forms/HospitalForm";
import LaboratoryForm from "./forms/LaboratoryForm";
import PharmacyForm from "./forms/PharmacyForm";
import AmbulanceForm from "./forms/AmbulanceForm";
import InsuranceForm from "./forms/InsuranceForm";
import SpecialistClinicForm from "./forms/SpecialistClinicForm";

// Import utilities
import { initialCapabilitiesState } from "./utils/initialState";
import { loadServiceData } from "./utils/loadServiceData";
import { prepareServiceData } from "./utils/perpareServiceData";
import BloodBankForm from "./forms/BloodbankFrom";

export const HospitalServices = () => {
    const { authData, facilityType, fetchAuthData, setIsAmbulance } = useAuth();
    const [progress, setProgress] = useState(0);
    const [facility, setFacility] = useState(null);
    const [subSpecialities, setSubspecialities] = useState([]);
    const [saving, setSaving] = useState(false);
    const [initialCapabilities, setInitialCapabilities] = useState(null);
    const [initialSubSpecialities, setInitialSubSpecialities] = useState([]);
    const [isServiceSaved, setIsServiceSaved] = useState(false);
    const [timeError, setTimeError] = useState("");
    const location = useLocation();
    const type = location.state?.type;
    const [typeFacility, setTypeFacility] = useState(null);
    const navigate = useNavigate();
    const [capabilities, setCapabilities] = useState(initialCapabilitiesState);
    const userType = localStorage.getItem("userType");

    useEffect(() => {
        setFacility(null);
        if (type === "ambulance") {
            setFacility("Ambulance");
            return;
        } else {
            setFacility(facilityType);
        }
    }, [facilityType, type]);

    // Separate useEffect for handling ambulance setting when capabilities change
    useEffect(() => {
        console.log(capabilities, "capabilities");
        
        if (capabilities.hasLaboratory) {
            setIsAmbulance(true);
        }
    }, [capabilities, setIsAmbulance]);

    const areStatesEqual = (state1, state2) => {
        return JSON.stringify(state1) === JSON.stringify(state2);
    };

    const validateOperatingHours = () => {
        if (!capabilities.openingTime || !capabilities.closingTime) {
            setTimeError("");
            return true;
        }

        const [openHours, openMinutes] = capabilities.openingTime.split(":").map(Number);
        const [closeHours, closeMinutes] = capabilities.closingTime.split(":").map(Number);

        const openTimeInMinutes = openHours * 60 + openMinutes;
        let closeTimeInMinutes = closeHours * 60 + closeMinutes;

        if (closeTimeInMinutes < openTimeInMinutes) {
            closeTimeInMinutes += 24 * 60;
        }

        const timeDifference = closeTimeInMinutes - openTimeInMinutes;

        if (timeDifference < 30) {
            setTimeError("Operating hours must have at least a 30-minute difference.");
            return false;
        }

        setTimeError("");
        return true;
    };

    const hasChanges = useMemo(() => {
        if (!initialCapabilities || !initialSubSpecialities) return false;
        return (
            !areStatesEqual(capabilities, initialCapabilities) ||
            !areStatesEqual(subSpecialities, initialSubSpecialities)
        ) && validateOperatingHours();
    }, [capabilities, subSpecialities, initialCapabilities, initialSubSpecialities]);

    useEffect(() => {
        const getFacilityServices = async () => {
            try {
                console.log(authData,"auth data is here" );
                const response = await GetFacilityService(authData?._id);
                if (response?.service) {
                    const serviceData = response.service;
                    setProgress(2);
                    setIsServiceSaved(true);
                    setTypeFacility(serviceData?.facilityType);

                    const { newCapabilities, subSpecialities: loadedSubSpecialities } = loadServiceData(
                        serviceData,
                        capabilities
                    );

                    console.log(newCapabilities, "new capabilities here");

                    // Set capabilities and initial capabilities immediately
                    setCapabilities(newCapabilities);
                    setInitialCapabilities(JSON.parse(JSON.stringify(newCapabilities)));

                    if (loadedSubSpecialities) {
                        setSubspecialities(loadedSubSpecialities);
                        setInitialSubSpecialities(loadedSubSpecialities);
                    }
                } else {
                    setIsServiceSaved(false);
                    setInitialCapabilities(JSON.parse(JSON.stringify(capabilities)));
                    setInitialSubSpecialities([]);
                }
            } catch (error) {
                console.error("Error fetching service:", error);
                setIsServiceSaved(false);
                setInitialCapabilities(JSON.parse(JSON.stringify(capabilities)));
                setInitialSubSpecialities([]);
            }
        }

        getFacilityServices();
    }, [authData]); // Empty dependency array to run only once

    const handleSubmit = async () => {
        if (!validateOperatingHours()) {
            message.error("Please fix the operating hours before saving.");
            return;
        }
        try {
            const serviceData = prepareServiceData(
                authData?._id,
                facilityType,
                facility,
                capabilities,
                subSpecialities,
                initialCapabilities
            );

            setSaving(true);
            const response = await FacilityServices(serviceData);
            setIsServiceSaved(true);
            setInitialCapabilities(JSON.parse(JSON.stringify(capabilities)));
            setInitialSubSpecialities([...subSpecialities]);
            setSaving(false);
            fetchAuthData();
            message.success("Service Updated Successfully!");
            navigate("/facility-dashboard/document-upload");
        } catch (error) {
            console.error("Error submitting service:", error);
            setSaving(false);
            message.error("Failed to update service. Please try again.");
        }
    };

    const renderForm = () => {
        const commonProps = {
            capabilities,
            setCapabilities,
            timeError,
            setTimeError,
            validateOperatingHours
        };

        console.log(commonProps, 'common props here')

        switch (facility) {
            case "Hospital":
                return (
                    <HospitalForm
                        {...commonProps}
                        subSpecialities={subSpecialities}
                        setSubspecialities={setSubspecialities}
                        type={type}
                        typeFacility={typeFacility}
                    />
                );
            case "Laboratory":
                return <LaboratoryForm {...commonProps} />;
            case "Pharmacy":
                return <PharmacyForm {...commonProps} />;
            case "Ambulance":
                return <AmbulanceForm {...commonProps} typeFacility={typeFacility} />;
            case "Insurance":
                return <InsuranceForm {...commonProps} />;
            case "SpecialistClinic":
                return <SpecialistClinicForm {...commonProps} />;
            
            case "Blood Bank":
                return <BloodBankForm {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border">

            {
                userType != "admin" ? (
                    <>
                        <StepProgress currentStep={authData?.onBoardingStep} />
                        <div className=" p-6 h-24 flex flex-col gap-2">
                            <h2 className="text-[30px] font-semibold text-fgtext-contrast leading-[36px] tracking-[0.5%]">
                                {typeFacility === "Hospital" && facility === "Ambulance"
                                    ? "Ambulance Details"
                                    : "Service & Capacity"}
                            </h2>
                            <p className="text-base font-inter font-medium text-[16px] leading-24px tracking-[0.5%] font-[500]">
                                Ensuring accuracy for patients, regulators, and partners
                            </p>
                        </div>
                    </>
                ) : (
                    <div className=" p-6 h-18 flex flex-col gap-2">
                        <h2 className="text-[30px] font-semibold text-fgtext-contrast leading-[36px] tracking-[0.5%]">
                            {typeFacility === "Hospital" && facility === "Ambulance"
                                ? "Ambulance Details"
                                : "Service & Capacity"}
                        </h2>

                    </div>
                )
            }

            <Card className="border-none shadow-none ">
                <div className="p-6 space-y-6 border-none">
                    {renderForm()}
                </div>
            </Card>

            {
                userType == "admin" ? (

                    <div className="flex my-3 mb-8 gap-5 p-6">

                        <Button
                            className="h-12 flex-1 px-6 bg-primarysolid text-white rounded-md flex items-center justify-center"
                            onClick={handleSubmit}
                            disabled={saving || !hasChanges}
                        >
                            {saving ? (
                                <>
                                    <span className="loader mr-2" /> Saving...
                                </>
                            ) : (
                                "Update "
                            )}
                        </Button>
                    </div>
                ) : (

                    <div className="flex my-3 mb-8 gap-5 p-6">
                        <Button
                            className="h-12 flex-1 px-6 bg-gray-300 font-bold hover:bg-gray-400 hover:text-white text-black rounded-md flex items-center justify-center"
                            onClick={() => navigate("/facility-dashboard/facility-info")}
                        >
                            Back
                        </Button>
                        <Button
                            className="h-12 flex-1 px-6 bg-primarysolid text-white rounded-md flex items-center justify-center"
                            onClick={handleSubmit}
                            disabled={saving || !hasChanges}
                        >
                            {saving ? (
                                <>
                                    <span className="loader mr-2" /> Saving...
                                </>
                            ) : (
                                "Update & Next"
                            )}
                        </Button>
                    </div>
                )
            }


        </div>
    );
};