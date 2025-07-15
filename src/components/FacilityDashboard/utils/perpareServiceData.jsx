export const prepareServiceData = (facilityId, facilityType, facility, capabilities, subSpecialities, initialCapabilities) => {
    const serviceData = {
        facilityId: facilityId,
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
            externalPatientsAllowed: capabilities.externalPatientsAllowed === "Yes",
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

        // 🩸 NEW: Blood Bank Case
        case "Blood Bank":
            serviceData.bloodBankDetails = {
                // Blood Products and Types
                bloodProductsProvided: capabilities.bloodProductsProvided || [],
                
                // Screening and Safety
                infectionsTestedFor: capabilities.infectionsTestedFor || "",
                
                // Inventory and Capacity
                currentBloodInventoryCapacity: capabilities.currentBloodInventoryCapacity || "",
                maxStorageCapacityPerComponent: capabilities.maxStorageCapacityPerComponent || "",
                shortageManagement: capabilities.shortageManagement || "",
                expiryDateTracking: capabilities.expiryDateTracking || "",
                hasMobileDonationUnits: capabilities.hasMobileDonationUnits === "Yes",
                averageBloodCollectionTime: capabilities.averageBloodCollectionTime || "",
                
                // Operational Standards
                acceptsReturnedBlood: capabilities.acceptsReturnedBlood === "Yes",
                returnTimeFrame: capabilities.returnTimeFrame || "",
                allPhlebotomistsCertified: capabilities.allPhlebotomistsCertified === "Yes",
                auditFrequency: capabilities.auditFrequency || "",
                dailyWeeklyRequestVolume: capabilities.dailyWeeklyRequestVolume || "",
                bloodExpiryManagement: capabilities.bloodExpiryManagement || "",
                allowsDirectPatientRequests: capabilities.allowsDirectPatientRequests === "Yes",
                
                // Logistics & Delivery
                providesEmergencyDelivery: capabilities.providesEmergencyDelivery === "Yes",
                emergencyResponseTime: capabilities.emergencyResponseTime || "",
                logisticsType: capabilities.logisticsType || "",
                coldChainProcedures: capabilities.coldChainProcedures || "",
                chargesForDelivery: capabilities.chargesForDelivery === "Yes",
                deliveryCost: Number(capabilities.deliveryCost) || 0,
                priorityDispatchAvailable: capabilities.priorityDispatchAvailable === "Yes",
                turnaroundTimeEmergency: capabilities.turnaroundTimeEmergency || "",
                turnaroundTimeNonEmergency: capabilities.turnaroundTimeNonEmergency || "",
                
                // Pricing & Payment
                bloodProductCosts: capabilities.bloodProductCosts || "",
                acceptsInsurance: capabilities.bloodBankAcceptsInsurance === "Yes",
                
                // Donor Recruitment & Retention
                donorRecruitmentMethods: capabilities.donorRecruitmentMethods || "",
                hasDonorRetentionStrategy: capabilities.hasDonorRetentionStrategy === "Yes",
                donationSystems: capabilities.donationSystems || [],
                
                // Certification
                accreditationsCertifications: capabilities.bloodBankAccreditations || "",
                
                // General fields
                operatingHours: {
                    openingTime: capabilities.openingTime,
                    closingTime: capabilities.closingTime,
                },
                operatingDays: capabilities.operatingDays.filter((day) => day !== "24/7") || [],
                branches: capabilities.hasOtherBranches === "Yes" 
                    ? capabilities.branchAddresses.map((address) => ({ address })) 
                    : [],
                additionalInfo: capabilities.additionalInformation || "",
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
                    externalPatientsAllowed: capabilities.externalPatientsAllowed === "Yes",
                    branches: capabilities.hasOtherBranches === "Yes" ? capabilities.branchAddresses.map((address) => ({ address })) : [],
                    additionalInfo: capabilities.additionalInformation,
                };
            }
            break;
    }

    return serviceData;
};