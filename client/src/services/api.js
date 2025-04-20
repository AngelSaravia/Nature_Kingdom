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

    console.log("Full API response:", response.data);

    // Check for both lowercase and uppercase field name variations
    const employee_id = response.data.employee_id || response.data.Employee_id;
    const manager_id = response.data.manager_id || response.data.Manager_id;

    // Extract other fields
    const { token, username, role } = response.data;

    console.log("Extracted user data:", {
      username,
      role,
      email,
      employee_id,
      manager_id,
    });

    return {
      success: true,
      userData: {
        username,
        email,
        role,
        employee_id,
        manager_id,
      },
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

    const giftShopPurchasesResponse = await apiClient.get(
      `/api/giftshop/purchases?username=${username}`
    );

    return {
      tickets: ticketsResponse.data,
      membership: membershipResponse.data,
      visitor: visitorResponse.data,
      giftShopPurchases: giftShopPurchasesResponse.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const getProducts = async (category = "", name = "") => {
  try {
    console.log("sending axios reques for giftshop");
    const response = await apiClient.get(`/api/giftshop`, {
      params: { category, name },
    });
    // console.log("response ", response.data.products);
    return response.data.products; // Extract the products array
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (productData) => {
  try {
    console.log("Sending POST request to= add product");
    const response = await apiClient.post("/api/giftshop", productData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error adding product:", error);
    return null; // Return null if error
  }
};

// PUT: Update an existing product in the gift shop
export const updateProduct = async (productData) => {
  try {
    console.log("Sending PUT request to update product");
    const response = await apiClient.put("/api/giftshop", productData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating product:", error);
    return null; // Return null if error
  }
};

// DELETE: Remove a product from the gift shop
export const deleteProduct = async (product_id) => {
  try {
    console.log("Sending DELETE request to remove product");
    const response = await apiClient.delete(`/api/giftshop`, {
      params: { product_id },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting product:", error);
    return null; // Return null if error
  }
};

export const createGiftOrder = async (orderData) => {
  try {
    console.log(orderData);
    const response = await apiClient.post("/api/giftshop/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating gift order:", error);
    throw error;
  }
};

export const getProductHistory = async () => {
  try {
    const response = await apiClient.get("/api/giftshop/history");
    return response.data; // Returns an array of rows
  } catch (error) {
    console.error("Error fetching product history:", error);
    throw error;
  }
};

export const restockProduct = async (productData) => {
  try {
    console.log(productData); // optional debug log
    const response = await apiClient.post("/api/restock", productData);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error restocking product:", error);
    throw error;
  }
};

export const getClockIn = async (email) => {
  try {
    // console.log(`Attempting clock in for: ${email}`);
    const response = await apiClient.get(`/api/clock_in?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clock in status:", error);
    throw error;
  }
};
export const getManagerType = async (employeeId) => {
  try {
    const empId = employeeId || localStorage.getItem("employeeId") || "1";
    console.log("employeeId", empId);

    const response = await apiClient.get(
      `/api/getManagerType?employeeId=${empId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Manager Type:", error);

    return { success: false, data: null };
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAnimalHealthStatus = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/animals/health-status`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching animal health status:", error);
    throw error;
  }
};

export const getCriticalAnimals = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/animals/critical-stats`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching critical animals:", error);
    throw error;
  }
};

export const updateAnimalHealthStatus = async (animalId, newStatus) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/animals/${animalId}/health`,
      { healthStatus: newStatus },
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    console.error("Error updating animal health status:", error);
    throw error;
  }
};

export const getAnimalMedicalRecords = async (animalId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/medical-records/animal/${animalId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching animal medical records:", error);
    throw error;
  }
};

export const getTodaysMedicalProcedures = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/medical-procedures/today`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching today's medical procedures:", error);
    throw error;
  }
};

export const getRecentMedicalAlerts = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/medical-alerts/recent`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching recent medical alerts:", error);
    throw error;
  }
};

export const createMedicalRecord = async (recordData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/medical-records`,
      recordData,
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
};

export const updateMedicalRecord = async (recordId, recordData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/medical-records/${recordId}`,
      recordData,
      { headers: getAuthHeaders() }
    );
    return response;
  } catch (error) {
    console.error("Error updating medical record:", error);
    throw error;
  }
};

export const deleteMedicalRecord = async (recordId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/medical-records/${recordId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting medical record:", error);
    throw error;
  }
};

export const clockIn = async (email) => {
  try {
    console.log(`Attempting to clock in for: ${email}`);
    const response = await apiClient.get(`/api/set_clock_in?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error clocking in:", error);
    throw error;
  }
};

export const clockOut = async (email) => {
  try {
    console.log(`Attempting to clock out for: ${email}`);
    const response = await apiClient.get(`/api/set_clock_out?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error clocking out:", error);
    throw error;
  }
};

export const getMedicalRecordsSummary = async (filters) => {
  try {
    // Build query string with filters
    const params = new URLSearchParams();

    // Add filters to the query string
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.employees.length > 0)
      params.append(
        "employees",
        JSON.stringify(filters.employees.map((emp) => emp.value))
      );
    if (filters.recordTypes.length > 0)
      params.append(
        "recordTypes",
        JSON.stringify(filters.recordTypes.map((type) => type.label))
      );
    if (filters.enclosures.length > 0)
      params.append(
        "enclosures",
        JSON.stringify(filters.enclosures.map((enclosure) => enclosure.value))
      );
    if (filters.animalSpecies.length > 0)
      params.append(
        "animalSpecies",
        JSON.stringify(filters.animalSpecies.map((species) => species.value))
      );

    // Make the GET request with query parameters
    const response = await apiClient.get(
      `/api/medical-records/summary?${params.toString()}`
    );
    return response.data; // Return response data directly
  } catch (error) {
    console.error("Error fetching medical records summary:", error);
    throw error;
  }
};

export const uploadProductImage = async (imageFile) => {
  try {
    console.log("Starting image upload for:", imageFile.name);

    const formData = new FormData();
    formData.append("file", imageFile);

    // Make sure this endpoint matches exactly what your server is expecting
    // If your server uses /api prefix, include it here
    const uploadUrl = `${API_BASE_URL}/api/products/upload-image`;
    console.log("Uploading to:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload response data:", data);

    // Make sure the URL is properly formatted with your API_BASE_URL if needed
    if (data.success && data.imageUrl) {
      const imageUrl = data.imageUrl.startsWith("http")
        ? data.imageUrl
        : `${API_BASE_URL}${data.imageUrl}`;

      console.log("Final image URL:", imageUrl);
      return imageUrl;
    } else {
      throw new Error(data.message || "Failed to get upload URL");
    }
  } catch (error) {
    console.error("Error in uploadProductImage:", error);
    throw error;
  }
};

export const getEmployeeTimesheets = async (email) => {
  try {
    console.log(`Attempting to get timesheets regarding: ${email}`);
    const response = await apiClient.get(
      `/api/employee_timesheets?email=${email}`
    );
    // console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee timesheets:", error);
    throw error;
  }
};

export default apiClient;
