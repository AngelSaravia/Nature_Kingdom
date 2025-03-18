// Define API base URL
const API_BASE_URL = "http://localhost:5004";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
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

// You can add more API services here as needed

export default apiClient;