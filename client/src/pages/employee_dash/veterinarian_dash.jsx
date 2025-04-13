import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Add these imports
import "./veterinarian_dash.css";
import TaskNotification from "../../components/notification/TaskNotification";
import ZooKeeperReportTable from "../dataQueryReports/veterinarian_animalReport";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminDash = () => {
  const navigate = useNavigate();
  const [criticalStats, setCriticalStats] = useState({
    total: 0,
    new: 0,
    improving: 0,
  });

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
          total: data.total || 0,
          new: 0,
          improving: 0,
        });
        console.log("Updated state:", {
          total: data.total || 0,
          new: 0,
          improving: 0,
        });
      } catch (error) {
        console.error("Error fetching critical animals stats:", error);
        setCriticalStats({
          total: 0,
          new: 0,
          improving: 0,
        });
      }
    };

    fetchCriticalAnimalsStats();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <TaskNotification />
        <h1 className="dashboard-title">Veterinarian Dashboard</h1>

        {/* First container */}
        <div className="dashboard-box">
          <h2 className="dashboard-heading">Daily Appointments</h2>
          <div className="dashboard-grid">
            <div className="total-patients">
              <h4>Total patients: </h4>
              <h4>Completed: </h4>
              <h4>Upcoming: </h4>
            </div>
          </div>
        </div>

        <div className="dashboard-box">
          <h2 className="dashboard-heading">Critical Patients</h2>
          <div className="dashboard-grid">
            <div className="total-patients">
              <h4>
                Total:{" "}
                <span className="highlight-number">{criticalStats.total}</span>
              </h4>
              <h4>
                New:{" "}
                <span className="highlight-number">{criticalStats.new}</span>
              </h4>
              <h4>
                Improving:{" "}
                <span className="highlight-number">
                  {criticalStats.improving}
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
