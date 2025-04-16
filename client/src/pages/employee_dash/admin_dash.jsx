import { useNavigate } from "react-router-dom";
import  './admin_dash.css';

const AdminDash = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* Dashboard Buttons */}
        <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2 className="dashboard-heading">Query for Data</h2>
            <div className="dashboard-grid">
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/employees")} className="dashboard-button"> Employees</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/enclosures")} className="dashboard-button"> Enclosures</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/animals")} className="dashboard-button"> Animals</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/events")} className="dashboard-button"> Events</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/tickets")} className="dashboard-button"> Tickets</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/visitors")} className="dashboard-button"> Visitors</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/revenue")} className="dashboard-button"> Revenue</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/feedlogs")} className="dashboard-button"> Feed Logs</button>
                </div>
                <div className="dashboard-single">
                    <button onClick={() => navigate("/query_report/medicalRecords")} className="dashboard-button"> Medical Records</button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDash;
