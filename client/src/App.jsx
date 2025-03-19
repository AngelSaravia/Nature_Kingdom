import React, { useEffect, useState, Profiler } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HomePage from "./pages/home/home";
import Sign_up from "./pages/signup/sign_up";
import Login from "./pages/login/login";
import EmployeeLogin from "./pages/employee/employee_login";
import EmployeeForm from "./pages/dataEntries/employee_form";
import "./App.css";

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

function App() {
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
    <Router>
      <BodyClassManager />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee_login" element={<EmployeeLogin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default Root;
