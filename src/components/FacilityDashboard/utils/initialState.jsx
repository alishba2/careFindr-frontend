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
    acceptsInsurance: "",

    // 🩸 NEW: Blood Bank Fields
    // Blood Products and Types
    bloodProductsProvided: [],
    
    // Screening and Safety
    infectionsTestedFor: "",
    
    // Inventory and Capacity
    currentBloodInventoryCapacity: "",
    maxStorageCapacityPerComponent: "",
    shortageManagement: "",
    expiryDateTracking: "",
    hasMobileDonationUnits: "",
    averageBloodCollectionTime: "",
    
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