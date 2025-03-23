import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import AuthHeader from "./authHeader";

function HeaderManager() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const authPaths = [
    "/dashboard", 
    "/profile", 
    "/tickets",
    "/membership",
    "/checkout",
    "/my-tickets"
  ];

  const UseAuthHeader =
    isLoggedIn &&
    (authPaths.includes(location.pathname) ||
      authPaths.some((path) => location.pathname.startsWith(path)));

  return UseAuthHeader ? <AuthHeader /> : <Header />;
}

export default HeaderManager;
