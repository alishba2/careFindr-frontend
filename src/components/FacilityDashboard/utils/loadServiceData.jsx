export const loadServiceData = (serviceData, capabilities) => {
    let newCapabilities = { ...capabilities };
    let subSpecialities = [];

    console.log(serviceData, "facility type is here");

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
                hasPharmacy: serviceData.hospitalDetails.hasPharmacy,
                hasLaboratory: serviceData.hospitalDetails.hasLaboratory,
                externalPatientsAllowed: serviceData.hospitalDetails.externalPatientsAllowed?.lab ? "Yes" : "No",
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
            subSpecialities = serviceData.hospitalDetails.subSpecialities || [];
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
                // Coverage Details
                coveredServices: serviceData.insuranceDetails.coveredServices || "",
                exclusions: serviceData.insuranceDetails.exclusions || "",
                preExistingConditions: serviceData.insuranceDetails.preExistingConditions ? "Yes" : "No",
                emergencyCoverage: serviceData.insuranceDetails.emergencyCoverage || "",
                limitationForCareCoverage: serviceData.insuranceDetails.limitationForCareCoverage || "",
                
                // Claim Process - UPDATED FIELD NAMES
                claimProcessSteps: serviceData.insuranceDetails.claimProcessSteps || "",
                daysToSettleClaims: serviceData.insuranceDetails.daysToSettleClaims || "",
                conPayments: serviceData.insuranceDetails.conPayments || false,
                handleRejectedClaims: serviceData.insuranceDetails.handleRejectedClaims || "",
                paymentSystem: serviceData.insuranceDetails.paymentSystem || "",
                
                // Integration & Technology - UPDATED FIELD NAMES
                canVerifyCoverage: serviceData.insuranceDetails.canVerifyCoverage || "",
                supportTechIntegration: serviceData.insuranceDetails.supportTechIntegration || "",
                
                // Regulatory Compliance - UPDATED FIELD NAMES
                registeredWithNHIA: serviceData.insuranceDetails.registeredWithNHIA || "",
                complyWithNigerianHealthCare: serviceData.insuranceDetails.complyWithNigerianHealthCare || "",
                handleDisputesOrComplaints: serviceData.insuranceDetails.handleDisputesOrComplaints || "",
                
                // Hospital Network - UPDATED STRUCTURE
                accreditedHospitals: serviceData.insuranceDetails.accreditedHospitals || [{ address: "" }],
                outOfNetworkReimbursement: serviceData.insuranceDetails.outOfNetworkReimbursement ? "Yes" : "No",
                
                // Pre-authorization
                preAuthorization: serviceData.insuranceDetails.preAuthorization || "",
                preAuthRequired: serviceData.insuranceDetails.preAuthRequired || "",
                waitingPeriods: serviceData.insuranceDetails.waitingPeriods || [],
                
                // Premiums & Payments
                premiumsCopayments: serviceData.insuranceDetails.premiumsCopayments || "",
                
                // Operating Details
                operatingDays: serviceData.insuranceDetails.operatingDays || [],
                openingTime: serviceData.insuranceDetails.operatingHours?.openingTime || "",
                closingTime: serviceData.insuranceDetails.operatingHours?.closingTime || "",
                hasOtherBranches: serviceData.insuranceDetails.branches?.length > 0 ? "Yes" : "No",
                branchAddresses: serviceData.insuranceDetails.branches?.map((b) => b.address) || [""],
                additionalInformation: serviceData.insuranceDetails.additionalInfo || "",
            };

            console.log(newCapabilities, "new capabilities here");
            break;

        case "SpecialistClinic":
            newCapabilities = {
                ...newCapabilities,
                coreServices: serviceData.specialistClinicDetails.coreServices || "",
                careType: serviceData.specialistClinicDetails.careType || "",
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

        // 🩸 NEW: Blood Bank Case
        case "Blood Bank":
            newCapabilities = {
                ...newCapabilities,
                // Blood Products and Types
                bloodProductsProvided: serviceData.bloodBankDetails.bloodProductsProvided || [],
                
                // Screening and Safety
                infectionsTestedFor: serviceData.bloodBankDetails.infectionsTestedFor || "",
                
                // Inventory and Capacity
                currentBloodInventoryCapacity: serviceData.bloodBankDetails.currentBloodInventoryCapacity || "",
                maxStorageCapacityPerComponent: serviceData.bloodBankDetails.maxStorageCapacityPerComponent || "",
                shortageManagement: serviceData.bloodBankDetails.shortageManagement || "",
                expiryDateTracking: serviceData.bloodBankDetails.expiryDateTracking || "",
                hasMobileDonationUnits: serviceData.bloodBankDetails.hasMobileDonationUnits ? "Yes" : "No",
                averageBloodCollectionTime: serviceData.bloodBankDetails.averageBloodCollectionTime || "",
                
                // Operational Standards
                acceptsReturnedBlood: serviceData.bloodBankDetails.acceptsReturnedBlood ? "Yes" : "No",
                returnTimeFrame: serviceData.bloodBankDetails.returnTimeFrame || "",
                allPhlebotomistsCertified: serviceData.bloodBankDetails.allPhlebotomistsCertified ? "Yes" : "No",
                auditFrequency: serviceData.bloodBankDetails.auditFrequency || "",
                dailyWeeklyRequestVolume: serviceData.bloodBankDetails.dailyWeeklyRequestVolume || "",
                bloodExpiryManagement: serviceData.bloodBankDetails.bloodExpiryManagement || "",
                allowsDirectPatientRequests: serviceData.bloodBankDetails.allowsDirectPatientRequests ? "Yes" : "No",
                
                // Logistics & Delivery
                providesEmergencyDelivery: serviceData.bloodBankDetails.providesEmergencyDelivery ? "Yes" : "No",
                emergencyResponseTime: serviceData.bloodBankDetails.emergencyResponseTime || "",
                logisticsType: serviceData.bloodBankDetails.logisticsType || "",
                coldChainProcedures: serviceData.bloodBankDetails.coldChainProcedures || "",
                chargesForDelivery: serviceData.bloodBankDetails.chargesForDelivery ? "Yes" : "No",
                deliveryCost: serviceData.bloodBankDetails.deliveryCost?.toString() || "",
                priorityDispatchAvailable: serviceData.bloodBankDetails.priorityDispatchAvailable ? "Yes" : "No",
                turnaroundTimeEmergency: serviceData.bloodBankDetails.turnaroundTimeEmergency || "",
                turnaroundTimeNonEmergency: serviceData.bloodBankDetails.turnaroundTimeNonEmergency || "",
                
                // Pricing & Payment
                bloodProductCosts: serviceData.bloodBankDetails.bloodProductCosts || "",
                bloodBankAcceptsInsurance: serviceData.bloodBankDetails.acceptsInsurance ? "Yes" : "No",
                
                // Donor Recruitment & Retention
                donorRecruitmentMethods: serviceData.bloodBankDetails.donorRecruitmentMethods || "",
                hasDonorRetentionStrategy: serviceData.bloodBankDetails.hasDonorRetentionStrategy ? "Yes" : "No",
                donationSystems: serviceData.bloodBankDetails.donationSystems || [],
                
                // Certification
                bloodBankAccreditations: serviceData.bloodBankDetails.accreditationsCertifications || "",
                
                // General fields
                openingTime: serviceData.bloodBankDetails.operatingHours?.openingTime || "",
                closingTime: serviceData.bloodBankDetails.operatingHours?.closingTime || "",
                operatingDays: serviceData.bloodBankDetails.operatingDays || [],
                hasOtherBranches: serviceData.bloodBankDetails.branches?.length > 0 ? "Yes" : "No",
                branchAddresses: serviceData.bloodBankDetails.branches?.map((b) => b.address) || [""],
                additionalInformation: serviceData.bloodBankDetails.additionalInfo || "",
            };
            break;
    }

    console.log(newCapabilities, "new capability is here");
    return { newCapabilities, subSpecialities };
};
