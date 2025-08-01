import axios from "axios";
let backendUrl = import.meta.env.VITE_APP_BASE_URL;

// register a new facility
export const registerFacility = async (facilityData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/register`, facilityData);
    return response.data;
  } catch (error) {
    console.error("Error registering facility:", error);
    throw error;
  }
};

// verify OTP for a facility
export const verifyOtp = async (otpData) => {
  try {
    console.log(otpData,"orp data is here");
    const response = await axios.post(`${backendUrl}/api/auth/otp/verify`, otpData);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

// send otp
export const sendOtp = async (contactData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/otp/send`, contactData);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

// send otp with more flexible options (supports phone, email, identifier)
export const sendOtpFlexible = async (otpData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/send-otp`, otpData);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

// verify OTP with more flexible options (supports phone, email, identifier)
export const verifyOtpFlexible = async (otpData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, otpData);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

// forgot password - send OTP for password reset
export const forgotPassword = async (identifier) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/forgot-password`, {
      identifier
    });
    return response.data;
  } catch (error) {
    console.error("Error in forgot password:", error);
    throw error;
  }
};

// reset password using OTP
export const resetPassword = async (identifier, otp, newPassword) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/reset-password`, {
      identifier,
      otp,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// login a facility
export const loginFacility = async (loginData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const updateFacility = async (data) => {
  try {
    const response = await axios.put(`${backendUrl}/api/auth/update`, data);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const adminLogin = async (login) => {
  try {
    console.log(login, "login here");
    const response = await axios.post(`${backendUrl}/api/admin/login`, login);
    console.log(response.data, "response here");
    return response.data;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
}

export const uploadImage = async (file, facilityId) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("facilityId", facilityId);

    const response = await axios.post(
      `${backendUrl}/api/auth/upload-profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};