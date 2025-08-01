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
    registrationFee:"",
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

    // Updated Insurance-specific fields to match backend schema
    coveredServices: "",
    exclusions: "",
    preExistingConditions: "No",
    emergencyCoverage: "",
    
    // NEW: Fields from backend schema that were missing
    limitationForCareCoverage: "",
    claimProcessSteps: "",
    daysToSettleClaims: "",
    conPayments: "", // Note: Boolean type in backend
    handleRejectedClaims: "",
    paymentSystem: "",
    canVerifyCoverage: "",
    supportTechIntegration: "",
    handleDisputesOrComplaints: "",
    complyWithNigerianHealthCare: "",
    registeredWithNHIA: "",
    
    accreditedHospitals: [{ address: "" }], // Updated to match backend structure
    outOfNetworkReimbursement: "No",
    preAuthorization: "",
    waitingPeriods: [],
    premiumsCopayments: "",
    
    // operatingHours and branches are handled by separate components
    // additionalInfo is handled by separate component

    // REMOVED: These fields don't exist in backend schema
    // claimsProcessingProcedure: "", // Maps to claimProcessSteps
    // claimsSettlementTime: "", // Maps to daysToSettleClaims  
    // hasCopaymentsDeductibles: "", // Maps to conPayments (Boolean)
    // rejectedClaimsProcess: "", // Maps to handleRejectedClaims
    // paymentSystemType: "", // Maps to paymentSystem
    // offersReimbursementPlans: "",
    // supportsApiIntegration: "", // Maps to supportTechIntegration
    // realTimeCoverageVerification: "", // Maps to canVerifyCoverage
    // offersFamilyCoverage: "",
    // costPerDependent: "",
    // dependentsFullBenefits: "",
    // compliesWithRegulations: "", // Maps to complyWithNigerianHealthCare
    // complaintsHandlingProcess: "", // Maps to handleDisputesOrComplaints

    // NEW: Frontend fields that need to be mapped to backend equivalents
    // These should be updated in your form to use the correct backend field names:
    ambulanceEmergencyIncluded: "", // Should map to emergencyCoverage
    partialEmergencyCoverage: "", // Should be part of emergencyCoverage or limitationForCareCoverage
    emergencyCoverageLimitations: "", // Should map to limitationForCareCoverage
    preAuthRequired: "",

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
    acceptsInsurance: "",

    // 🩸 NEW: Blood Bank Fields
    // Blood Products and Types
    
    bloodProductsProvided: [],
    
    // Screening and Safety
    infectionsTestedFor: "",
    
    // Inventory and Capacity
    currentBloodInventoryCapacity: "",
    providesPriorityDispatch:"",
    typicalRequestVolume:" ",
    maxStorageCapacityPerComponent: "",
    shortageManagement: "",
    expiryDateTracking: "",
    hasMobileDonationUnits: "",
    averageBloodCollectionTime: "",
    averageTurnaroundTimes:" ",
    
    // Operational Standards
    acceptsReturnedBlood: "",
    returnTimeFrame: "",
    allPhlebotomistsCertified: "",
    auditFrequency: "",
    dailyWeeklyRequestVolume: "",
    bloodExpiryManagement: "",
    allowsDirectPatientRequests: "",
    
    // Logistics & Delivery
    providesEmergencyDelivery: "",
    emergencyResponseTime: "",
    logisticsType: "",
    coldChainProcedures: "",
    chargesForDelivery: "",
    deliveryCost: "",
    priorityDispatchAvailable: "",
    turnaroundTimeEmergency: "",
    turnaroundTimeNonEmergency: "",
    
    // Pricing & Payment
    bloodProductCosts: "",
    bloodBankAcceptsInsurance: "",
    
    // Donor Recruitment & Retention
    donorRecruitmentMethods: "",
    hasDonorRetentionStrategy: "",
    donationSystems: [],
    
    // Certification
    bloodBankAccreditations: "",
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

// 🩸 NEW: Blood Bank specific constants
export const bloodProductTypes = [
    { id: "all", label: "All" },
    { id: "wholeBlood", label: "Whole blood" },
    { id: "rbcs", label: "RBCs" },
    { id: "platelets", label: "Platelets" },
    { id: "plasma", label: "Plasma" },
    { id: "cryoprecipitate", label: "Cryoprecipitate" },
];

export const donationSystemTypes = [
    { id: "voluntary", label: "Voluntary" },
    { id: "replacement", label: "Replacement" },
    { id: "paid", label: "Paid" },
];

export const logisticsOptions = [
    { id: "ownLogistics", label: "Own logistics" },
    { id: "thirdParty", label: "Third-party delivery" },
];

export const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
];

// Common infections tested for (for autocomplete or suggestions)
export const commonInfectionTests = [
    "HIV",
    "Hepatitis B",
    "Hepatitis C", 
    "Syphilis",
    "Malaria",
    "CMV (Cytomegalovirus)",
    "HTLV (Human T-lymphotropic virus)",
    "West Nile Virus",
    "Chagas Disease",
    "Zika Virus"
];

// Common accreditations for blood banks
export const bloodBankAccreditations = [
    "NAFDAC (National Agency for Food and Drug Administration and Control)",
    "MLSCN (Medical Laboratory Science Council of Nigeria)",
    "WHO Standards",
    "AABB (American Association of Blood Banks)",
    "CAP (College of American Pathologists)",
    "ISO 15189",
    "FMOH (Federal Ministry of Health)"
];
