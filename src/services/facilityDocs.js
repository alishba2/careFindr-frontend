import axios from './axiosConfig';

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

export const FacilityDocs = async (formData, isUpdate = false) => {
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