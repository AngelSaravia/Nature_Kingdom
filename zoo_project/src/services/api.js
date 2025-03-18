import axios from "axios";

// Define API_BASE_URL at the top of your file
const API_BASE_URL = "http://localhost:5001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Registration service
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default apiClient;
