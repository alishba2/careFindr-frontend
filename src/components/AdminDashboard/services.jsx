import React, { useEffect, useState } from "react";
import { GetFacilityService } from "../../services/service";

const FacilityServiceComponent = ({ facilityId }) => {
    const [serviceData, setServiceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!facilityId) {
                setError(new Error("Facility ID is required"));
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await GetFacilityService(facilityId);
                setServiceData(response);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceData();
    }, [facilityId]);

    const renderServiceDetails = () => {
        if (!serviceData?.service) return null;

        const { service } = serviceData;
        const { facilityType } = service;

        switch (facilityType) {
            case 'Hospital':
                return renderHospitalDetails(service.hospitalDetails);
            case 'Laboratory':
                return renderLaboratoryDetails(service.labDetails);
            case 'Pharmacy':
                return renderPharmacyDetails(service.pharmacyDetails);
            case 'Ambulance':
                return renderAmbulanceDetails(service.ambulanceDetails);
            case 'Insurance':
                return renderInsuranceDetails(service.insuranceDetails);
            case 'SpecialistClinic':
                return renderSpecialistClinicDetails(service.SpecialistClinic);
            case 'Blood Bank':
                return renderBloodBankDetails(service.bloodBankDetails);
            default:
                return <div className="text-gray-500">Unknown facility type</div>;
        }
    };

    // 🩸 NEW: Blood Bank Details Renderer
    const renderBloodBankDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No blood bank details available</p>
            </div>
        );

        return (
            <div className="bg-white p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Mobile Donation Units</p>
                        <p className={`font-semibold ${details.hasMobileDonationUnits ? 'text-green-600' : 'text-red-600'}`}>
                            {details.hasMobileDonationUnits ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Phlebotomists Certified</p>
                        <p className={`font-semibold ${details.allPhlebotomistsCertified ? 'text-green-600' : 'text-red-600'}`}>
                            {details.allPhlebotomistsCertified ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Accepts Returned Blood</p>
                        <p className={`font-semibold ${details.acceptsReturnedBlood ? 'text-green-600' : 'text-red-600'}`}>
                            {details.acceptsReturnedBlood ? 'Yes' : 'No'}
                        </p>
                    </div>
                    {details.returnTimeFrame && (
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-gray-600">Return Time Frame</p>
                            <p className="font-semibold text-gray-900">{details.returnTimeFrame}</p>
                        </div>
                    )}
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Walk-in Support</p>
                        <p className={`font-semibold ${details.allowsDirectPatientRequests ? 'text-green-600' : 'text-red-600'}`}>
                            {details.allowsDirectPatientRequests ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Emergency Delivery</p>
                        <p className={`font-semibold ${details.providesEmergencyDelivery ? 'text-green-600' : 'text-red-600'}`}>
                            {details.providesEmergencyDelivery ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    {details.emergencyResponseTime && (
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-gray-600">Emergency Response Time</p>
                            <p className="font-semibold text-blue-600">{details.emergencyResponseTime}</p>
                        </div>
                    )}
                    {details.logisticsType && (
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-gray-600">Logistics Type</p>
                            <p className="font-semibold text-gray-900">{details.logisticsType}</p>
                        </div>
                    )}
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Delivery Charges</p>
                        <p className={`font-semibold ${details.chargesForDelivery ? 'text-red-600' : 'text-green-600'}`}>
                            {details.chargesForDelivery ? `₦${details.deliveryCost || 'Contact for pricing'}` : 'Free'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Priority Dispatch</p>
                        <p className={`font-semibold ${details.priorityDispatchAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {details.priorityDispatchAvailable ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Accepts Insurance</p>
                        <p className={`font-semibold ${details.acceptsInsurance ? 'text-green-600' : 'text-red-600'}`}>
                            {details.acceptsInsurance ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Donor Retention Strategy</p>
                        <p className={`font-semibold ${details.hasDonorRetentionStrategy ? 'text-green-600' : 'text-red-600'}`}>
                            {details.hasDonorRetentionStrategy ? 'Yes' : 'No'}
                        </p>
                    </div>
                    {details.averageBloodCollectionTime && (
                        <div className="p-4 bg-gray-50 rounded border">
                            <p className="text-sm text-gray-600">Collection Time</p>
                            <p className="font-semibold text-blue-600">{details.averageBloodCollectionTime}</p>
                        </div>
                    )}
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Blood Products */}
                {details.bloodProductsProvided && details.bloodProductsProvided.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Blood Products Available</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.bloodProductsProvided.map((product, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                                    {product}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Operating Days */}
                {details.operatingDays && details.operatingDays.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Operating Days</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.operatingDays.map((day, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Donation Systems */}
                {details.donationSystems && details.donationSystems.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Donation Systems</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.donationSystems.map((system, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                                    {system}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Capacity & Inventory Information */}
                {(details.currentBloodInventoryCapacity || details.maxStorageCapacityPerComponent) && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Capacity & Inventory</h3>
                        <div className="space-y-3">
                            {details.currentBloodInventoryCapacity && (
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                                    <p className="text-sm font-medium text-gray-800">Current Inventory Capacity</p>
                                    <p className="text-gray-700">{details.currentBloodInventoryCapacity}</p>
                                </div>
                            )}
                            {details.maxStorageCapacityPerComponent && (
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-green-400">
                                    <p className="text-sm font-medium text-gray-800">Storage Capacity per Component</p>
                                    <p className="text-gray-700">{details.maxStorageCapacityPerComponent}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Testing & Safety */}
                {details.infectionsTestedFor && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Infections & Conditions Tested</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-red-400">
                            {details.infectionsTestedFor}
                        </p>
                    </div>
                )}

                {/* Management Procedures */}
                <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Management & Procedures</h3>
                    {details.shortageManagement && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-yellow-400">
                            <p className="text-sm font-medium text-gray-800">Shortage Management</p>
                            <p className="text-gray-700">{details.shortageManagement}</p>
                        </div>
                    )}
                    {details.expiryDateTracking && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-purple-400">
                            <p className="text-sm font-medium text-gray-800">Expiry Date Tracking</p>
                            <p className="text-gray-700">{details.expiryDateTracking}</p>
                        </div>
                    )}
                    {details.bloodExpiryManagement && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-indigo-400">
                            <p className="text-sm font-medium text-gray-800">Blood Expiry Management</p>
                            <p className="text-gray-700">{details.bloodExpiryManagement}</p>
                        </div>
                    )}
                    {details.coldChainProcedures && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-cyan-400">
                            <p className="text-sm font-medium text-gray-800">Cold Chain Procedures</p>
                            <p className="text-gray-700">{details.coldChainProcedures}</p>
                        </div>
                    )}
                    {details.auditFrequency && (
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-pink-400">
                            <p className="text-sm font-medium text-gray-800">Audit Frequency</p>
                            <p className="text-gray-700">{details.auditFrequency}</p>
                        </div>
                    )}
                </div>

                {/* Turnaround Times */}
                {(details.turnaroundTimeEmergency || details.turnaroundTimeNonEmergency) && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Turnaround Times</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.turnaroundTimeEmergency && (
                                <div className="p-4 bg-red-50 rounded border border-red-200">
                                    <p className="text-sm font-medium text-red-800">Emergency Cases</p>
                                    <p className="text-red-700 font-semibold">{details.turnaroundTimeEmergency}</p>
                                </div>
                            )}
                            {details.turnaroundTimeNonEmergency && (
                                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800">Non-Emergency Cases</p>
                                    <p className="text-blue-700 font-semibold">{details.turnaroundTimeNonEmergency}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing Information */}
                {details.bloodProductCosts && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Pricing Information</h3>
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-green-400">
                            <p className="text-gray-700">{details.bloodProductCosts}</p>
                        </div>
                    </div>
                )}

                {/* Donor Information */}
                {(details.donorRecruitmentMethods || details.dailyWeeklyRequestVolume) && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Donor & Request Information</h3>
                        <div className="space-y-3">
                            {details.donorRecruitmentMethods && (
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-orange-400">
                                    <p className="text-sm font-medium text-gray-800">Donor Recruitment Methods</p>
                                    <p className="text-gray-700">{details.donorRecruitmentMethods}</p>
                                </div>
                            )}
                            {details.dailyWeeklyRequestVolume && (
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-teal-400">
                                    <p className="text-sm font-medium text-gray-800">Request Volume</p>
                                    <p className="text-gray-700">{details.dailyWeeklyRequestVolume}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {details.accreditationsCertifications && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Accreditations & Certifications</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.accreditationsCertifications}
                        </p>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderHospitalDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No hospital details available</p>
            </div>
        );

        return (
            <div className="border  border-gray-200 rounded-lg p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 bg-none  sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Opening Time</p>
                        <p className="font-semibold text-gray-900">{details.openingTime}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Closing Time</p>
                        <p className="font-semibold text-gray-900">{details.closingTime}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Admission Fee</p>
                        <p className="font-semibold text-green-600">${details.admissionFee}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Consultation Fee</p>
                        <p className="font-semibold text-green-600">${details.consultationFee}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Total Bed Space</p>
                        <p className="font-semibold text-blue-600">{details.totalBedSpace}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600 mb-2">Facilities</p>
                        <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${details.hasLaboratory ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Lab: {details.hasLaboratory ? 'Yes' : 'No'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${details.hasPharmacy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Pharmacy: {details.hasPharmacy ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Operation Days */}
                {details.operationDays && details.operationDays.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Operation Days</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.operationDays.map((day, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Core Clinical Specialities */}
                {details.coreClinicalSpecialities && details.coreClinicalSpecialities.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Core Clinical Specialities</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.coreClinicalSpecialities.map((specialty, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm capitalize">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub Specialities */}
                {details.subSpecialities && details.subSpecialities.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Sub Specialities</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.subSpecialities.map((specialty, index) => (
                                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Facility Features */}
                {details.facilityFeatures && details.facilityFeatures.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Facility Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.facilityFeatures.map((feature, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm capitalize">
                                    {feature.replace('-', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.name && (
                                        <p className="text-sm mb-1">
                                            <span className="font-medium">Name:</span> {branch.name}
                                        </p>
                                    )}
                                    {branch.address && (
                                        <div className="text-sm mb-1">
                                            <span className="font-medium">Address:</span>
                                            {Array.isArray(branch.address) ? (
                                                <ul className="ml-4 mt-1">
                                                    {branch.address.map((addr, addrIndex) => (
                                                        <li key={addrIndex} className="text-gray-600">• {addr}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-600"> {branch.address}</span>
                                            )}
                                        </div>
                                    )}
                                    {branch.phone && (
                                        <p className="text-sm mb-1">
                                            <span className="font-medium">Phone:</span> <span className="text-gray-600">{branch.phone}</span>
                                        </p>
                                    )}
                                    {branch.email && (
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span> <span className="text-gray-600">{branch.email}</span>
                                        </p>
                                    )}

                                    {/* Show other branch properties */}
                                    {Object.keys(branch).filter(key => !['name', 'address', 'phone', 'email'].includes(key)).map(key => (
                                        <p key={key} className="text-sm">
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="text-gray-600"> {String(branch[key])}</span>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };
    const renderSpecialistClinicDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No specialist clinic details available</p>
            </div>
        );

        return (
            <div className="bg-white p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Care Type</p>
                        <p className="font-semibold text-gray-900">{details.careType || 'Not specified'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">On-Site Doctor</p>
                        <p className={`font-semibold ${details.onSiteDoctor ? 'text-green-600' : 'text-red-600'}`}>
                            {details.onSiteDoctor ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Emergency Response Plan</p>
                        <p className={`font-semibold ${details.emergencyResponsePlan ? 'text-green-600' : 'text-red-600'}`}>
                            {details.emergencyResponsePlan ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Critical Care</p>
                        <p className={`font-semibold ${details.criticalCare ? 'text-green-600' : 'text-red-600'}`}>
                            {details.criticalCare ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Bed Capacity</p>
                        <p className="font-semibold text-blue-600">{details.bedCapacity || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Home Services</p>
                        <p className={`font-semibold ${details.homeServices ? 'text-green-600' : 'text-red-600'}`}>
                            {details.homeServices ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Online Booking</p>
                        <p className={`font-semibold ${details.onlineBooking ? 'text-green-600' : 'text-red-600'}`}>
                            {details.onlineBooking ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">24 Hour Service</p>
                        <p className={`font-semibold ${details.is24Hour ? 'text-green-600' : 'text-red-600'}`}>
                            {details.is24Hour ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Patient Limit</p>
                        <p className="font-semibold text-gray-900">{details.patientLimit || 'No limit'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Public Holiday Work</p>
                        <p className={`font-semibold ${details.publicHolidayWork ? 'text-green-600' : 'text-red-600'}`}>
                            {details.publicHolidayWork ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Collaborates with Others</p>
                        <p className={`font-semibold ${details.collaboratesWithOthers ? 'text-green-600' : 'text-red-600'}`}>
                            {details.collaboratesWithOthers ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Works with HMOs</p>
                        <p className={`font-semibold ${details.worksWithHMOs ? 'text-green-600' : 'text-red-600'}`}>
                            {details.worksWithHMOs ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Accepts Insurance</p>
                        <p className={`font-semibold ${details.acceptsInsurance ? 'text-green-600' : 'text-red-600'}`}>
                            {details.acceptsInsurance ? 'Yes' : 'No'}
                        </p>
                    </div>

                    {/* Operating Hours */}
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Core Services */}
                {details.coreServices && details.coreServices.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Core Services</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.coreServices.map((service, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Multidisciplinary Care */}
                {details.multidisciplinaryCare && details.multidisciplinaryCare.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Multidisciplinary Care</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.multidisciplinaryCare.map((care, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                                    {care}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Operating Days */}
                {details.operatingDays && details.operatingDays.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Operating Days</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.operatingDays.includes('24/7') ? (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">24/7</span>
                            ) : (
                                details.operatingDays.map((day, index) => (
                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                        {day}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                    error: 'Facility documents not found'
                                    {/* Show other branch properties if any */}
                                    {Object.keys(branch).filter(key => key !== 'address').map(key => (
                                        <p key={key} className="text-sm">
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="text-gray-600"> {String(branch[key])}</span>
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };
    const renderLaboratoryDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No laboratory details available</p>
            </div>
        );

        return (
            <div className=" p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Accreditation Status</p>
                        <p className={`font-semibold ${details.accreditationStatus === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                            {details.accreditationStatus || 'Not specified'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Home Sample Collection</p>
                        <p className={`font-semibold ${details.homeSampleCollection ? 'text-green-600' : 'text-red-600'}`}>
                            {details.homeSampleCollection ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">COVID-19 Testing</p>
                        <p className={`font-semibold ${details.covid19Testing ? 'text-green-600' : 'text-red-600'}`}>
                            {details.covid19Testing ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderPharmacyDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No pharmacy details available</p>
            </div>
        );

        return (
            <div className="bg-white p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Licensed Pharmacist On Site</p>
                        <p className={`font-semibold ${details.hasLicensedPharmacistOnSite ? 'text-green-600' : 'text-red-600'}`}>
                            {details.hasLicensedPharmacistOnSite ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Delivery Available</p>
                        <p className={`font-semibold ${details.deliveryAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {details.deliveryAvailable ? 'Yes' : 'No'}
                        </p>
                    </div>
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Compliance Documents */}
                {details.complianceDocuments && details.complianceDocuments.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Compliance Documents</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.complianceDocuments.map((doc, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                    {doc}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Accepted Payments */}
                {details.acceptedPayments && details.acceptedPayments.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Accepted Payments</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.acceptedPayments.map((payment, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                                    {payment}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderAmbulanceDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No ambulance details available</p>
            </div>
        );

        return (
            <div className="bg-white p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Average Response Time</p>
                        <p className="font-semibold text-blue-600">{details.avgResponseTime || 'Not specified'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Road Worthy Ambulances</p>
                        <p className="font-semibold text-gray-900">{details.numRoadWorthyAmbulances || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Max Daily Trips</p>
                        <p className="font-semibold text-gray-900">{details.maxTripsDaily || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Backup Vehicles</p>
                        <p className="font-semibold text-gray-900">{details.backupVehicles || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Pay Per Trip</p>
                        <p className="font-semibold text-green-600">₦{details.payPerTrip || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Flat Rates</p>
                        <p className="font-semibold text-green-600">₦{details.flatRates || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Insurance Accepted</p>
                        <p className={`font-semibold ${details.insuranceAccepted ? 'text-green-600' : 'text-red-600'}`}>
                            {details.insuranceAccepted ? 'Yes' : 'No'}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-sm text-gray-600">Registered with Federal Health</p>
                        <p className={`font-semibold ${details.registeredWithFederalHealth ? 'text-green-600' : 'text-red-600'}`}>
                            {details.registeredWithFederalHealth ? 'Yes' : 'No'}
                        </p>
                    </div>
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Ambulance Types */}
                {details.ambulanceTypes && details.ambulanceTypes.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Ambulance Types</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.ambulanceTypes.map((type, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vehicle Equipment */}
                {details.vehicleEquipment && details.vehicleEquipment.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Vehicle Equipment</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.vehicleEquipment.map((equipment, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                                    {equipment}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Typical Crew */}
                {details.typicalCrew && details.typicalCrew.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Typical Crew</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.typicalCrew.map((crew, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                    {crew}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderInsuranceDetails = (details) => {
        if (!details) return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                <p className="text-yellow-700">No insurance details available</p>
            </div>
        );

        return (
            <div className="bg-white p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {details.operatingHours && (
                        <>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Opening Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.openingTime}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-600">Closing Time</p>
                                <p className="font-semibold text-gray-900">{details.operatingHours.closingTime}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Coverage Information */}
                {details.coveredServices && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Covered Services</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-green-400">
                            {details.coveredServices}
                        </p>
                    </div>
                )}

                {details.exclusions && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Exclusions</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-red-400">
                            {details.exclusions}
                        </p>
                    </div>
                )}

                {details.preExistingConditions && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Pre-existing Conditions</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-yellow-400">
                            {details.preExistingConditions}
                        </p>
                    </div>
                )}

                {details.emergencyCoverage && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Emergency Coverage</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.emergencyCoverage}
                        </p>
                    </div>
                )}

                {details.outOfNetworkReimbursement && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Out of Network Reimbursement</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-purple-400">
                            {details.outOfNetworkReimbursement}
                        </p>
                    </div>
                )}

                {details.preAuthorization && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Pre-authorization</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-indigo-400">
                            {details.preAuthorization}
                        </p>
                    </div>
                )}

                {details.premiumsCopayments && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Premiums & Copayments</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-green-400">
                            {details.premiumsCopayments}
                        </p>
                    </div>
                )}

                {/* Waiting Periods */}
                {details.waitingPeriods && details.waitingPeriods.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Waiting Periods</h3>
                        <div className="space-y-2">
                            {details.waitingPeriods.map((period, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                                    <span className="font-medium">{period.service}</span>
                                    <span className="text-gray-600">{period.duration} {period.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Accredited Hospitals */}
                {details.accreditedHospitals && details.accreditedHospitals.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Accredited Hospitals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.accreditedHospitals.map((hospital, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Hospital {index + 1}</h4>
                                    {hospital.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {hospital.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branches */}
                {details.branches && details.branches.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Branches</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.branches.map((branch, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-900 mb-2">Branch {index + 1}</h4>
                                    {branch.address && (
                                        <p className="text-sm">
                                            <span className="font-medium">Address:</span>
                                            <span className="text-gray-600"> {branch.address}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {details.additionalInfo && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            {details.additionalInfo}
                        </p>
                    </div>
                )}
            </div>
        );
    };


    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
            <p className="text-red-700">Error: {error.message}</p>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            {renderServiceDetails()}
        </div>
    );
};

export default FacilityServiceComponent;