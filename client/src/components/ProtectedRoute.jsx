import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const ProtectedRoutes = ({ allowedRoles = ["customer"] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log("ProtectedRoutes initial check:", {
    pathname: window.location.pathname,
    isAuthenticated,
    loading,
    userExists: !!user,
    userRole: user?.role,
    allowedRoles,
    localStorage: {
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token") ? "exists" : "missing",
    },
  });

  if (loading) {
    return <div>Loading authentication data...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (!user) {
    console.log("User object missing despite being authenticated");
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  const userRole = user.role || "customer";

  console.log("Checking role authorization:", {
    userRole,
    allowedRoles,
    username: user.username,
  });

  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    console.log("Unauthorized role, redirecting to unauthorized page:", {
      userRole,
      allowedRoles,
      username: user.username,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  console.log("Access granted:", {
    username: user.username,
    role: user.role,
    path: window.location.pathname,
  });

  return <Outlet />;
};

export default ProtectedRoutes;
