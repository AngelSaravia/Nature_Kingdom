import axios from 'axios';

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

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


export const purchaseTickets = async (ticketData) => {
  try {
    const response = await apiClient.post('/api/tickets/purchase', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    throw error;
  }
};

export const purchaseMembership = async (membershipData) => {
  try {
    const response = await apiClient.post('/api/membership/purchase', membershipData);
    return response.data;
  } catch (error) {
    console.error('Error purchasing membership:', error);
    throw error;
  }
};

export const checkMembershipStatus = async () => {
  try {
    const username = localStorage.getItem('username');
    const response = await apiClient.get(`/api/membership/check?username=${username}`);
    return response.data.hasMembership;
  } catch (error) {
    console.error('Error checking membership status:', error);
    throw error;
  }
};

export default apiClient;