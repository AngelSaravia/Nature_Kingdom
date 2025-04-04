import axios from "axios";

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API_BASE_URL:", import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");

  delete apiClient.defaults.headers.common["Authorization"];

  console.log("Logout successful");

  return { success: true };
};

export const login = async (username, password, email) => {
  try {
    console.log(`Attempting employee login for: ${email}`);

    const response = await apiClient.post("/login", {
      username,
      password,
    });

    const { token, username: responseUsername, role } = response.data;

    // Store all relevant user data
    localStorage.setItem("username", responseUsername);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Set axios default header
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    console.log("Login successful:", { username, role });

    return {
      success: true,
      userData: { username: responseUsername, role, email },
      token,
      role,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.response?.data?.e ||
        "Login failed",
    };
  }
};

export const employeeLogin = async (email, password) => {
  try {
    console.log(`Attempting employee login for: ${email}`);

    const response = await apiClient.post("/employee_login", {
      email,
      password,
    });

    const { token, username, role } = response.data;

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    console.log("Employee login successful:", { username, role });

    return {
      success: true,
      userData: { username, email, role },
      token,
      role,
    };
  } catch (error) {
    console.error("Employee login error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    return {
      success: false,
      message: error.response?.data?.error || "Login failed",
    };
  }
};

export const purchaseTickets = async (ticketData) => {
  try {
    const response = await apiClient.post("/api/tickets/purchase", ticketData);
    return response.data;
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    throw error;
  }
};

export const purchaseMembership = async (membershipData) => {
  try {
    const response = await apiClient.post(
      "/api/membership/purchase",
      membershipData
    );
    return response.data;
  } catch (error) {
    console.error("Error purchasing membership:", error);
    throw error;
  }
};

export const checkMembershipStatus = async () => {
  try {
    const username = localStorage.getItem("username");
    const response = await apiClient.get(
      `/api/membership/check?username=${username}`
    );
    return response.data.hasMembership;
  } catch (error) {
    console.error("Error checking membership status:", error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const username = localStorage.getItem("username");
    const ticketsResponse = await apiClient.get(
      `/api/tickets/user/${username}`
    );
    const membershipResponse = await apiClient.get(
      `/api/membership/check?username=${username}`
    );
    const visitorResponse = await apiClient.get(
      `/api/checkvisitor?username=${username}`
    );

    return {
      tickets: ticketsResponse.data,
      membership: membershipResponse.data,
      visitor: visitorResponse.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export default apiClient;
