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
                claimsProcessingProcedure: capabilities.claimsProcessingProcedure,
                claimsSettlementTime: capabilities.claimsSettlementTime,
                hasCopaymentsDeductibles: capabilities.hasCopaymentsDeductibles,
                rejectedClaimsProcess: capabilities.rejectedClaimsProcess,
                paymentSystemType: capabilities.paymentSystemType,
                offersReimbursementPlans: capabilities.offersReimbursementPlans,

                // Integration & Technology
                supportsApiIntegration: capabilities.supportsApiIntegration,
                realTimeCoverageVerification: capabilities.realTimeCoverageVerification,

                // Family/Dependent Coverage
                offersFamilyCoverage: capabilities.offersFamilyCoverage,
                costPerDependent: capabilities.costPerDependent,
                dependentsFullBenefits: capabilities.dependentsFullBenefits,

                // Regulatory Compliance
                registeredWithNHIA: capabilities.registeredWithNHIA,
                compliesWithRegulations: capabilities.compliesWithRegulations,
                complaintsHandlingProcess: capabilities.complaintsHandlingProcess,
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
    }


    console.log(newCapabilities, "new capability is here");
    return { newCapabilities, subSpecialities };
};