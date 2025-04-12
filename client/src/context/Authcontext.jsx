import { createContext, useEffect, useState, useContext } from "react";
import { employeeLogin as employeeLoginService } from "../services/api";
import { login as visitorLoginService } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshAuthState = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    let role = localStorage.getItem("role");

    // Add default role handling in the refresh function as well
    if (!role && token && username) {
      role = "customer";
      localStorage.setItem("role", role);
    }

    if (token && username) {
      setUser({ username, email, role });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  // Use the refreshAuthState on component mount
  useEffect(() => {
    refreshAuthState();
  }, []);

  // Check auth status only on mount, not on every location change
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role") || "regular";

        // Debug log - Check what's in localStorage
        console.log("Auth localStorage check:", {
          token: !!token,
          username,
          email,
          role,
          path: location.pathname,
        });

        if (!token || !username) {
          // Invalid auth data, ensure we're logged out
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Create user object with available data
        const userData = { username, email, role };

        setUser(userData);
        setIsAuthenticated(true);

        // Debug log
        console.log("Auth check completed:", {
          userData,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Auth check error:", error);
        // On error, clear auth state
        forceLogout(false); // Don't navigate on initial check
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Only run on mount, not on location change

  // Add a validation check to detect invalid auth state
  useEffect(() => {
    // If authenticated but missing critical data, force logout
    if (isAuthenticated && (!user || !user.role)) {
      console.warn(
        "Invalid auth state detected: authenticated but missing role or user data"
      );
      forceLogout(true);
    }
  }, [isAuthenticated, user]);

  // Enhanced force logout function
  const forceLogout = (shouldNavigate = true) => {
    console.log("Forcing logout, clearing auth state", { shouldNavigate });

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    // Clear axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Update state
    setUser(null);
    setIsAuthenticated(false);

    // Navigate only if requested
    if (shouldNavigate) {
      navigate("/login");
    }
  };

  const login = async (username, password) => {
    try {
      console.log(`Sending employee login request with email: ${username}`);
      const result = await visitorLoginService(username, password);
      console.log("Employee login response:", result);

      if (result.success === false) {
        return result;
      }

      const { userData, token } = result;

      const extractedUsername = userData?.username || result.username;
      const userRole = userData?.role || result.role;

      if (!token && !result.token) {
        console.error("Employee login missing token:", result);
        return {
          success: false,
          message: "Invalid login response - missing token",
        };
      }

      const authToken = token || result.token;

      // Store all relevant user data
      localStorage.setItem("username", extractedUsername);
      localStorage.setItem("token", authToken);
      localStorage.setItem("role", userRole);

      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      // Update auth state
      setUser({ extractedUsername, role: userRole });
      setIsAuthenticated(true);

      // Debug log
      console.log("Employee login successful:", {
        extractedUsername,
        role: userRole,
      });

      // Redirect to dashboard after successful login
      navigate("/dashboard");

      return { success: true };
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

  const employeeLogin = async (email, password) => {
    try {
      console.log(`Sending employee login request with email: ${email}`);

      const result = await employeeLoginService(email, password);
      console.log("Employee login response:", result);

      // Check if the service returned an error
      if (result.success === false) {
        return result; // Return error from service
      }

      // Extract userData from the response
      const { userData, token } = result;

      // If userData is present, use it, otherwise use top-level data
      const username = userData?.username || result.username;
      const userRole = userData?.role || result.role;
      const userEmail = userData?.email || email;

      // Check if we have the necessary data
      if (!token && !result.token) {
        console.error("Employee login missing token:", result);
        return {
          success: false,
          message: "Invalid login response - missing token",
        };
      }

      // Use token from the appropriate location
      const authToken = token || result.token;

      // Store all relevant user data
      localStorage.setItem("username", username);
      localStorage.setItem("token", authToken);
      localStorage.setItem("role", userRole);
      localStorage.setItem("email", userEmail);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      // Update auth state
      setUser({ username, role: userRole, email: userEmail });
      setIsAuthenticated(true);

      // Debug log
      console.log("Employee login successful:", { username, role: userRole });

      // Redirect to dashboard after successful login
      navigate("/dashboard");

      return { success: true, role: userRole };
    } catch (error) {
      console.error("Employee login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.error || error.message || "An error occurred",
      };
    }
  };

  const logout = () => {
    console.log("Logout initiated");

    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    // Clear axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Update state BEFORE navigation
    setUser(null);
    setIsAuthenticated(false);

    // Force immediate state update to ensure logout is complete
    setTimeout(() => {
      // Navigate to login
      navigate("/login");
      console.log("Logout completed, state cleared");
    }, 0);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        employeeLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
