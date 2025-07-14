import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

export const FacilityDocs = async (formData, isUpdate = false) => {
  console.log(isUpdate, "is updae here");
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

export const GetFacilityDocs = async (facilityId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error;
  }
};

export const GetFacilityDocsAdmin = async (facilityId) => {
  console.log(facilityId, "facility is is her");
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error;
  }
};

// ===== NEW VERIFICATION APIS =====

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

// Get facility documents by facility ID (for verification details)
export const getFacilityDocsByFacilityId = async (facilityId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/facility-docs/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching facility documents:", error);
    throw error.response?.data || error;
  }
};