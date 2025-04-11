import React, { useEffect, useState, Profiler } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ProtectedRoutes from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Footer from "./components/footer/footer";
import HomePage from "./pages/home/home";
import Membership from "./pages/membership/membership";
import Tickets from "./pages/tickets/tickets";
import Sign_up from "./pages/signup/sign_up";
import Login from "./pages/login/login";
import EmployeeLogin from "./pages/employee/employee_login";
import Dashboard from "./pages/dashboard/dashboard";
import Checkout from "./pages/checkout/checkout";
import MyTickets from "./pages/dashboard/my-tickets/my-tickets";
import MyMembership from "./pages/dashboard/my-membership/my-membership";
import AdminDash from "./pages/employee_dash/admin_dash";
import ManagerDash from "./pages/employee_dash/manager_dash";
import TicketForm from "./pages/dataEntries/ticket_form";
import MembershipForm from "./pages/dataEntries/membership_form";
import VisitorForm from "./pages/dataEntries/visitor_form";
import EmployeeForm from "./pages/dataEntries/employee_form";
import AnimalForm from "./pages/dataEntries/animal_form";
import EnclosureForm from "./pages/dataEntries/enclosure_form";
import EventForm from "./pages/dataEntries/event_form";
import MedicalForm from "./pages/dataEntries/medical_form";
import EventsPage from "./pages/events/EventsPage";
import AnimalQueryReport from "./pages/dataQueryReports/animal_queryReport";
import EventQueryReport from "./pages/dataQueryReports/event_queryReport";
import EnclosureQueryReport from "./pages/dataQueryReports/enclosure_queryReport";
import EmployeeQueryReport from "./pages/dataQueryReports/employee_queryReport";
import TicketQueryReport from "./pages/dataQueryReports/ticket_queryReport";
import VisitorMembershipQueryReport from "./pages/dataQueryReports/visitormembership_queryReport";
import RevenueQueryReport from "./pages/dataQueryReports/revenue_queryReport";
import FeedLogsQueryReport from "./pages/dataQueryReports/feedLogs_queryReport";
import MedicalRecordsQueryReport from "./pages/dataQueryReports/medicalRecords_queryReport";
import "./App.css";
import HeaderManager from "./components/header/headerManager";
import GiftShop from "./pages/giftshop/GiftShop";

// Performance monitoring callback
function onRenderCallback(id, phase, actualDuration) {
  console.log(`[Performance] ${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
}

function BodyClassManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remove all page-specific classes
    document.body.classList.remove("home-page-body", "signup-page-body");

    // Add the appropriate class based on current path
    if (pathname === "/") {
      document.body.classList.add("home-page-body");
    } else if (pathname === "/signup") {
      document.body.classList.add("signup-page-body");
    }
  }, [pathname]);

  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const minLoadTime = 1500; // Minimum loading time in ms

  useEffect(() => {
    // Log navigation timing for debugging
    if (location.pathname === "/") {
      console.time("HomePage Total Load");
    }

    const startTime = Date.now();
    setLoading(true);

    // Function to hide loader when conditions are met
    const hideLoader = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setLoading(false);
        if (location.pathname === "/") {
          console.timeEnd("HomePage Total Load");
        }
      }, remainingTime);
    };

    // Create a promise that resolves when content is loaded
    const contentLoaded = new Promise((resolve) => {
      // Check if already loaded
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });

    // Wait for content to load before hiding loader
    contentLoaded.then(hideLoader);

    // Cleanup
    return () => window.removeEventListener("load", hideLoader);
  }, [location]);

  return (
    <>
      {loading ? (
        <div className="loading_container">
          <DotLottieReact
            src="https://lottie.host/1a5b3967-f343-44ea-8634-352401565a58/7szBMbptde.lottie"
            loop
            autoplay
            style={{ width: "250px", height: "250px" }}
          />
        </div>
      ) : (
        <div className="app">
          <HeaderManager />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Admin routes */}
              <Route
                path="/admin_dash"
                element={
                  <RoleProtectedRoute allowedRoles={["admin"]}>
                    <AdminDash />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/employee_form"
                element={
                  <RoleProtectedRoute allowedRoles={["admin"]}>
                    <EmployeeForm />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/query_report/employees"
                element={
                  <RoleProtectedRoute allowedRoles={["admin"]}>
                    <EmployeeQueryReport />
                  </RoleProtectedRoute>
                }
              />

              {/* Admin and manager routes */}
              <Route
                path="/event_form"
                element={
                  <RoleProtectedRoute
                    allowedRoles={["admin", "manager", "staff"]}
                  >
                    <EventForm />
                  </RoleProtectedRoute>
                }
              />
              {/* Admin routes */}
              <Route
                path="/staff_dash"
                element={
                  <RoleProtectedRoute allowedRoles={["staff"]}>
                    <AdminDash />
                  </RoleProtectedRoute>
                }
              />

              {/* Manager routes */}
              <Route
                path="/manager_dash"
                element={
                  <RoleProtectedRoute allowedRoles={["manager"]}>
                    <ManagerDash />
                  </RoleProtectedRoute>
                }
              />

              {/* Admin and manager routes */}
              <Route
                path="/event_form"
                element={
                  <RoleProtectedRoute
                    allowedRoles={["admin", "manager", "staff"]}
                  >
                    <EventForm />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/enclosure_form"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                    <EnclosureForm />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/query_report/enclosures"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                    <EnclosureQueryReport />
                  </RoleProtectedRoute>
                }
              />

              {/* Admin, manager, and employee routes */}
              <Route
                path="/animal_form"
                element={
                  <RoleProtectedRoute
                    allowedRoles={["admin", "manager", "staff"]}
                  >
                    <AnimalForm />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/query_report/animals"
                element={
                  <RoleProtectedRoute
                    allowedRoles={["admin", "manager", "staff"]}
                  >
                    <AnimalQueryReport />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/query_report/events"
                element={
                  <RoleProtectedRoute
                    allowedRoles={["admin", "manager", "staff"]}
                  >
                    <EventQueryReport />
                  </RoleProtectedRoute>
                }
              />

              {/* Public routes */}
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/signup" element={<Sign_up />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/login" element={<Login />} />
              <Route path="/employee_login" element={<EmployeeLogin />} />
              <Route path="/admin_dash" element={<AdminDash />} />
              

              <Route path="/animal_form" element={<AnimalForm />} />
              <Route path="/event_form" element={<EventForm />} />
              <Route path="/enclosure_form" element={<EnclosureForm />} />
              <Route path="/employee_form" element={<EmployeeForm />} />
              <Route path="/ticket_form" element={<TicketForm />} />
              <Route path="/visitor_form" element={<VisitorForm />} />
              <Route path="/membership_form" element={<MembershipForm />} />
              <Route path="/medical_form" element={<MedicalForm />} />
                
              <Route path="/query_report/animals" element={<AnimalQueryReport />} />
              <Route path="/query_report/events" element={<EventQueryReport />} />
              <Route path="/query_report/enclosures" element={<EnclosureQueryReport />} />
              <Route path="/query_report/employees" element={<EmployeeQueryReport />} />
              <Route path="/query_report/tickets" element={<TicketQueryReport />} />
              <Route path="/query_report/visitors" element={<VisitorMembershipQueryReport />} />
              <Route path="/query_report/revenue" element={<RevenueQueryReport />} />
              <Route path="/query_report/feedLogs" element={<FeedLogsQueryReport />} />
              <Route path="/query_report/medicalRecords" element={<MedicalRecordsQueryReport />} />
              
              <Route path="/:type/checkout" element={<Checkout />} />
              <Route path="/calendar" element={<EventsPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/my-membership" element={<MyMembership />} />


              {/* Customer protected routes */}
              <Route element={<ProtectedRoutes allowedRoles={["customer"]} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/my-membership" element={<MyMembership />} />
                <Route path="/:type/checkout" element={<Checkout />} />
              </Route>

            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

function Root() {
  return (
    <>
      <BodyClassManager />
      <AppContent />
    </>
  );
}

export default Root;
