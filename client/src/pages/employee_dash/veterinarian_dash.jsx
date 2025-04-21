import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./veterinarian_dash.css";
import ZooKeeperReportTable from "../dataQueryReports/veterinarian_animalReport";
import { useAuth } from "../../context/Authcontext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import backgroundImage from "../../zoo_pictures/zebra2.jpg";

const AdminDash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [criticalStats, setCriticalStats] = useState({
    critical: 0,
    needsCare: 0,
  });

  useEffect(() => {
    console.log("User data from AuthContext:", user);

    const employeeId = localStorage.getItem("employeeId");
    console.log("employeeId from localStorage:", employeeId);
  }, [user]);

  useEffect(() => {
    const fetchCriticalAnimalsStats = async () => {
      try {
        console.log("Fetching critical stats...");
        const response = await fetch(
          `${API_BASE_URL}/api/animals/critical-stats`
        );
        const data = await response.json();
        console.log("Received critical stats:", data);

        setCriticalStats({
          critical: data.critical || 0,
          needsCare: data.needsCare || 0,
        });
        console.log("Updated state:", {
          critical: data.critical || 0,
          needsCare: data.needsCare || 0,
        });
      } catch (error) {
        console.error("Error fetching critical animals stats:", error);
        setCriticalStats({
          critical: 0,
          needsCare: 0,
        });
      }
    };

    fetchCriticalAnimalsStats();
  }, []);

  const employeeId = user?.employeeId || localStorage.getItem("employeeId");

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="dashboard-card">
        <h1 className="dashboard-title">Veterinarian Dashboard</h1>

        <div className="dashboard-box">
          <h2 className="dashboard-heading">Overview</h2>
          <div className="dashboard-grid">
            <div className="total-patients">
              <h4>
                Critical:{" "}
                <span className="highlight-number">
                  {criticalStats.critical}
                </span>
              </h4>
              <h4>
                Needs Care:{" "}
                <span className="highlight-number">
                  {criticalStats.needsCare}
                </span>
              </h4>
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <h2 className="dashboard-heading">SHOW CRITICAL ANIMALS</h2>
          <ZooKeeperReportTable filterHealth="CRITICAL" />
          <div className="dashboard-grid">
            <div className="total-patients"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
