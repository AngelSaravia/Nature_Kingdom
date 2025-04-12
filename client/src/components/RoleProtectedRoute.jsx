import { Navigate, useLocation } from "react-router-dom";
import React from "react"; // Highlighted: Import React
import { useAuth } from "../context/Authcontext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, role, loading } = useAuth();
  const location = useLocation(); // Get the current location for edit tuple buttons

  console.log("Protected Route Status:", {
    isAuthenticated,
    userDetails: user,
    allowedRoles: role,
    loading,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/employee_login" replace state={{ from: location.pathname, state: location.state }}/>; // passing state={{ from: location }} for redirection
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(
      "Access denied - User role:",
      user.role,
      "Allowed roles:",
      allowedRoles
    );

    return <Navigate to="/" replace />;
  }

  console.log("Access granted to:", user.role);
  return children;
};

export default RoleProtectedRoute;
