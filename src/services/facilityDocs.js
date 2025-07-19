import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// ===== DOCUMENT UPLOAD/UPDATE APIs =====

export const FacilityDocs = async (formData, isUpdate = false) => {
  console.log(isUpdate, "is update here");
  try {
    const url = isUpdate
      ? `${backendUrl}/api/facility-docs/${formData.get('facilityId')}`
      : `${backendUrl}/api/facility-docs`;
    const method = isUpdate ? 'put' : 'post';
    const response = await axios[method](
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading facility documents:", error);
    throw error;
  }
};

// ===== DOCUMENT RETRIEVAL APIs =====

// Get facility docs for authenticated user
export const GetFacilityDocs = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error;
  }
};

// Get facility docs by facility ID (Admin)
export const GetFacilityDocsAdmin = async (facilityId) => {
  console.log(facilityId, "facility id is here");
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error;
  }
};

// Get facility documents by facility ID (general)
export const getFacilityDocsByFacilityId = async (facilityId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error.response?.data || error;
  }
};

// ===== DOCUMENT VERIFICATION APIs =====

// Verify a single document
export const verifyDocument = async (facilityId, documentType, notes = '') => {
  try {
    const response = await axios.post(`${backendUrl}/api/facility-docs/${facilityId}/verify-document`, {
      documentType,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying document:", error);
    throw error.response?.data || error;
  }
};

// Reject a single document
export const rejectDocument = async (facilityId, documentType, notes) => {
  try {
    const response = await axios.post(`${backendUrl}/api/facility-docs/${facilityId}/reject-document`, {
      documentType,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting document:", error);
    throw error.response?.data || error;
  }
};

// Verify all documents at once
export const verifyAllDocuments = async (facilityId, notes = '') => {
  try {
    const response = await axios.post(`${backendUrl}/api/facility-docs/${facilityId}/verify-all`, {
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying all documents:", error);
    throw error.response?.data || error;
  }
};

// Get verification summary
export const getVerificationSummary = async (facilityId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}/verification-summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching verification summary:", error);
    throw error.response?.data || error;
  }
};

// Update overall verification status
export const updateOverallVerification = async (facilityId, status, notes = '') => {
  try {
    const response = await axios.put(`${backendUrl}/api/facility-docs/${facilityId}/overall-verification`, {
      status,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error updating overall verification:", error);
    throw error.response?.data || error;
  }
};

// ===== DOCUMENT EXTRACTION APIs =====

// Get extraction status for a specific document type
export const getExtractionStatus = async (facilityId, documentType) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}/extraction-status/${documentType}`);
    return response.data;
  } catch (error) {
    console.error("Error getting extraction status:", error);
    throw error.response?.data || error;
  }
};

// Get extraction summary for all document types
export const getExtractionSummary = async (facilityId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}/extraction-summary`);
    return response.data;
  } catch (error) {
    console.error("Error getting extraction summary:", error);
    throw error.response?.data || error;
  }
};

// Trigger data extraction for a specific document type
export const triggerExtraction = async (facilityId, documentType) => {
  try {
    const response = await axios.post(`${backendUrl}/api/facility-docs/${facilityId}/trigger-extraction/${documentType}`);
    return response.data;
  } catch (error) {
    console.error("Error triggering extraction:", error);
    throw error.response?.data || error;
  }
};

// Get all extracted data (Admin endpoint)
export const getAllExtractedData = async (facilityType = null, verificationStatus = null) => {
  try {
    const params = {};
    if (facilityType) params.facilityType = facilityType;
    if (verificationStatus) params.verificationStatus = verificationStatus;
    
    const response = await axios.get(`${backendUrl}/api/facility-docs/extracted-data`, { params });
    return response.data;
  } catch (error) {
    console.error("Error getting all extracted data:", error);
    throw error.response?.data || error;
  }
};

// ===== UTILITY FUNCTIONS =====

// Check if document type supports extraction
export const isExtractableDocument = (documentType) => {
  return ['facilityDetailsDoc', 'priceListFile'].includes(documentType);
};

// Get document display name
export const getDocumentDisplayName = (documentType) => {
  const displayNames = {
    facilityPhotos: 'Facility Photos',
    facilityDetailsDoc: 'Facility Details Document',
    priceListFile: 'Price List',
    licenseRegistrationFile: 'License & Registration',
    specialistScheduleFiles: 'Specialist Schedules'
  };
  return displayNames[documentType] || documentType;
};

// Get extraction status display text
export const getExtractionStatusText = (status) => {
  const statusText = {
    pending: 'Pending',
    processing: 'Processing',
    extracted: 'Extracted',
    failed: 'Failed',
    queued: 'Queued'
  };
  return statusText[status] || status;
};

// Get extraction status color
export const getExtractionStatusColor = (status) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800',
    extracted: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    queued: 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};