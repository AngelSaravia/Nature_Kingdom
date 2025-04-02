import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import AuthHeader from "./auth/authHeader";
import AdminHeader from "./admin/adminHeader";
import ManagerHeader from "./manager/managerHeader";
import StaffHeader from "./staff/staffheader";

function HeaderManager() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username");

  console.log("Current path:", location.pathname);
  console.log("Is logged in:", isLoggedIn);
  console.log("Email:", email);
  console.log("Username:", username);

  const adminPaths = [
    "/admin",
    "/employee_form",
    "/animal_form",
    "/enclosure_form",
    "/event_form",
  ];

  const authPaths = [
    "/dashboard",
    "/profile",
    "/tickets",
    "/membership",
    "/checkout",
    "/my-tickets",
    "/my-membership",
  ];

  const isAdminPath = adminPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  const isAuthPath = authPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  console.log("Is admin path:", isAdminPath);
  console.log("Is auth path:", isAuthPath);

  const isAdmin = email && email.endsWith("@admin.naturekingdom.com");

  const isManager = email && email.endsWith("@manager.naturekingdom.com");

  const isStaff = email && email.endsWith("@staff.naturekingdom.com");

  if (isLoggedIn) {
    if (isAdmin) {
      console.log("Showing AdminHeader");
      return <AdminHeader />;
    } else if (isManager) {
      console.log("Showing ManagerHeader");
      return <ManagerHeader />;
    } else if (isStaff) {
      console.log("Showing ManagerHeader");
      return <StaffHeader />;
    }
  } else {
    console.log("Showing regular Header");
    return <Header />;
  }
}

export default HeaderManager;
