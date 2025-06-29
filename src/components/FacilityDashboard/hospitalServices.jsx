import React, { useEffect, useState } from "react";
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

export const HospitalServices = () => {
    const { authData, facilityType } = useAuth();

    const [porgress, stepProgress]= useState(0);



    const [facility, setFacility] = useState();
    const [subSpecialities, setSubspecialities] = useState([]);
    const [saving, setSaving] = useState(false);
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
        branchAddresses: [""],
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
    });

    useEffect(() => {
        console.log(facilityType, "facility types");
        setFacility(facilityType);
    }, [facilityType]);

    // Fetch existing service data on component mount
    useEffect(() => {
        const getFacilityServices = async () => {
            if (authData?._id) {
                try {
                    const response = await GetFacilityService();
                    console.log(response?.service, "response here");

                    if (response?.service) {

                        const serviceData = response.service;
                        stepProgress(2);

                        console.log(serviceData, "FacilityServices");
                        setFacility(serviceData.facilityType);

                        // Initialize capabilities based on facility type
                        switch (serviceData.facilityType) {
                            case "Hospital":
                                setCapabilities((prev) => ({
                                    ...prev,
                                    operatingDays: serviceData.hospitalDetails.operationDays || [],
                                    openingTime: serviceData.hospitalDetails.openingTime || "",
                                    closingTime: serviceData.hospitalDetails.closingTime || "",
                                    coreClinicalSpecialities:
                                        serviceData.hospitalDetails.coreClinicalSpecialities || [],
                                    facilityFeatures: serviceData.hospitalDetails.facilityFeatures || [],
                                    admissionFee: serviceData.hospitalDetails.admissionFee?.toString() || "",
                                    consultationFee: serviceData.hospitalDetails.consultationFee?.toString() || "",
                                    totalBedSpace: serviceData.hospitalDetails.totalBedSpace?.toString() || "",
                                    hasPharmacy: serviceData.hospitalDetails.hasPharmacy ? "Yes" : "No",
                                    hasLaboratory: serviceData.hospitalDetails.hasLaboratory ? "Yes" : "No",
                                    acceptExternalPatients:
                                        serviceData.hospitalDetails.externalPatientsAllowed?.lab ? "Yes" : "No",
                                    hasOtherBranches: serviceData.hospitalDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.hospitalDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.hospitalDetails.additionalInfo || "",
                                }));

                                console.log(serviceData.hospitalDetails.subSpecialities, "hospital specialities here");
                                setSubspecialities(serviceData.hospitalDetails.subSpecialities || []);
                                break;

                            case "Laboratory":
                                setCapabilities((prev) => ({
                                    ...prev,
                                    accreditationStatus: serviceData.labDetails.accreditationStatus || "",
                                    homeSampleCollection: serviceData.labDetails.homeSampleCollection ? "Yes" : "No",
                                    offersCovidTesting: serviceData.labDetails.covid19Testing ? "Yes" : "No",
                                    openingTime: serviceData.labDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.labDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.labDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.labDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.labDetails.additionalInfo || "",
                                    operatingDays: [], // Add if needed based on schema
                                }));
                                break;

                            case "Pharmacy":
                                setCapabilities((prev) => ({
                                    ...prev,
                                    hasLicensedPharmacist: serviceData.pharmacyDetails.hasLicensedPharmacistOnSite
                                        ? "Yes"
                                        : "No",
                                    offersDelivery: serviceData.pharmacyDetails.deliveryAvailable ? "Yes" : "No",
                                    complianceDocuments: serviceData.pharmacyDetails.complianceDocuments || [],
                                    acceptedPayments: serviceData.pharmacyDetails.acceptedPayments || [],
                                    openingTime: serviceData.pharmacyDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.pharmacyDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.pharmacyDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.pharmacyDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.pharmacyDetails.additionalInfo || "",
                                    operatingDays: [], // Add if needed based on schema
                                }));
                                break;

                            case "Ambulance":
                                setCapabilities((prev) => ({
                                    ...prev,
                                    ambulanceTypes: serviceData.ambulanceDetails.ambulanceTypes || [],
                                    vehicleEquipment: serviceData.ambulanceDetails.vehicleEquipment || [],
                                    typicalCrew: serviceData.ambulanceDetails.typicalCrew || [],
                                    averageResponseMin: serviceData.ambulanceDetails.avgResponseTime
                                        ?.split(":")[0] || "",
                                    averageResponseSec: serviceData.ambulanceDetails.avgResponseTime
                                        ?.split(":")[1] || "",
                                    noRoadworthyAmbulances:
                                        serviceData.ambulanceDetails.numRoadWorthyAmbulances?.toString() || "",
                                    maxDailyTrips: serviceData.ambulanceDetails.maxTripsDaily?.toString() || "",
                                    hasBackupVehicles: serviceData.ambulanceDetails.backupVehicles ? "Yes" : "No",
                                    payPerTrip: serviceData.ambulanceDetails.payPerTrip?.toString() || "",
                                    nhisInsuranceAccepted: serviceData.ambulanceDetails.insuranceAccepted ? "Yes" : "No",
                                    registeredWithFMOH:
                                        serviceData.ambulanceDetails.registeredWithFederalHealth ? "Yes" : "No",
                                    openingTime: serviceData.ambulanceDetails.operatingHours.openingTime || "",
                                    closingTime: serviceData.ambulanceDetails.operatingHours.closingTime || "",
                                    hasOtherBranches: serviceData.ambulanceDetails.branches.length > 0 ? "Yes" : "No",
                                    branchAddresses: serviceData.ambulanceDetails.branches.map((b) => b.address) || [""],
                                    additionalInformation: serviceData.ambulanceDetails.additionalInfo || "",
                                    operatingDays: [], // Add if needed based on schema
                                }));
                                break;

                            default:
                                break;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching service:", error);
                }
            }
        };
        getFacilityServices();
    }, []);

    const weekDays = [
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

    const ToggleSwitch = ({ isOn, onToggle }) => (
        <div
            className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-300 ${isOn ? "bg-cyan-500" : "bg-gray-300"
                }`}
            onClick={onToggle}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isOn ? "translate-x-6" : "translate-x-1"
                    }`}
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

    // Prepare data for submission based on facility type
    const prepareServiceData = () => {
        const serviceData = {
            facilityId: authData?._id,
            facilityType: facility
        };

        switch (facility) {
            case "Hospital":
                serviceData.hospitalDetails = {
                    coreClinicalSpecialities: capabilities.coreClinicalSpecialities,
                    subSpecialities: subSpecialities, // Assuming Subspecialties component populates this
                    facilityFeatures: capabilities.facilityFeatures,
                    operationDays: capabilities.operatingDays,
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
                    branches: capabilities.branchAddresses.map((address) => ({ address })),
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            case "Laboratory":
                serviceData.labDetails = {
                    accreditationStatus: capabilities.accreditationStatus,
                    homeSampleCollection: capabilities.homeSampleCollection === "Yes",
                    covid19Testing: capabilities.offersCovidTesting === "Yes",
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.branchAddresses.map((address) => ({ address })),
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
                    branches: capabilities.branchAddresses.map((address) => ({ address })),
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            case "Ambulance":
                serviceData.ambulanceDetails = {
                    ambulanceTypes: capabilities.ambulanceTypes,
                    vehicleEquipment: capabilities.vehicleEquipment,
                    typicalCrew: capabilities.typicalCrew,
                    avgResponseTime: `${capabilities.averageResponseMin || 0}:${capabilities.averageResponseSec || 0}`, // Format as "min:sec"
                    numRoadWorthyAmbulances: Number(capabilities.noRoadworthyAmbulances) || 0,
                    maxTripsDaily: Number(capabilities.maxDailyTrips) || 0,
                    backupVehicles: capabilities.hasBackupVehicles === "Yes" ? 1 : 0,
                    payPerTrip: Number(capabilities.payPerTrip) || 0,
                    flatRates: Number(capabilities.payPerTrip) || 0, // Assuming flatRates is same as payPerTrip
                    insuranceAccepted: capabilities.nhisInsuranceAccepted === "Yes",
                    registeredWithFederalHealth: capabilities.registeredWithFMOH === "Yes",
                    operatingHours: {
                        openingTime: capabilities.openingTime,
                        closingTime: capabilities.closingTime,
                    },
                    branches: capabilities.branchAddresses.map((address) => ({ address })),
                    additionalInfo: capabilities.additionalInformation,
                };
                break;

            default:
                break;
        }

        return serviceData;
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const serviceData = prepareServiceData();
            setSaving(true);
            console.log(serviceData, "serviceData");
            const response = await FacilityServices(serviceData); // Fixed function name
            setSaving(false);
            console.log("Service created:", response);
            message.success("Service Updated Successfully!");
            // Optionally reset form or show success message
        } catch (error) {
            console.error("Error submitting service:", error);
            setSaving(false);
        }
    };
    
   
    return (
        <div className="flex flex-col w-full max-w-full px-4 shadow-md rounded-[15px] bg-white border">
            <StepProgress currentStep={authData?.onBoardingStep} />
            <div className="mb-10 p-6 h-24 flex flex-col gap-2">
                <h2 className="text-[30px] font-semibold text-fgtext-contrast leading-[36px] tracking-[0.5%]">
                    Service & Capacity
                </h2>
                <p className="text-base font-inter font-medium text-[16px] leading-24px tracking-[0.5%] font-[500]">
                    Ensuring accuracy for patients, regulators, and partners
                </p>
            </div>

            <Card className="border-none shadow-none">
                <div className="p-6 space-y-6 border-none">
                    {facility === "Hospital" ? (
                        <>
                            {/* Core Clinical Specialities */}
                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">
                                    Core Clinical Specialities
                                </h1>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

                            {/* Subspecialties */}
                            <Subspecialties subSpecialities={subSpecialities} setSubspecialities={setSubspecialities} />

                            {/* Facility Features */}
                            <div className="space-y-2">
                                <h1 className="text-sm font-bold text-gray-900 mb-2">Facility Features</h1>
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
                                            />
                                            {feature.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Operating Days */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updated = checked
                                                        ? [...capabilities.operatingDays, day]
                                                        : capabilities.operatingDays.filter((d) => d !== day);
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        operatingDays: updated,
                                                    }));
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Opening & Closing Time */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                openingTime: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                closingTime: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Admission Fee & Consultation Fee */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Admission Fee
                                    </label>
                                    <Input
                                        type="number"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.admissionFee}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                admissionFee: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter admission fee"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Consultation Fee
                                    </label>
                                    <Input
                                        type="number"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.consultationFee}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                consultationFee: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter consultation fee"
                                    />
                                </div>
                            </div>

                            {/* Total Bed Space */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
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
                                    placeholder="Enter total bed space"
                                />
                            </div>

                            {/* Additional Information */}
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

                            {/* Other Branches */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Other Branches
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
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
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
                        </>
                    ) : facility === "Laboratory" ? (
                        <>
                            {/* Accreditation Status and Home Sample Collection */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
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
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
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

                            {/* COVID-19 Testing */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
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
                                <div className="flex-1">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-800">
                                            Other Branches
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
                                            <Option value="Yes">Yes</Option>
                                            <Option value="No">No</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Operating Days */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updated = checked
                                                        ? [...capabilities.operatingDays, day]
                                                        : capabilities.operatingDays.filter((d) => d !== day);
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        operatingDays: updated,
                                                    }));
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Opening & Closing Time */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                openingTime: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                closingTime: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
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

                            {/* Other Branches */}
                            <div className="space-y-2">
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
                        </>
                    ) : facility === "Pharmacy" ? (
                        <>
                            {/* Licensed Pharmacist */}
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

                            {/* Delivery Services */}
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

                            {/* Compliance Documents */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    handleToggleCompliance(doc);
                                                }}
                                            />
                                            {doc}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Accepted Payments */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    handleTogglePayment(payment);
                                                }}
                                            />
                                            {payment}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Operating Days */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updated = checked
                                                        ? [...capabilities.operatingDays, day]
                                                        : capabilities.operatingDays.filter((d) => d !== day);
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        operatingDays: updated,
                                                    }));
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Opening & Closing Time */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                openingTime: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                closingTime: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
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

                            {/* Other Branches */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Other Branches
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
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
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
                        </>
                    ) : facility === "Ambulance" ? (
                        <>
                            {/* Ambulance Types */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    handleToggleAmbulanceType(type);
                                                }}
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Equipment Checklist */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    handleToggleVehicleEquipment(equipment);
                                                }}
                                            />
                                            {equipment}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Typical Crew per Ambulance */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    handleToggleCrew(crew);
                                                }}
                                            />
                                            {crew}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Average Response Time */}
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

                            {/* No Roadworthy Ambulances & Max Daily Trips */}
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

                            {/* Backup Vehicles & Pay per Trip Flat Rates */}
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
                                            Pay per Trip Flat Rates
                                        </label>
                                        <Input
                                            type="number"
                                            className="h-12 border-gray-300 rounded-md"
                                            value={capabilities.payPerTrip}
                                            onChange={(e) =>
                                                setCapabilities((prev) => ({
                                                    ...prev,
                                                    payPerTrip: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* NHIS / Insurance Accepted & Registered with Federal Ministry of Health */}
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

                            {/* Weekly Operating Days */}
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
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const updated = checked
                                                        ? [...capabilities.operatingDays, day]
                                                        : capabilities.operatingDays.filter((d) => d !== day);
                                                    setCapabilities((prev) => ({
                                                        ...prev,
                                                        operatingDays: updated,
                                                    }));
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Opening & Closing Time */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-800">
                                        Opening Time
                                    </label>
                                    <Input
                                        type="time"
                                        className="h-12 border-gray-300 rounded-md"
                                        value={capabilities.openingTime}
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                openingTime: e.target.value,
                                            }))
                                        }
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
                                        onChange={(e) =>
                                            setCapabilities((prev) => ({
                                                ...prev,
                                                closingTime: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Additional Information */}
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

                            {/* Other Branches */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-800">
                                    Other Branches
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
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
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
                        </>
                    ) : null}
                </div>
            </Card>

            <div className="flex justify-end p-4">
                <Button
                    className="h-12 px-6 bg-primarysolid text-white rounded-md flex items-center justify-center"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <span className="loader mr-2" /> Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </div>
    );
};