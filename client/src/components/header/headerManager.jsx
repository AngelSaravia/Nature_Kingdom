import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import AuthHeader from "./auth/authHeader";
import AdminHeader from "./admin/adminHeader";
import ManagerHeader from "./manager/managerHeader";
import StaffHeader from "./staff/staffheader";
import VeterinarianHeader from "./veterinarian/veterinarian";
import ZookeeperHeader from "./zookeeper/zookeeper";
import { useAuth } from "../../context/Authcontext"; // <-- Import the same hook
import OperatorHeader from "./operator/operator";
import GiftShopHeader from "./giftshop/giftshop";

function HeaderManager() {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth(); // <-- Use the same auth context

  console.log("HeaderManager Auth State:", {
    isAuthenticated,
    user,
    loading,
    path: location.pathname,
  });

  // Show default header while loading
  if (loading) {
    return <Header />;
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Header />;
  }

  // Determine which header to show based on user.role
  switch (user.role) {
    case "admin":
      console.log("Showing AdminHeader");
      return <AdminHeader />;
    case "manager":
      console.log("Showing ManagerHeader");
      return <ManagerHeader />;
    case "staff":
      console.log("Showing StaffHeader");
      return <StaffHeader />;
    case "veterinarian":
      console.log("Showing VeterinarianHeader");
      return <VeterinarianHeader />;
    case "zookeeper":
      console.log("Showing ZookeeperHeader");
      return <ZookeeperHeader />;
    case "operator":
      console.log("Showing Operator Header");
      return <OperatorHeader />;
    case "giftshop":
      console.log("Showing Giftshop Header");
      return <GiftShopHeader />;

    default:
      console.log("Showing regular Auth Header");
      return <AuthHeader />;
  }
}

export default HeaderManager;
