import axios from "axios";
let backendUrl = import.meta.env.VITE_APP_BASE_URL ;

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


export const adminLogin = async (login) => {
    try {
        const response = await axios.post(`${backendUrl}/api/admin/login`,login);
        return response.data;
    } catch (error) {
        console.error("Error logging in admin:", error);
        throw error;
    }
}