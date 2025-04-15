import { useNavigate } from "react-router-dom";
import "./manager_dash.css";
import { useEffect, useState } from "react";
import { getManagerType } from "../../services/api";

const ManagerDash = () => {
  const navigate = useNavigate();
  const [managerType,setManagerType] = useState("");

  // console.log("employeeid: ", localStorage.getItem("employeeId"));

  useEffect(() => {
    const initialFetch = async () => {
      try{
        const managerType = await getManagerType(localStorage.getItem("employeeId"));
        setManagerType(managerType.data.type_of_manager);
      } catch (error) {
        console.log('Error Fetching Manager Type', error);
      }
    };
    initialFetch();
  }, []);

  console.log("manager type:", managerType)

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Manager Dashboard</h1>

        {/* Dashboard Buttons */}
        <div className="dashboard-single">
          <div className="dashboard-box">
            <h2 className="dashboard-heading shortcuts-heading">Manager Shortcuts</h2>
            <div>
              {managerType === "Giftshop" ? (<div className="short-cut-grid">
                <button
                  onClick={() => navigate("/manager_timesheets")}
                  className="dashboard-button"
                >
                  {" "}
                  View Timesheets
                </button>
                <button
                  onClick={() => navigate("/giftshop_dash")}
                  className="dashboard-button"
                >
                  {" "}
                  View Gift Shop Portal
                </button>
                </div>) : null}
              {managerType === "Veterinarian" ? (<div className="short-cut-grid">
                <button
                  onClick={() => navigate("/manager_timesheets")}
                  className="dashboard-button"
                >
                  {" "}
                  View Timesheets
                </button>
                <button
                  onClick={() => navigate("/zookeeper_dash")}
                  className="dashboard-button"
                >
                  {" "}
                  View Zoo Keeper Portal
                </button>
                <button
                  onClick={() => navigate("/veterinarian_dash")}
                  className="dashboard-button"
                >
                  {" "}
                  View Veterinarian Portal
                </button>
              </div>) : null}
              
            </div>
          </div> 
        </div>
        {/* <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2 className="dashboard-heading">Query for Data</h2>
            <div className="dashboard-grid">
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/query_report/employees")}
                  className="dashboard-button"
                >
                  {" "}
                  Employees
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/query_report/enclosures")}
                  className="dashboard-button"
                >
                  {" "}
                  Enclosures
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/query_report/animals")}
                  className="dashboard-button"
                >
                  {" "}
                  Animals
                </button>
              </div>
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/query_report/events")}
                  className="dashboard-button"
                >
                  {" "}
                  Events
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
                  onClick={() => navigate("/enclosure_form")}
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
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ManagerDash;
