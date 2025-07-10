export const initialCapabilitiesState = {
    // Existing fields
    operatingDays: [],
    openingTime: "",
    closingTime: "",
    coreClinicalSpecialities: [],
    facilityFeatures: [],
    agreedToTerms: false,
    admissionFee: "",
    consultationFee: "",
    totalBedSpace: "",
    hasPharmacy: null,
    hasLaboratory: null,
    externalPatientsAllowed: '',
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

    // Insurance-specific existing fields
    coveredServices: "",
    exclusions: "",
    preExistingConditions: "No",
    emergencyCoverage: "",
    accreditedHospitals: [""],
    outOfNetworkReimbursement: "No",
    preAuthorization: "",
    waitingPeriods: [],
    premiumsCopayments: "",
    preAuthRequired: "",

    // New Insurance fields - Claim Process
    claimsProcessingProcedure: "",
    claimsSettlementTime: "",
    hasCopaymentsDeductibles: "",
    rejectedClaimsProcess: "",
    paymentSystemType: "",
    offersReimbursementPlans: "",

    // Integration & Technology
    supportsApiIntegration: "",
    realTimeCoverageVerification: "",

    // Family/Dependent Coverage
    offersFamilyCoverage: "",
    costPerDependent: "",
    dependentsFullBenefits: "",

    // Regulatory Compliance
    registeredWithNHIA: "",
    compliesWithRegulations: "",
    complaintsHandlingProcess: "",

    // Other existing fields
    coreServices: "",
    careType: "",
    onSiteDoctor: "",
    emergencyResponsePlan: "",
    criticalCare: "",
    multidisciplinaryCare: "",
    bedCapacity: "",
    homeServices: "",
    onlineBooking: "",
    is24Hour: "",
    patientLimit: "",
    publicHolidayWork: "",
    collaboratesWithOthers: "",
    worksWithHMOs: "",
    acceptsInsurance: ""
};
export const weekDays = [
    "24/7",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const facilityFeatures = [
    { id: "emergency", label: "Emergency Services" },
    { id: "ambulance", label: "Ambulance Services" },
    { id: "icu-availability", label: "ICU Availability" },
    { id: "theatre", label: "Operating Theatre" },
    { id: "dialysisUnit", label: "Dialysis Unit" },
    { id: "maternityServices", label: "Maternity Services (Obs & Gyn)" },
    { id: "bloodbank", label: "Blood Bank" },
    { id: "isolation", label: "Isolation Centre" },
];
