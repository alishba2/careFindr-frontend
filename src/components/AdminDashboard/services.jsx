import React, { useEffect, useState } from "react";
import { GetFacilityService } from "../../services/service";

const FacilityServiceComponent = ({facilityId}) => {
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

    // ... [Keep all other existing render functions unchanged - renderHospitalDetails, renderLaboratoryDetails, etc.]

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