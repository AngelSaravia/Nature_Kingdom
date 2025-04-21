import { useNavigate } from "react-router-dom";
import "./admin_dash.css";

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
                <button
                  onClick={() => navigate("/entryForm/employees")}
                  className="dashboard-button"
                >
                  {" "}
                  Employees
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/entryForm/events")}
                  className="dashboard-button"
                >
                  {" "}
                  Events
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/entryForm/tickets")}
                  className="dashboard-button"
                >
                  {" "}
                  Tickets
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/entryForm/visitors")}
                  className="dashboard-button"
                >
                  {" "}
                  Visitors
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
