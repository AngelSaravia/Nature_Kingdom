import { useNavigate } from "react-router-dom";
import "./zookeeper_dash.css";
import backgroundImage from "../../zoo_pictures/giraffe.jpg";

const ZookeeperDash = () => {
  const navigate = useNavigate();

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
        <h1 className="dashboard-title">Zookeeper Dashboard</h1>

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
                  onClick={() => navigate("/entryForm/enclosures")}
                  className="dashboard-button"
                >
                  {" "}
                  Enclosures
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/entryForm/animals")}
                  className="dashboard-button"
                >
                  {" "}
                  Animals
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
          <div className="dashboard-box">
            <h2 className="dashboard-heading">Add/Alter/Delete Data</h2>
            <div className="dashboard-grid">
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/employee_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Employees
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/enclosures_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Enclosures
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/animal_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Animals
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/event_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Events
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/ticket_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Tickets
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/visitor_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Visitors
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/membership_form")}
                  className="dashboard-button"
                >
                  {" "}
                  Memberships
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZookeeperDash;
