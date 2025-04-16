import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import "./manager_dash.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManagerDash = () => {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState({
    tickets: 0,
    giftShop: 0,
    membership: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch all revenue data without filters
        const response = await fetch(`${API_BASE_URL}/query_report/revenue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entity_type: "revenue",
            filters: {}
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Calculate totals by product type
          const totals = data.data.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0;
            acc.total += price;
            
            switch(item.type_of_product) {
              case 'ticket':
                acc.tickets += price;
                break;
              case 'membership':
                acc.membership += price;
                break;
              case 'gift':
                acc.giftShop += price;
                break;
              default:
                break;
            }
            return acc;
          }, { tickets: 0, giftShop: 0, membership: 0, total: 0 });

          setRevenueData(totals);
        } else {
          console.error("Error fetching revenue data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Manager Dashboard</h1>

        {/* Dashboard Buttons */}
        <div className="dashboard-single">
          <div className="dashboard-box">
            <h2 className="dashboard-heading shortcuts-heading">Manager Shortcuts</h2>
            <div className="short-cut-grid">
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
            </div>
          </div> 
        </div>

        {/* Revenue Overview Section */}
        <div className="dashboard-single">
          <div className="dashboard-box">
          <button onClick={() => navigate("/query_report/revenue")}><h2 className="dashboard-heading">Revenue Overview</h2></button>
            
              <div className="revenue-grid">
                <div className="revenue-item">
                  <div className="revenue-value">${revenueData.tickets.toFixed(2)}</div>
                  <div className="revenue-label">TICKETS</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-value">${revenueData.giftShop.toFixed(2)}</div>
                  <div className="revenue-label">GIFT SHOP</div>
                </div>
                <div className="revenue-item">
                  <div className="revenue-value">${revenueData.membership.toFixed(2)}</div>
                  <div className="revenue-label">MEMBERSHIPS</div>
                </div>
                <div className="revenue-total">
                  <div className="revenue-value">${revenueData.total.toFixed(2)}</div>
                  <div className="revenue-label">TOTAL REVENUE</div>
                </div>
                
              </div>
            
          </div>
        </div>

        <div className="dashboard-grid">
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
              <div className="dashboard-single">
                <button
                  onClick={() => navigate("/query_report/revenue")}
                  className="dashboard-button"
                >
                  {" "}
                  Revenue
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
        </div>
      </div>
    </div>
  );
};

export default ManagerDash;
