import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import AuthHeader from "./auth/authHeader";
import AdminHeader from "./admin/adminHeader";

function HeaderManager() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const email = localStorage.getItem("email");

  // Paths for different sections
  const adminPaths = [
    "/admin",
    "/employee_form",
    "/animal_form",
    "/enclosure_form",
    "/event_form",
  ];

  const authPaths = ["/dashboard", "/profile", "/my-tickets"];

  // Check if current path is in admin or auth sections
  const isAdminPath = adminPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  const isAuthPath = authPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  // Determine if user is staff by email domain
  const isStaff =
    email &&
    (email.endsWith("@admin.naturekingdom.com") ||
      email.endsWith("@manager.naturekingdom.com") ||
      email.endsWith("@staff.naturekingdom.com"));

  // Determine which header to use
  if (isLoggedIn && isStaff && isAdminPath) {
    return <AdminHeader />;
  } else if (isLoggedIn && isAuthPath) {
    return <AuthHeader />;
  } else {
    return <Header />;
  }
}

export default HeaderManager;
