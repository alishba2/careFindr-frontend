import React, { useEffect, useState, useMemo } from "react";
import StepProgress from "./stepProgress";
import { Input } from "../input";
import { Button } from "../button";
import { Card } from "../card";
import { CoreClinicalSpecialities } from "../enums/medicalSpecialities";
import { Select } from "antd";
import Subspecialties from "./subspecialities ";
import { useAuth } from "../hook/auth";
import { FacilityServices, GetFacilityService } from "../../services/service";
import { message } from 'antd';
const { Option } = Select;
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

import { useNavigate } from "react-router-dom";

export const HospitalServices = () => {
    const { authData, facilityType, fetchAuthData } = useAuth();
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

    const [capabilities, setCapabilities] = useState({
        operatingDays: [],
        openingTime: "",
        closingTime: "",
        coreClinicalSpecialities: [],
        facilityFeatures: [],
        agreedToTerms: false,
        admissionFee: "",
        consultationFee: "",
        totalBedSpace: "",
        hasPharmacy: "",
        hasLaboratory: "",
        acceptExternalPatients: "",
        hasOtherBranches: "",
        branchAddresses: [" "],
        additionalInformation: "",
        accreditationStatus: "",
        homeSampleCollection: "",
        offersCovidTesting: "",
        hasLicensedPharmacist: "",
        offersDelivery: "",
        complianceDocuments: [],
        acceptedPayments: [],
        ambulanceTypes: [],
        vehicleEquipment: [],
        typicalCrew: [],
        averageResponseMin: "",
        averageResponseSec: "",
        noRoadworthyAmbulances: "",
        maxDailyTrips: "",
        hasBackupVehicles: "",
        payPerTrip: "",
        nhisInsuranceAccepted: "",
        registeredWithFMOH: "",
        coveredServices: [],
        exclusions: [],
        preExistingConditions: "No",
        emergencyCoverage: "",
        accreditedHospitals: [""],
        outOfNetworkReimbursement: "No",
        preAuthorization: "",
        waitingPeriods: [],
        premiumsCopayments: "",
        preAuthRequired: null,

        // 🆕 Specialist Clinic Fields
        coreServices: "", // What are the core and specialized medical services?
        careType: "", // Inpatient / Outpatient / Both
        onSiteDoctor: "", // Is doctor/specialist on-site?
        emergencyResponsePlan: "", // Do you have emergency response plan?
        criticalCare: "", // Equipped for critical care?
        multidisciplinaryCare: "", // e.g., Dieticians, Mental Health, etc.
        bedCapacity: "", // Number of beds (if applicable)
        homeServices: "", // Can you offer home/mobile services?
        onlineBooking: "", // Do you support online pre-booking?
        is24Hour: "", // Are services available 24/7?
        patientLimit: "", // Daily patient limit (if any)
        publicHolidayWork: "", // Do you work on public holidays?
        collaboratesWithOthers: "", // Do you work with other hospitals/clinics?
        worksWithHMOs: "", // Do you work with HMOs?
        acceptsInsurance: "" // Accepts NHIS/private insurance?
    });


    useEffect(() => {
        console.log(type, "type is here");
        setFacility(null);
        if (type === "ambulance") {
            setFacility("Ambulance");
            return;
        } else {
            setFacility(facilityType);
        }
    }, [facilityType, type]);

    useEffect(() => {
        console.log(facility, "facility");
    }, [facility]);

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
            if (authData?._id) {
                try {
                    const response = await GetFacilityService();
                    if (response?.service) {
                        const serviceData = response.service;
                        setProgress(2);
                        setIsServiceSaved(true);
                        let newCapabilities = { ...capabilities };

                        console.log(serviceData, "service data is here");
                        setTypeFacility(serviceData?.facilityType);

                        switch (serviceData.facilityType) {
                            case "Hospital":
                                newCapabilities = {
                                    ...newCapabilities,
                                    operatingDays: serviceData.hospitalDetails.operationDays || [],
                                    openingTime: serviceData.hospitalDetails.openingTime || "",
                                    closingTime: serviceData.hospitalDetails.closingTime || "",
                                    coreClinicalSpecialities: serviceData.hospitalDetails.coreClinicalSpecialities || [],
                                    facilityFeatures: serviceData.hospitalDetails.facilityFeatures || [],
                                    admissionFee: serviceData.hospitalDetails.admissionFee?.toString() || "",
                                    consultationFee: serviceData.hospitalDetails.consultationFee?.toString() || "",
                                    totalBedSpace: serviceData.hospitalDetails.totalBedSpace?.toString() || "",
                                    hasPharmacy: serviceData.hospitalDetails.hasPharmacy ? "Yes" : "No",
                                    hasLaboratory: serviceData.hospitalDetails.hasLaboratory ? "Yes" : "No",
                                    acceptExternalPatients: serviceData.hospitalDetails.externalPatientsAllowed?.lab ? "Yes" : "No",
                                    hasOtherBranches: serviceData.hospitalDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.hospitalDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.hospitalDetails.additionalInfo || "",
                                };
                                if (serviceData?.ambulanceDetails) {
                                    newCapabilities = {
                                        ...newCapabilities,
                                        ambulanceTypes: serviceData.ambulanceDetails.ambulanceTypes || [],
                                        vehicleEquipment: serviceData.ambulanceDetails.vehicleEquipment || [],
                                        typicalCrew: serviceData.ambulanceDetails.typicalCrew || [],
                                        averageResponseMin: serviceData.ambulanceDetails.avgResponseTime?.split(":")[0] || "",
                                        averageResponseSec: serviceData.ambulanceDetails.avgResponseTime?.split(":")[1] || "",
                                        noRoadworthyAmbulances: serviceData.ambulanceDetails.numRoadWorthyAmbulances?.toString() || "",
                                        maxDailyTrips: serviceData.ambulanceDetails.maxTripsDaily?.toString() || "",
                                        hasBackupVehicles: serviceData.ambulanceDetails.backupVehicles ? "Yes" : "No",
                                        payPerTrip: serviceData.ambulanceDetails.payPerTrip?.toString() || "",
                                        nhisInsuranceAccepted: serviceData.ambulanceDetails.insuranceAccepted ? "Yes" : "No",
                                        registeredWithFMOH: serviceData.ambulanceDetails.registeredWithFederalHealth ? "Yes" : "No",
                                    };
                                }
                                setSubspecialities(serviceData.hospitalDetails.subSpecialities || []);
                                setInitialSubSpecialities(serviceData.hospitalDetails.subSpecialities || []);
                                break;

                            case "Laboratory":
                                newCapabilities = {
                                    ...newCapabilities,
                                    accreditationStatus: serviceData.labDetails.accreditationStatus || "",
                                    homeSampleCollection: serviceData.labDetails.homeSampleCollection ? "Yes" : "No",
                                    offersCovidTesting: serviceData.labDetails.covid19Testing ? "Yes" : "No",
                                    openingTime: serviceData.labDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.labDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.labDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.labDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.labDetails.additionalInfo || "",
                                    operatingDays: [],
                                };
                                break;

                            case "Pharmacy":
                                newCapabilities = {
                                    ...newCapabilities,
                                    hasLicensedPharmacist: serviceData.pharmacyDetails.hasLicensedPharmacistOnSite ? "Yes" : "No",
                                    offersDelivery: serviceData.pharmacyDetails.deliveryAvailable ? "Yes" : "No",
                                    complianceDocuments: serviceData.pharmacyDetails.complianceDocuments || [],
                                    acceptedPayments: serviceData.pharmacyDetails.acceptedPayments || [],
                                    openingTime: serviceData.pharmacyDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.pharmacyDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.pharmacyDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.pharmacyDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.pharmacyDetails.additionalInfo || "",
                                    operatingDays: [],
                                };
                                break;

                            case "Ambulance":
                                newCapabilities = {
                                    ...newCapabilities,
                                    ambulanceTypes: serviceData.ambulanceDetails.ambulanceTypes || [],
                                    vehicleEquipment: serviceData.ambulanceDetails.vehicleEquipment || [],
                                    typicalCrew: serviceData.ambulanceDetails.typicalCrew || [],
                                    averageResponseMin: serviceData.ambulanceDetails.avgResponseTime?.split(":")[0] || "",
                                    averageResponseSec: serviceData.ambulanceDetails.avgResponseTime?.split(":")[1] || "",
                                    noRoadworthyAmbulances: serviceData.ambulanceDetails.numRoadWorthyAmbulances?.toString() || "",
                                    maxDailyTrips: serviceData.ambulanceDetails.maxTripsDaily?.toString() || "",
                                    hasBackupVehicles: serviceData.ambulanceDetails.backupVehicles ? "Yes" : "No",
                                    payPerTrip: serviceData.ambulanceDetails.payPerTrip?.toString() || "",
                                    nhisInsuranceAccepted: serviceData.ambulanceDetails.insuranceAccepted ? "Yes" : "No",
                                    registeredWithFMOH: serviceData.ambulanceDetails.registeredWithFederalHealth ? "Yes" : "No",
                                    openingTime: serviceData.ambulanceDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.ambulanceDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.ambulanceDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.ambulanceDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.ambulanceDetails.additionalInfo || "",
                                    operatingDays: [],
                                };
                                break;

                            case "Insurance":
                                newCapabilities = {
                                    ...newCapabilities,
                                    coveredServices: serviceData.insuranceDetails.coveredServices || [],
                                    exclusions: serviceData.insuranceDetails.exclusions || [],
                                    preExistingConditions: serviceData.insuranceDetails.preExistingConditions ? "Yes" : "No",
                                    emergencyCoverage: serviceData.insuranceDetails.emergencyCoverage || "",
                                    accreditedHospitals: serviceData.insuranceDetails.accreditedHospitals?.map((h) => h.address) || [""],
                                    outOfNetworkReimbursement: serviceData.insuranceDetails.outOfNetworkReimbursement ? "Yes" : "No",
                                    preAuthorization: serviceData.insuranceDetails.preAuthorization || "",
                                    waitingPeriods: serviceData.insuranceDetails.waitingPeriods || [],
                                    premiumsCopayments: serviceData.insuranceDetails.premiumsCopayments || "",
                                    operatingDays: [],
                                    openingTime: serviceData.insuranceDetails.operatingHours?.openingTime || "",
                                    closingTime: serviceData.insuranceDetails.operatingHours?.closingTime || "",
                                    hasOtherBranches: serviceData.insuranceDetails.branches?.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.insuranceDetails.branches?.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.insuranceDetails.additionalInfo || "",
                                };
                                break;
                                switch (serviceData.facilityType) {
                                    // ... other cases

                                    case "SpecialistClinic":
                                        newCapabilities = {
                                            ...newCapabilities,
                                            coreServices: serviceData.specialistClinicDetails.coreServices || "",
                                            careType: serviceData.specialistClinicDetails.careType || "", // Inpatient/Outpatient/Both
                                            onSiteDoctor: serviceData.specialistClinicDetails.onSiteDoctor ? "Yes" : "No",
                                            emergencyResponsePlan: serviceData.specialistClinicDetails.emergencyResponsePlan ? "Yes" : "No",
                                            criticalCare: serviceData.specialistClinicDetails.criticalCare ? "Yes" : "No",
                                            multidisciplinaryCare: serviceData.specialistClinicDetails.multidisciplinaryCare || "",
                                            bedCapacity: serviceData.specialistClinicDetails.bedCapacity?.toString() || "",
                                            homeServices: serviceData.specialistClinicDetails.homeServices ? "Yes" : "No",
                                            onlineBooking: serviceData.specialistClinicDetails.onlineBooking ? "Yes" : "No",
                                            is24Hour: serviceData.specialistClinicDetails.is24Hour ? "Yes" : "No",
                                            patientLimit: serviceData.specialistClinicDetails.patientLimit?.toString() || "",
                                            publicHolidayWork: serviceData.specialistClinicDetails.publicHolidayWork ? "Yes" : "No",
                                            collaboratesWithOthers: serviceData.specialistClinicDetails.collaboratesWithOthers ? "Yes" : "No",
                                            worksWithHMOs: serviceData.specialistClinicDetails.worksWithHMOs ? "Yes" : "No",
                                            acceptsInsurance: serviceData.specialistClinicDetails.acceptsInsurance ? "Yes" : "No",
                                            openingTime: serviceData.specialistClinicDetails.operatingHours?.openingTime || "",
                                            closingTime: serviceData.specialistClinicDetails.operatingHours?.closingTime || "",
                                            operatingDays: serviceData.specialistClinicDetails.operatingDays || [],
                                            hasOtherBranches: serviceData.specialistClinicDetails.branches?.length > 0 ? "Yes" : "No",
                                            branchAddresses: serviceData.specialistClinicDetails.branches?.map((b) => b.address) || [""],
                                            additionalInformation: serviceData.specialistClinicDetails.additionalInfo || "",
                                        };
                                        break;

                                    default:
                                        break;
                                }


                            default:
                                break;
                        }
                        setCapabilities(newCapabilities);
                        setInitialCapabilities(JSON.parse(JSON.stringify(newCapabilities)));
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
        };
        getFacilityServices();
    }, [authData?._id]);

    const weekDays = [
        "24/7",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const facilityFeatures = [
        { id: "emergency", label: "Emergency Services" },
        { id: "ambulance", label: "Ambulance Services" },
        { id: "icu-availability", label: "ICU Availability" },
        { id: "theatre", label: "Operating Theatre" },
        { id: "dialysisUnit", label: "Dialysis Unit" },
        { id: "maternityServices", label: "Maternity Services (Obs & Gyn)" },
        { id: "bloodbank", label: "Blood Bank" },
        { id: "isolation", label: "Isolation Centre" },
    ];

    const handleToggleSpecialty = (value) => {
        setCapabilities((prev) => {
            const updated = prev.coreClinicalSpecialities.includes(value)
                ? prev.coreClinicalSpecialities.filter((item) => item !== value)
                : [...prev.coreClinicalSpecialities, value];
            return { ...prev, coreClinicalSpecialities: updated };
        });
    };
    const handleDayToggle = (day) => {
        setCapabilities((prev) => {
            let updatedDays = [...prev.operatingDays];
            let newOpeningTime = prev.openingTime;
            let newClosingTime = prev.closingTime;

            if (day === "24/7") {
                if (updatedDays.includes("24/7")) {
                    updatedDays = [];
                    newOpeningTime = "";
                    newClosingTime = "";
                } else {
                    updatedDays = weekDays.filter((d) => d !== "24/7").concat("24/7");
                    newOpeningTime = "00:00";
                    newClosingTime = "23:59";
                }
            } else {
                if (updatedDays.includes(day)) {
                    updatedDays = updatedDays.filter((d) => d !== day && d !== "24/7");
                } else {
                    updatedDays = [...updatedDays, day].filter((d) => d !== "24/7");
                }
                if (updatedDays.includes("24/7")) {
                    updatedDays = updatedDays.filter((d) => d !== "24/7");
                    newOpeningTime = "";
                    newClosingTime = "";
                }
            }

            return {
                ...prev,
                operatingDays: updatedDays,
                openingTime: newOpeningTime,
                closingTime: newClosingTime,
            };
        });
    };

    const ToggleSwitch = ({ isOn, onToggle }) => (
        <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${isOn ? "bg-cyan-500" : "bg-gray-300"}`}
            onClick={onToggle}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isOn ? "translate-x-6" : "translate-x-1"}`}
            />
        </div>
    );

    const addBranchAddress = () => {
        setCapabilities((prev) => ({
            ...prev,
            branchAddresses: [...prev.branchAddresses, ""],
        }));
    };

    const updateBranchAddress = (index, value) => {
        setCapabilities((prev) => {
            const updatedAddresses = [...prev.branchAddresses];
            updatedAddresses[index] = value;
            return { ...prev, branchAddresses: updatedAddresses };
        });
    };

    const deleteBranchAddress = (index) => {
        setCapabilities((prev) => {
            const updatedAddresses = prev.branchAddresses.filter((_, i) => i !== index);
            return { ...prev, branchAddresses: updatedAddresses };
        });
    };

    const handleToggleCompliance = (value) => {
        setCapabilities((prev) => {
            const updated = prev.complianceDocuments.includes(value)
                ? prev.complianceDocuments.filter((item) => item !== value)
                : [...prev.complianceDocuments, value];
            return { ...prev, complianceDocuments: updated };
        });
    };

    const handleTogglePayment = (value) => {
        setCapabilities((prev) => {
            const updated = prev.acceptedPayments.includes(value)
                ? prev.acceptedPayments.filter((item) => item !== value)
                : [...prev.acceptedPayments, value];
            return { ...prev, acceptedPayments: updated };
        });
    };

    const handleToggleAmbulanceType = (value) => {
        setCapabilities((prev) => {
            const updated = prev.ambulanceTypes.includes(value)
                ? prev.ambulanceTypes.filter((item) => item !== value)
                : [...prev.ambulanceTypes, value];
            return { ...prev, ambulanceTypes: updated };
        });
    };

    const handleToggleVehicleEquipment = (value) => {
        setCapabilities((prev) => {
            const updated = prev.vehicleEquipment.includes(value)
                ? prev.vehicleEquipment.filter((item) => item !== value)
                : [...prev.vehicleEquipment, value];
            return { ...prev, vehicleEquipment: updated };
        });
    };

    const handleToggleCrew = (value) => {
        setCapabilities((prev) => {
            const updated = prev.typicalCrew.includes(value)
                ? prev.typicalCrew.filter((item) => item !== value)
                : [...prev.typicalCrew, value];
            return { ...prev, typicalCrew: updated };
        });
    };

    const handleTimeChange = (field, value) => {
        setCapabilities((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleToggleCoveredService = (value) => {
        setCapabilities((prev) => {
            const updated = prev.coveredServices.includes(value)
                ? prev.coveredServices.filter((item) => item !== value)
                : [...prev.coveredServices, value];
            return { ...prev, coveredServices: updated };
        });
    };

    const handleToggleExclusion = (value) => {
        setCapabilities((prev) => {
            const updated = prev.exclusions.includes(value)
                ? prev.exclusions.filter((item) => item !== value)
                : [...prev.exclusions, value];
            return { ...prev, exclusions: updated };
        });
    };

    const addAccreditedHospital = () => {
        setCapabilities((prev) => ({
            ...prev,
            accreditedHospitals: [...prev.accreditedHospitals, ""],
        }));
    };

    const updateAccreditedHospital = (index, value) => {
        setCapabilities((prev) => {
            const updatedHospitals = [...prev.accreditedHospitals];
            updatedHospitals[index] = value;
            return { ...prev, accreditedHospitals: updatedHospitals };
        });
    };

    const deleteAccreditedHospital = (index) => {
        setCapabilities((prev) => {
            const updatedHospitals = prev.accreditedHospitals.filter((_, i) => i !== index);
            return { ...prev, accreditedHospitals: updatedHospitals };
        });
    };

    const addWaitingPeriod = () => {
        setCapabilities((prev) => ({
            ...prev,
            waitingPeriods: [...prev.waitingPeriods, { service: "", duration: "", unit: "months" }],
        }));
    };

    const updateWaitingPeriod = (index, field, value) => {
        setCapabilities((prev) => {
            const updatedPeriods = [...prev.waitingPeriods];
            updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
            return { ...prev, waitingPeriods: updatedPeriods };
        });
    };

    const deleteWaitingPeriod = (index) => {
        setCapabilities((prev) => {
            const updatedPeriods = prev.waitingPeriods.filter((_, i) => i !== index);
            return { ...prev, waitingPeriods: updatedPeriods };
        });
    };

    const prepareServiceData = () => {
        const serviceData = {
            facilityId: authData?._id,
            facilityType: facilityType,
            type: "full",
        };

        if (initialCapabilities?.coreClinicalSpecialities?.length > 0) {
            serviceData.hospitalDetails = {
                coreClinicalSpecialities: capabilities.coreClinicalSpecialities,
                subSpecialities: subSpecialities,
                facilityFeatures: capabilities.facilityFeatures,
                operationDays: capabilities.operatingDays.filter((day) => day !== "24/7"),
                openingTime: capabilities.openingTime,
                closingTime: capabilities.closingTime,
                admissionFee: Number(capabilities.admissionFee) || 0,
                consultationFee: Number(capabilities.consultationFee) || 0,
                totalBedSpace: Number(capabilities.totalBedSpace) || 0,
                hasPharmacy: capabilities.hasPharmacy === "Yes",
                hasLaboratory: capabilities.hasLaboratory === "Yes",
                externalPatientsAllowed: {
                    lab: capabilities.acceptExternalPatients === "Yes",
                    pharmacy: capabilities.acceptExternalPatients === "Yes",
                },
                branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                additionalInfo: capabilities.additionalInformation,
            };
        }

        switch (facility) {
            case "Laboratory":
                serviceData.labDetails = {
                    accreditationStatus: capabilities.accreditationStatus,
                    homeSampleCollection: capabilities.homeSampleCollection === "Yes",
                    covid19Testing: capabilities.offersCovidTesting === "Yes",
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            case "Pharmacy":
                serviceData.pharmacyDetails = {
                    hasLicensedPharmacistOnSite: capabilities.hasLicensedPharmacist === "Yes",
                    deliveryAvailable: capabilities.offersDelivery === "Yes",
                    complianceDocuments: capabilities.complianceDocuments,
                    acceptedPayments: capabilities.acceptedPayments,
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            case "Ambulance":
                serviceData.ambulanceDetails = {
                    ambulanceTypes: capabilities.ambulanceTypes,
                    vehicleEquipment: capabilities.vehicleEquipment,
                    typicalCrew: capabilities.typicalCrew,
                    avgResponseTime: `${capabilities.averageResponseMin || 0}:${capabilities.averageResponseSec || 0}`,
                    numRoadWorthyAmbulances: Number(capabilities.noRoadworthyAmbulances) || 0,
                    maxTripsDaily: Number(capabilities.maxDailyTrips) || 0,
                    backupVehicles: capabilities.hasBackupVehicles === "Yes" ? 1 : 0,
                    payPerTrip: Number(capabilities.payPerTrip) || 0,
                    flatRates: Number(capabilities.payPerTrip) || 0,
                    insuranceAccepted: capabilities.nhisInsuranceAccepted === "Yes",
                    registeredWithFederalHealth: capabilities.registeredWithFMOH === "Yes",
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            case "Insurance":
                serviceData.insuranceDetails = {
                    coveredServices: capabilities.coveredServices,
                    exclusions: capabilities.exclusions,
                    preExistingConditions: capabilities.preExistingConditions === "Yes",
                    emergencyCoverage: capabilities.emergencyCoverage,
                    accreditedHospitals: capabilities.accreditedHospitals.map((address) => ({ address })),
                    outOfNetworkReimbursement: capabilities.outOfNetworkReimbursement === "Yes",
                    preAuthorization: capabilities.preAuthorization,
                    waitingPeriods: capabilities.waitingPeriods,
                    premiumsCopayments: capabilities.premiumsCopayments,
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            default:
                if (!serviceData.hospitalDetails) {
                    serviceData.hospitalDetails = {
                        coreClinicalSpecialities: capabilities.coreClinicalSpecialities,
                        subSpecialities: subSpecialities,
                        facilityFeatures: capabilities.facilityFeatures,
                        operationDays: capabilities.operatingDays.filter((day) => day !== "24/7"),
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                        admissionFee: Number(capabilities.admissionFee) || 0,
                        consultationFee: Number(capabilities.consultationFee) || 0,
                        totalBedSpace: Number(capabilities.totalBedSpace) || 0,
                        hasPharmacy: capabilities.hasPharmacy === "Yes",
                        hasLaboratory: capabilities.hasLaboratory === "Yes",
                        externalPatientsAllowed: {
                            lab: capabilities.acceptExternalPatients === "Yes",
                            pharmacy: capabilities.acceptExternalPatients === "Yes",
                        },
                        branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                        additionalInfo: capabilities.additionalInformation,
                    };
                }
                break;
            case "SpecialistClinic":
                serviceData.specialistClinicDetails = {
                    coreServices: capabilities.coreServices,
                    careType: capabilities.careType,
                    onSiteDoctor: capabilities.onSiteDoctor === "Yes",
                    emergencyResponsePlan: capabilities.emergencyResponsePlan === "Yes",
                    criticalCare: capabilities.criticalCare === "Yes",
                    multidisciplinaryCare: capabilities.multidisciplinaryCare,
                    bedCapacity: Number(capabilities.bedCapacity) || 0,
                    homeServices: capabilities.homeServices === "Yes",
                    onlineBooking: capabilities.onlineBooking === "Yes",
                    is24Hour: capabilities.is24Hour === "Yes",
                    patientLimit: Number(capabilities.patientLimit) || 0,
                    publicHolidayWork: capabilities.publicHolidayWork === "Yes",
                    collaboratesWithOthers: capabilities.collaboratesWithOthers === "Yes",
                    worksWithHMOs: capabilities.worksWithHMOs === "Yes",
                    acceptsInsurance: capabilities.acceptsInsurance === "Yes",
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    operatingDays: capabilities.operatingDays || [],
                    branches: capabilities.hasOtherBranches === "Yes"
                        ? capabilities.branchAddresses.map((address) => ({ address }))
                        : [],
                    additionalInfo: capabilities.additionalInformation,
                };
                break;
        }

        return serviceData;
    };

    const handleSubmit = async () => {
        if (!validateOperatingHours()) {
            message.error("Please fix the operating hours before saving.");
            return;
        }
        try {
            const serviceData = prepareServiceData();
            console.log(serviceData, "service data is here");
            setSaving(true);
            const response = await FacilityServices(serviceData);
            setIsServiceSaved(true);
            setInitialCapabilities(JSON.parse(JSON.stringify(capabilities)));
            setInitialSubSpecialities([...subSpecialities]);
            setSaving(false);
            fetchAuthData();
            message.success("Service Updated Successfully!");
            navigate("/facility-dashboard/document-upload")
        } catch (error) {
            console.error("Error submitting service:", error);
            setSaving(false);
            message.error("Failed to update service. Please try again.");
        }
    };

    useEffect(() => {
        console.log(typeFacility, "type of facility is here");
    }, [typeFacility]);

    const coveredOptions = [
        "Consultation",
        "Maternity",
        "Dental",
        "Eye Care",
        "Chronic Illness",
        "Surgery",
        "Diagnostics",
        "Emergencies",
    ];
    const exclusionOptions = [
        "IVF",
        "Cosmetic Surgery",
        "Mental Health",
        "Chronic Conditions",
    ];


    return (
        <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border">
            <StepProgress currentStep={authData?.onBoardingStep} />
            <div className="mb-6 p-6 h-24 flex flex-col gap-2">
                <h2 className="text-[30px] font-semibold text-fgtext-contrast leading-[36px] tracking-[0.5%]">

                    {
                        typeFacility === "Hospital" && facility === "Ambulance" ? (
                            "Ambulance Details"
                        ) : (
                            " Service & Capacity"
                        )
                    }

                </h2>
                <p className="text-base font-inter font-medium text-[16px] leading-24px tracking-[0.5%] font-[500]">
                    Ensuring accuracy for patients, regulators, and partners
                </p>
            </div>

            <Card className="border-none shadow-none">
                <div className="p-6 space-y-6 border-none">
                    {facility === "Hospital" ? (
                        <>
                            <div className="space-y-2">


                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Core Clinical Specialities
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {CoreClinicalSpecialities.map((item) => (
                                        <div
                                            key={item.value}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <span className="text-sm text-gray-800">{item.label}</span>
                                            <ToggleSwitch
                                                isOn={capabilities.coreClinicalSpecialities.includes(item.value)}
                                                onToggle={() => handleToggleSpecialty(item.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Subspecialties subSpecialities={subSpecialities} setSubspecialities={setSubspecialities} />

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-3">Facility Features</h1>
                                <div className="flex flex-wrap gap-4">
                                    {facilityFeatures.map((feature) => (
                                        <label
                                            key={feature.id}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={feature.id}
                                                checked={capabilities.facilityFeatures.includes(feature.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updated = checked
                                                        ? [...capabilities.facilityFeatures, feature.id]
                                                        : capabilities.facilityFeatures.filter((f) => f !== feature.id);
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        facilityFeatures: updated,
                                                    }));
                                                }}
                                                className="h-4 w-4 text-[#359DF4]focus:ring-[#359DF4] border-gray-300 rounded"
                                            />
                                            {feature.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mt-3">
                                    Weekly Operating Days
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {weekDays.map((day) => (
                                        <label
                                            key={day}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={capabilities.operatingDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 md:flex-row flex-col">
                                <div className="flex-1 md:w-auto w-full">
                                    <label className="text-sm font-bold text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 md:w-auto w-full">
                                    <label className="text-sm font-bold text-gray-800">
                                        Closing Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.closingTime}
                                        onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <p className="text-red-500 text-sm">{timeError}</p>
                            )}

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-800">
                                        Admission Fee (₦)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            className="h-12 border-gray-300 rounded-md pr-12"
                                            value={capabilities.admissionFee}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    admissionFee: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter amount in ₦"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            ₦
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-800">
                                        Consultation Fee (₦)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            className="h-12 border-gray-300 rounded-md pr-12"
                                            value={capabilities.consultationFee}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    consultationFee: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter amount in ₦"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            ₦
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Total Bed Space
                                </label>
                                <Input
                                    type="number"
                                    className="h-12 border-gray-300 rounded-md"
                                    value={capabilities.totalBedSpace}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            totalBedSpace: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter number of beds"
                                />
                            </div>

                            {type !== "ambulance" && <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do have other branches?


                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.hasOtherBranches}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            hasOtherBranches: value,
                                            branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                                        }))
                                    }
                                >

                                    <Option value="">Select</Option>

                                    <Option value="No">No</Option>
                                    <Option value="Yes">Yes</Option>
                                </Select>
                                {capabilities.hasOtherBranches === "Yes" && (
                                    <div className="space-y-4 mt-4">
                                        <label className="text-sm font-bold text-gray-800">

                                            Branch Full Address (Specify the floor if the building has multiple levels)

                                        </label>
                                        {capabilities.branchAddresses.map((address, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <Input
                                                    type="text"
                                                    className="h-12 border-gray-300 rounded-md flex-1"
                                                    value={address}
                                                    onChange={(e) => updateBranchAddress(index, e.target.value)}
                                                    placeholder={`Branch ${index + 1} Address`}
                                                />
                                                <Button
                                                    className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                    onClick={() => deleteBranchAddress(index)}
                                                    disabled={capabilities.branchAddresses.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            className="h-10 px-4 bg-primarysolid text-white rounded-md"
                                            onClick={addBranchAddress}
                                        >
                                            + Add another branch
                                        </Button>
                                    </div>
                                )}
                            </div>}

                            {type !== "ambulance" && <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Additional Information
                                </label>
                                <textarea
                                    className="w-full h-32 border rounded-md p-2"
                                    value={capabilities.additionalInformation}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            additionalInformation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter any additional information"
                                />
                            </div>}
                        </>
                    ) : facility === "Laboratory" ? (
                        <>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-800">
                                            Accreditation Status
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.accreditationStatus}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    accreditationStatus: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Approved">Approved</Option>
                                            <Option value="Rejected">Rejected</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-800">
                                            Home Sample Collection
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.homeSampleCollection}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    homeSampleCollection: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                                <div className="sm:w-full">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">
                                            Do you offer COVID-19 testing?
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.offersCovidTesting}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    offersCovidTesting: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="sm:w-full">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800">
                                            Do you have other Branches?

                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.hasOtherBranches}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    hasOtherBranches: value,
                                                    branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="No">No</Option>
                                            <Option value="Yes">Yes</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Weekly Operating Days
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {weekDays.map((day) => (
                                        <label
                                            key={day}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={capabilities.operatingDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                                <div className="sm:w-full">
                                    <label className="text-sm font-bold text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md w-full"
                                        value={capabilities.openingTime}
                                        onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                    />
                                </div>
                                <div className="sm:w-full">
                                    <label className="text-sm font-bold text-gray-800">
                                        Closing Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md w-full"
                                        value={capabilities.closingTime}
                                        onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <p className="text-red-500 text-sm">{timeError}</p>
                            )}

                            <div className="space-y-2">
                                {capabilities.hasOtherBranches === "Yes" && (
                                    <div className="space-y-4 mt-4">
                                        <label className="text-sm font-bold text-gray-800">
                                            Branch Full Address (Specify the floor if the building has multiple levels)
                                        </label>
                                        {capabilities.branchAddresses.map((address, index) => (
                                            <div key={index} className="flex gap-4 items-center">

                                                <Input
                                                    type="text"
                                                    className="h-12 border-gray-300 rounded-md flex-1"
                                                    value={address}
                                                    onChange={(e) => updateBranchAddress(index, e.target.value)}
                                                    placeholder={`Branch ${index + 1} Address`}
                                                />
                                                <Button
                                                    className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                    onClick={() => deleteBranchAddress(index)}
                                                    disabled={capabilities.branchAddresses.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            className="h-10 px-4 bg-cyan-500 text-white rounded-md"
                                            onClick={addBranchAddress}
                                        >
                                            + Add another branch
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Additional Information
                                </label>
                                <textarea
                                    className="w-full h-32 border rounded-md p-2"
                                    value={capabilities.additionalInformation}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            additionalInformation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter any additional information"
                                />
                            </div>
                        </>
                    ) : facility === "Pharmacy" ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Do you have a licensed pharmacist on-site?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.hasLicensedPharmacist}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            hasLicensedPharmacist: value,
                                        }))
                                    }
                                >
                                    <Option value="">Select</Option>
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Do you offer delivery?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.offersDelivery}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            offersDelivery: value,
                                        }))
                                    }
                                >
                                    <Option value="">Select</Option>
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Compliance Documents
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {["PCN License", "NAFDAC Cert.", "CAC"].map((doc) => (
                                        <label
                                            key={doc}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={doc}
                                                checked={capabilities.complianceDocuments.includes(doc)}
                                                onChange={(e) => handleToggleCompliance(doc)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {doc}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Accepted Payments
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {["NHIS", "HMO Insurance card", "Discounts/Bulk Pricing"].map((payment) => (
                                        <label
                                            key={payment}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={payment}
                                                checked={capabilities.acceptedPayments.includes(payment)}
                                                onChange={(e) => handleTogglePayment(payment)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {payment}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Weekly Operating Days
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {weekDays.map((day) => (
                                        <label
                                            key={day}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={capabilities.operatingDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Closing Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.closingTime}
                                        onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <p className="text-red-500 text-sm">{timeError}</p>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Branch Full Address (Specify the floor if the building has multiple levels)

                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.hasOtherBranches}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            hasOtherBranches: value,
                                            branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                                        }))
                                    }
                                >
                                    <Option value="No">No</Option>
                                    <Option value="Yes">Yes</Option>
                                </Select>
                                {capabilities.hasOtherBranches === "Yes" && (
                                    <div className="space-y-4 mt-4">
                                        {capabilities.branchAddresses.map((address, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <Input
                                                    type="text"
                                                    className="h-12 border-gray-300 rounded-md flex-1"
                                                    value={address}
                                                    onChange={(e) => updateBranchAddress(index, e.target.value)}
                                                    placeholder={`Branch ${index + 1} Address`}
                                                />
                                                <Button
                                                    className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                    onClick={() => deleteBranchAddress(index)}
                                                    disabled={capabilities.branchAddresses.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            className="h-10 px-4 bg-cyan-500 text-white rounded-md"
                                            onClick={addBranchAddress}
                                        >
                                            + Add another branch
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Additional Information
                                </label>
                                <textarea
                                    className="w-full h-32 border rounded-md p-2"
                                    value={capabilities.additionalInformation}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            additionalInformation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter any additional information"
                                />
                            </div>
                        </>
                    ) : facility === "Ambulance" ? (
                        <>
                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Ambulance Types
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {["Basic Life Support (BLS)", "Advanced Support ALS", "Neonatal/ICU Transport"].map((type) => (
                                        <label
                                            key={type}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={type}
                                                checked={capabilities.ambulanceTypes.includes(type)}
                                                onChange={(e) => handleToggleAmbulanceType(type)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Vehicle Equipment Checklist
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {["Cardiac Monitor", "Oxygen & Suction Units", "Stretchers", "Ventilators"].map((equipment) => (
                                        <label
                                            key={equipment}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={equipment}
                                                checked={capabilities.vehicleEquipment.includes(equipment)}
                                                onChange={(e) => handleToggleVehicleEquipment(equipment)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {equipment}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Typical Crew per Ambulance
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {["Driver", "Paramedic", "Nurse", "Doctor"].map((crew) => (
                                        <label
                                            key={crew}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={crew}
                                                checked={capabilities.typicalCrew.includes(crew)}
                                                onChange={(e) => handleToggleCrew(crew)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {crew}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-1 max-w-[150px]">
                                        <label className="text-sm font-medium text-gray-800 block mb-1">
                                            Avg Response Time (Min)
                                        </label>
                                        <Input
                                            type="number"
                                            className="h-10 border-gray-300 rounded-md text-sm"
                                            value={capabilities.averageResponseMin}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    averageResponseMin: e.target.value,
                                                }))
                                            }
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div className="flex-1 max-w-[150px]">
                                        <label className="text-sm font-medium text-gray-800 block mb-1">
                                            Avg Response Time (Sec)
                                        </label>
                                        <Input
                                            type="number"
                                            className="h-10 border-gray-300 rounded-md text-sm"
                                            value={capabilities.averageResponseSec}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    averageResponseSec: e.target.value,
                                                }))
                                            }
                                            placeholder="Sec"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            No Roadworthy Ambulances
                                        </label>
                                        <Input
                                            type="number"
                                            className="h-12 border-gray-300 rounded-md"
                                            value={capabilities.noRoadworthyAmbulances}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    noRoadworthyAmbulances: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter number"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            Max Daily Trips
                                        </label>
                                        <Input
                                            type="number"
                                            className="h-12 border-gray-300 rounded-md"
                                            value={capabilities.maxDailyTrips}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    maxDailyTrips: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            Do you have Backup Vehicles?
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.hasBackupVehicles}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    hasBackupVehicles: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            Pay per Trip Flat Rates (₦)
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                className="h-12 border-gray-300 rounded-md pr-12"
                                                value={capabilities.payPerTrip}
                                                onChange={(e) =>
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        payPerTrip: e.target.value,
                                                    }))
                                                }
                                                placeholder="Enter amount in ₦"
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                ₦
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            NHIS / Insurance Accepted?
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.nhisInsuranceAccepted}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    nhisInsuranceAccepted: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            Registered with Federal Ministry of Health?
                                        </label>
                                        <Select
                                            className="h-12 w-full"
                                            style={{ height: "48px" }}
                                            value={capabilities.registeredWithFMOH}
                                            onChange={(value) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    registeredWithFMOH: value,
                                                }))
                                            }
                                        >
                                            <Option value="">Select</Option>
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {typeFacility === "Ambulance" && <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Weekly Operating Days
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {weekDays.map((day) => (
                                        <label
                                            key={day}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={capabilities.operatingDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            }
                            {typeFacility === "Ambulance" && <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Closing Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.closingTime}
                                        onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                    />
                                </div>
                            </div>}
                            {timeError && (
                                <p className="text-red-500 text-sm">{timeError}</p>
                            )}

                            {typeFacility === "Ambulance" && <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Do you have other Branches?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.hasOtherBranches}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            hasOtherBranches: value,
                                            branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                                        }))
                                    }
                                >
                                    <Option value="No">No</Option>
                                    <Option value="Yes">Yes</Option>
                                </Select>
                                {capabilities.hasOtherBranches === "Yes" && (
                                    <div className="space-y-4 mt-4">
                                        <label className="text-sm font-bold text-gray-800">

                                            Branch Full Address (Specify the floor if the building has multiple levels)

                                        </label>
                                        {capabilities.branchAddresses.map((address, index) => (

                                            <div key={index} className="flex gap-4 items-center">
                                                <Input
                                                    type="text"
                                                    className="h-12 border-gray-300 rounded-md flex-1"
                                                    value={address}
                                                    onChange={(e) => updateBranchAddress(index, e.target.value)}
                                                    placeholder={`Branch ${index + 1} Address`}
                                                />
                                                <Button
                                                    className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                    onClick={() => deleteBranchAddress(index)}
                                                    disabled={capabilities.branchAddresses.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            className="h-10 px-4 bg-cyan-500 text-white rounded-md"
                                            onClick={addBranchAddress}
                                        >
                                            + Add another branch
                                        </Button>
                                    </div>
                                )}
                            </div>}





                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Additional Information
                                </label>
                                <textarea
                                    className="w-full h-32 border rounded-md p-2"
                                    value={capabilities.additionalInformation}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            additionalInformation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter any additional information"
                                />
                            </div>
                        </>
                    ) : null}

                    {
                        facility === "Insurance" &&
                        <div className="space-y-6">
                            {/* Coverage Details */}
                            <div className="space-y-4">
                                <label className="text-lg font-semibold text-gray-900">Coverage Details</label>

                                {/* What's Covered */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">What’s Covered</label>
                                    <Input
                                        type="text"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.coveredServices}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                coveredServices: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter covered services (e.g., Consultation, Surgery)"
                                    />
                                </div>

                                {/* What's Not Covered */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">What’s Not Covered (Exclusions)</label>
                                    <Input
                                        type="text"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.exclusions}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                exclusions: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter exclusions (e.g., Cosmetic procedures)"
                                    />
                                </div>

                                {/* Pre-existing Conditions */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">Are Pre-existing Conditions Covered?</label>
                                    <Select
                                        className="h-12 w-full"
                                        style={{ height: "48px" }}
                                        value={capabilities.preExistingConditions}
                                        onChange={(value) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                preExistingConditions: value,
                                            }))
                                        }
                                    >
                                        <Option value="Yes">Yes</Option>
                                        <Option value="No">No</Option>
                                    </Select>
                                </div>

                                {/* Emergency Coverage */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">
                                        Coverage for Emergency Services and Ambulance Transport
                                    </label>
                                    <Select
                                        className="h-12 w-full"
                                        style={{ height: "48px" }}
                                        value={capabilities.emergencyCoverage}
                                        onChange={(value) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                emergencyCoverage: value,
                                            }))
                                        }
                                    >
                                        <Option value="Yes">Yes</Option>
                                        <Option value="No">No</Option>
                                    </Select>
                                </div>
                            </div>

                            {/* Hospital Network */}
                            <div className="space-y-4">
                                <label className="text-lg font-semibold text-gray-900">Hospital Network</label>

                                {/* Accredited Hospitals */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">
                                        List of Accredited Hospitals
                                    </label>
                                    {capabilities.accreditedHospitals.map((hospital, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <Input
                                                type="text"
                                                className="h-12 border-gray-300 rounded-md flex-1"
                                                value={hospital}
                                                onChange={(e) => updateAccreditedHospital(index, e.target.value)}
                                                placeholder={`Hospital ${index + 1} Name`}
                                            />
                                            <Button
                                                className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                onClick={() => deleteAccreditedHospital(index)}
                                                disabled={capabilities.accreditedHospitals.length === 1}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        className="h-10 px-4 bg-primarysolid text-white rounded-md"
                                        onClick={addAccreditedHospital}
                                    >
                                        + Add another hospital
                                    </Button>
                                </div>

                                {/* Out-of-Network Reimbursement */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">
                                        Are Out-of-Network Treatments Reimbursable?
                                    </label>
                                    <Select
                                        className="h-12 w-full"
                                        style={{ height: "48px" }}
                                        value={capabilities.outOfNetworkReimbursement}
                                        onChange={(value) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                outOfNetworkReimbursement: value,
                                            }))
                                        }
                                    >
                                        <Option value="Yes">Yes</Option>
                                        <Option value="No">No</Option>
                                    </Select>
                                </div>
                            </div>

                            {/* Pre-authorization Requirements */}
                            <div className="space-y-4">
                                <label className="text-lg font-semibold text-gray-900">Pre-authorization Requirements</label>

                                {/* Pre-authorization Required */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">Is Pre-authorization Required?</label>
                                    <Select
                                        className="h-12 w-full"
                                        style={{ height: "48px" }}
                                        value={capabilities.preAuthRequired}
                                        onChange={(value) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                preAuthRequired: value,
                                                preAuthorization: value === "No" ? "" : prev.preAuthorization,
                                            }))
                                        }
                                    >
                                        <Option value="Yes">Yes</Option>
                                        <Option value="No">No</Option>
                                    </Select>
                                </div>

                                {capabilities.preAuthRequired === "Yes" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-800">
                                                Which Treatments Require Pre-authorization?
                                            </label>
                                            <Input
                                                type="text"
                                                className="h-12 border-gray-300 rounded-md"
                                                value={capabilities.preAuthorization}
                                                onChange={(e) =>
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        preAuthorization: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g., Surgery, Chemotherapy"
                                            />
                                        </div>

                                        {/* Waiting Periods */}
                                        <div className="space-y-4">
                                            <label className="text-lg font-semibold text-gray-900">Waiting Periods</label>
                                            {capabilities.waitingPeriods.map((item, index) => (
                                                <div key={index} className="flex gap-4 items-center">
                                                    <Input
                                                        type="text"
                                                        className="h-12 border-gray-300 rounded-md flex-1"
                                                        value={item.service}
                                                        onChange={(e) => updateWaitingPeriod(index, "service", e.target.value)}
                                                        placeholder="Service (e.g., Surgery)"
                                                    />
                                                    <Input
                                                        type="number"
                                                        className="h-12 border-gray-300 rounded-md w-20"
                                                        value={item.duration}
                                                        onChange={(e) => updateWaitingPeriod(index, "duration", e.target.value)}
                                                        placeholder="Duration"
                                                    />
                                                    <Select
                                                        className="h-12 w-32"
                                                        style={{ height: "48px" }}
                                                        value={item.unit}
                                                        onChange={(value) => updateWaitingPeriod(index, "unit", value)}
                                                    >
                                                        <Option value="days">Days</Option>
                                                        <Option value="weeks">Weeks</Option>
                                                        <Option value="months">Months</Option>
                                                    </Select>
                                                    <Button
                                                        className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                        onClick={() => deleteWaitingPeriod(index)}
                                                        disabled={capabilities.waitingPeriods.length === 1}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                className="h-10 px-4 bg-cyan-500 text-white rounded-md"
                                                onClick={addWaitingPeriod}
                                            >
                                                + Add Service
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Premiums & Co-payments */}
                            <div className="space-y-4">
                                <label className="text-lg font-semibold text-gray-900">Premiums & Co-payments</label>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800">Premiums and Co-payments Structure</label>
                                    <Select
                                        className="h-12 w-full"
                                        style={{ height: "48px" }}
                                        value={capabilities.premiumsCopayments}
                                        onChange={(value) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                premiumsCopayments: value,
                                            }))
                                        }
                                        placeholder="Select premium and co-payment structure"
                                    >
                                        <Option value="">Select</Option>
                                        <Option value="Monthly premium of ₦5000, 20% co-pay on medicines">Monthly premium of ₦5000, 20% co-pay on medicines</Option>
                                        <Option value="Annual premium of ₦50,000, 10% co-pay on all services">Annual premium of ₦50,000, 10% co-pay on all services</Option>
                                        <Option value="Monthly premium of ₦10,000, no co-pay">Monthly premium of ₦10,000, no co-pay</Option>
                                        <Option value="Quarterly premium of ₦15,000, 15% co-pay on diagnostics">Quarterly premium of ₦15,000, 15% co-pay on diagnostics</Option>
                                        <Option value="No premium, 30% co-pay on all services">No premium, 30% co-pay on all services</Option>
                                    </Select>
                                </div>
                            </div>

                            {/* Operating Days */}
                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Weekly Operating Days
                                </h1>
                                <div className="flex flex-wrap gap-4">
                                    {weekDays.map((day) => (
                                        <label
                                            key={day}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={capabilities.operatingDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-bold text-gray-800">
                                        Closing Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.closingTime}
                                        onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            {timeError && (
                                <p className="text-red-500 text-sm">{timeError}</p>
                            )}

                            {/* Branch Addresses */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you have other Branches?

                                </label>
                                <Select
                                    className="h-12 w-full"
                                    style={{ height: "48px" }}
                                    value={capabilities.hasOtherBranches}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            hasOtherBranches: value,
                                            branchAddresses: value === "Yes" ? prev.branchAddresses : [""],
                                        }))
                                    }
                                >
                                    <Option value="No">No</Option>
                                    <Option value="Yes">Yes</Option>
                                </Select>
                                {capabilities.hasOtherBranches === "Yes" && (
                                    <div className="space-y-4 mt-4">
                                        <label className="text-sm font-bold text-gray-800">

                                            Branch Full Address (Specify the floor if the building has multiple levels)

                                        </label>
                                        {capabilities.branchAddresses.map((address, index) => (
                                            <div key={index} className="flex gap-4 items-center">
                                                <Input
                                                    type="text"
                                                    className="h-12 border-gray-300 rounded-md flex-1"
                                                    value={address}
                                                    onChange={(e) => updateBranchAddress(index, e.target.value)}
                                                    placeholder={`Branch ${index + 1} Address`}
                                                />
                                                <Button
                                                    className="h-12 px-4 bg-red-500 text-white rounded-md"
                                                    onClick={() => deleteBranchAddress(index)}
                                                    disabled={capabilities.branchAddresses.length === 1}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            className="h-10 px-4 bg-cyan-500 text-white rounded-md"
                                            onClick={addBranchAddress}
                                        >
                                            + Add another branch
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Additional Information
                                </label>
                                <TextArea
                                    rows={4}
                                    className="border-gray-300 rounded-md"
                                    value={capabilities.additionalInformation}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            additionalInformation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter any additional information"
                                />
                            </div>
                        </div>
                    }

                    {facility === "SpecialistClinic" && (
                        <div className="space-y-6">
                            {/* Core and Specialized Services */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    What are the core and specialized medical services or procedures you provide?
                                </label>
                                <TextArea
                                    rows={3}
                                    className="border-gray-300 rounded-md"
                                    value={capabilities.coreServices}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            coreServices: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., Dialysis, Fertility Treatment"
                                />
                            </div>

                            {/* Inpatient/Outpatient Care */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you offer inpatient or outpatient care (or both)?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.careType}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            careType: value,
                                        }))
                                    }
                                >
                                    <Option value="Inpatient">Inpatient</Option>
                                    <Option value="Outpatient">Outpatient</Option>
                                    <Option value="Both">Both</Option>
                                </Select>
                            </div>

                            {/* On-Site Doctor/Specialist */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Is a medical doctor or specialist always available on-site?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.onSiteDoctor}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            onSiteDoctor: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Emergency Response Plan */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you have an in-house emergency response plan?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.emergencyResponsePlan}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            emergencyResponsePlan: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Critical Care */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Are you equipped for critical care?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.criticalCare}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            criticalCare: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Multidisciplinary Care */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you offer multidisciplinary care?
                                </label>
                                <TextArea
                                    rows={3}
                                    className="border-gray-300 rounded-md"
                                    value={capabilities.multidisciplinaryCare}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            multidisciplinaryCare: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., Dieticians, Mental Health"
                                />
                            </div>

                            {/* Bed Capacity */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    What is your bed capacity (if applicable)?
                                </label>
                                <Input
                                    type="number"
                                    className="h-12 border-gray-300 rounded-md"
                                    value={capabilities.bedCapacity}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            bedCapacity: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter number of beds"
                                />
                            </div>

                            {/* Home Services */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Can your facility accommodate home services or mobile health?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.homeServices}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            homeServices: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Online Booking */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you support online pre-booking?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.onlineBooking}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            onlineBooking: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* 24/7 Availability */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Are your services available 24/7?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.is24Hour}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            is24Hour: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Operating Hours if not 24/7 */}
                            {capabilities.is24Hour === "No" && (
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm font-bold text-gray-800">
                                            Opening Time
                                        </label>
                                        <Input
                                            type="time"
                                            className="h-12 border-gray-300 rounded-md"
                                            value={capabilities.openingTime}
                                            onChange={(e) => handleTimeChange("openingTime", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm font-bold text-gray-800">
                                            Closing Time
                                        </label>
                                        <Input
                                            type="time"
                                            className="h-12 border-gray-300 rounded-md"
                                            value={capabilities.closingTime}
                                            onChange={(e) => handleTimeChange("closingTime", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Daily Patient Limit */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you have any limitations on the number of patients per day?
                                </label>
                                <Input
                                    type="text"
                                    className="h-12 border-gray-300 rounded-md"
                                    value={capabilities.patientLimit}
                                    onChange={(e) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            patientLimit: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., 50 patients"
                                />
                            </div>

                            {/* Public Holiday Work */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you work on public holidays?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.publicHolidayWork}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            publicHolidayWork: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* Collaboration with other facilities */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you work with other hospitals or clinics?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.collaboratesWithOthers}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            collaboratesWithOthers: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* HMOs */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you work with HMOs?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.worksWithHMOs}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            worksWithHMOs: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>

                            {/* NHIS/Private Insurance */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800">
                                    Do you accept NHIS or private health insurance?
                                </label>
                                <Select
                                    className="h-12 w-full"
                                    value={capabilities.acceptsInsurance}
                                    onChange={(value) =>
                                        setCapabilities((prev) => ({
                                            ...prev,
                                            acceptsInsurance: value,
                                        }))
                                    }
                                >
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </div>
                        </div>
                    )}

                </div>





            </Card>

            <div className="flex my-3 mb-8 gap-5 p-6 ">

                <Button
                    className="h-12 flex-1 px-6 bg-gray-300  font-bold hover:bg-gray-400 hover:text-white text-black rounded-md flex items-center justify-center"
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
        </div>
    );
};