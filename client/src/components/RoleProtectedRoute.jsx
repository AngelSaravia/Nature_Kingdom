import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, role, loading } = useAuth();

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
    return <Navigate to="/employee_login" replace />;
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
