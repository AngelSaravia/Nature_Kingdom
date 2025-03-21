import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import HomePage from "./pages/home/home";
import Sign_up from "./pages/signup/sign_up";
import Login from "./pages/login/login";
import EmployeeLogin from "./pages/employee/employee_login";
import EmployeeForm from "./pages/dataEntries/employee_form";
import AnimalForm from "./pages/dataEntries/animal_form";
import EnclosureForm from "./pages/dataEntries/enclosure_form";
import EventForm from "./pages/dataEntries/event_form";
import "./App.css";

function BodyClassManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.classList.remove("home-page-body", "signup-page-body");
    if (pathname === "/") document.body.classList.add("home-page-body");
    else if (pathname === "/signup")
      document.body.classList.add("signup-page-body");
  }, [pathname]);

  return null;
}

function MainApp() {
  return (
    <>
      <BodyClassManager />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee_login" element={<EmployeeLogin />} />
            <Route path="/employee_form" element={<EmployeeForm />} />
            <Route path="/animal_form" element={<AnimalForm />} />
            <Route path="/enclosure_form" element={<EnclosureForm />} />
            <Route path="/event_form" element={<EventForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;