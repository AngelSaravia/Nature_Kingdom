import { useNavigate } from "react-router-dom";
import "./manager_dash.css";
import { useEffect, useState } from "react";
import {
  getManagerType,
  getProducts,
  getProductHistory,
  getAnimalHealthStatus,
  getCriticalAnimals,
} from "../../services/api";
import StatusMetricsPanel from "../../components/StatusMetric/StatusMetricPanel"; // Make sure path is correct

const ManagerDash = () => {
  const navigate = useNavigate();
  const [managerType, setManagerType] = useState("");

  // Gift shop data
  const [giftShopStats, setGiftShopStats] = useState({
    totalItems: 0,
    stockedItems: 0,
    lowStockItems: 0,
    totalPurchased: 0,
    products: [],
  });

  // Animal health data
  const [animalHealth, setAnimalHealth] = useState({
    healthyCount: 0,
    needsCareCount: 0,
    criticalCount: 0,
    criticalAnimals: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Debug state
  const [debug, setDebug] = useState({
    managerTypeResponse: null,
    productResponse: null,
    historyResponse: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Get manager type - log the full response for debugging
        const managerTypeResponse = await getManagerType(
          localStorage.getItem("employeeId")
        );
        console.log("Full manager type response:", managerTypeResponse);

        // Store the response for debugging
        setDebug((prev) => ({ ...prev, managerTypeResponse }));

        let currentManagerType = "";

        // Handle different response structures
        if (managerTypeResponse && managerTypeResponse.data) {
          if (typeof managerTypeResponse.data === "string") {
            currentManagerType = managerTypeResponse.data;
          } else if (managerTypeResponse.data.type_of_manager) {
            currentManagerType = managerTypeResponse.data.type_of_manager;
          }
        }

        console.log("Current manager type:", currentManagerType);
        setManagerType(currentManagerType);

        // Normalize the manager type for comparison (case insensitive)
        const normalizedManagerType = currentManagerType.toLowerCase();

        // Fetch data based on normalized manager type
        if (normalizedManagerType === "giftshop") {
          console.log("Fetching gift shop data...");
          await fetchGiftShopData();
        } else if (normalizedManagerType === "veterinarian") {
          console.log("Fetching veterinarian data...");
          await fetchAnimalHealthData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on component mount

  // Store manager type in local storage
  useEffect(() => {
    if (managerType) {
      localStorage.setItem("managerType", managerType);
    }
  }, [managerType]);

  // Fetch gift shop data
  const fetchGiftShopData = async () => {
    try {
      console.log("Starting to fetch products");
      const fetchedProducts = await getProducts("", "");
      console.log("Fetched products:", fetchedProducts);

      console.log("Starting to fetch product history");
      const fetchedProductHistory = await getProductHistory("");
      console.log("Fetched product history:", fetchedProductHistory);

      // Store responses for debugging
      setDebug((prev) => ({
        ...prev,
        productResponse: fetchedProducts,
        historyResponse: fetchedProductHistory,
      }));

      // Check if we have the expected data structure
      if (!fetchedProducts || !Array.isArray(fetchedProducts)) {
        console.error("Invalid products data format:", fetchedProducts);
        return;
      }

      if (!fetchedProductHistory || !fetchedProductHistory.products) {
        console.error(
          "Invalid product history data format:",
          fetchedProductHistory
        );
        return;
      }

      const productHistoryMap = fetchedProductHistory.products.reduce(
        (acc, productHistory) => {
          const { name, last_stocked_on, total_sold } = productHistory;
          acc[name] = {
            lastStocked: last_stocked_on ? last_stocked_on : "N/A",
            totalPurchased: total_sold != null ? total_sold : 0,
          };
          return acc;
        },
        {}
      );

      const transformedProducts = fetchedProducts.map((product) => {
        const history = productHistoryMap[product.name] || {
          lastStocked: "N/A",
          totalPurchased: 0,
        };
        return {
          id: product.product_id,
          name: product.name,
          stock: parseInt(product.amount_stock),
          status: product.amount_stock < 5 ? "Low Stock" : "In Stock",
          lastStocked: history.lastStocked,
          totalPurchased: history.totalPurchased,
        };
      });

      const totalItems = transformedProducts.length;
      const stockedItems = transformedProducts.filter(
        (item) => item.stock > 0
      ).length;
      const lowStockItems = transformedProducts.filter(
        (item) => item.status === "Low Stock"
      ).length;
      const totalPurchased = transformedProducts.reduce((total, product) => {
        return total + parseInt(product.totalPurchased || 0, 10);
      }, 0);

      setGiftShopStats({
        totalItems,
        stockedItems,
        lowStockItems,
        totalPurchased,
        products: transformedProducts,
      });

      console.log("Gift shop stats:", {
        totalItems,
        stockedItems,
        lowStockItems,
        totalPurchased,
      });
    } catch (error) {
      console.error("Error fetching gift shop data:", error);
      // Set some demo data if API fails
      setGiftShopStats({
        totalItems: 6,
        stockedItems: 4,
        lowStockItems: 2,
        totalPurchased: 25,
        products: [],
      });
    }
  };

  // Fetch animal health data for Veterinarian manager
  const fetchAnimalHealthData = async () => {
    try {
      console.log("Starting to fetch animal health status");
      const healthResponse = await getAnimalHealthStatus();
      console.log("Fetched animal health status:", healthResponse);

      // Check if we have the expected data structure
      if (!healthResponse || !healthResponse.data) {
        console.error("Invalid animal health data format:", healthResponse);

        // Set default values
        setAnimalHealth({
          healthyCount: 0,
          needsCareCount: 0,
          criticalCount: 0,
          criticalAnimals: [],
        });
        return;
      }

      const healthData = healthResponse.data.data || [];

      const healthyData = healthData.find(
        (item) => item.health_status === "HEALTHY"
      );
      const needsCareData = healthData.find(
        (item) => item.health_status === "NEEDS CARE"
      );
      const criticalData = healthData.find(
        (item) => item.health_status === "CRITICAL"
      );

      let criticalAnimals = [];
      if (criticalData && criticalData.total > 0) {
        try {
          const criticalResponse = await getCriticalAnimals();
          if (criticalResponse.data && criticalResponse.data.success) {
            criticalAnimals = criticalResponse.data.data || [];
          }
        } catch (error) {
          console.error("Error fetching critical animals:", error);
        }
      }

      setAnimalHealth({
        healthyCount: healthyData ? healthyData.total : 0,
        needsCareCount: needsCareData ? needsCareData.total : 0,
        criticalCount: criticalData ? criticalData.total : 0,
        criticalAnimals: criticalAnimals,
      });

      console.log("Animal health stats:", {
        healthyCount: healthyData ? healthyData.total : 0,
        needsCareCount: needsCareData ? needsCareData.total : 0,
        criticalCount: criticalData ? criticalData.total : 0,
        criticalAnimalsCount: criticalAnimals.length,
      });
    } catch (error) {
      console.error("Error fetching animal health data:", error);
      // Set default values in case of API failure
      setAnimalHealth({
        healthyCount: 0,
        needsCareCount: 0,
        criticalCount: 0,
        criticalAnimals: [],
      });
    }
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "#dc3545"; // Red
      case "Treatment":
        return "#fd7e14"; // Orange
      case "Observation":
      case "NEEDS CARE":
        return "#ffc107"; // Yellow
      case "HEALTHY":
        return "#28a745"; // Green
      default:
        return "#6c757d"; // Grey
    }
  };

  // Generate metrics for gift shop inventory
  const inventoryMetrics = [
    {
      value: giftShopStats.totalItems,
      label: "Total Items",
      color: "#4a89dc", // Blue
    },
    {
      value: giftShopStats.stockedItems,
      label: "Stocked Items",
      color: "#28a745", // Green
    },
    {
      value: giftShopStats.lowStockItems,
      label: "Low Stock Items",
      color: "#ffc107", // Yellow
    },
  ];

  // Generate metrics for gift shop sales
  const salesMetrics = [
    {
      value: giftShopStats.totalPurchased,
      label: "Total Items Purchased from Giftshop",
      color: "#4a89dc", // Blue
    },
  ];

  // Generate metrics for animal health
  const animalHealthMetrics = [
    {
      value: animalHealth.healthyCount,
      label: "Healthy",
      color: "#28a745", // Green
    },
    {
      value: animalHealth.needsCareCount,
      label: "Needs Care",
      color: "#ffc107", // Yellow
    },
    {
      value: animalHealth.criticalCount,
      label: "Requiring Treatment",
      color: "#dc3545", // Red
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Dynamic h1 title based on manager type */}
        <h1 className="dashboard-title">
          {(() => {
            switch (managerType?.toLowerCase()) {
              case "giftshop":
                return "Gift Shop Manager Dashboard";
              case "veterinarian":
                return "Veterinarian Manager Dashboard";
              case "general":
                return "Zookeeper Manager Dashboard";
              default:
                return "Manager Dashboard";
            }
          })()}
        </h1>

        {/* Dashboard Buttons */}
        <div className="dashboard-single">
          <div className="dashboard-box">
            <h2 className="dashboard-heading shortcuts-heading">
              Manager Shortcuts
            </h2>
            <div>
              {(() => {
                switch (managerType?.toLowerCase()) {
                  case "giftshop":
                    return (
                      <>
                        <div className="short-cut-grid">
                          <button
                            onClick={() => navigate("/manager_timesheets")}
                            className="dashboard-button"
                          >
                            View Timesheets
                          </button>
                          <button
                            onClick={() => navigate("/giftshop_dash")}
                            className="dashboard-button"
                          >
                            View Gift Shop Portal
                          </button>
                        </div>

                        {/* Gift Shop Status Metrics */}
                        <div className="dashboard-metrics-container">
                          <StatusMetricsPanel
                            title="Inventory Overview"
                            metrics={inventoryMetrics}
                            isLoading={isLoading}
                            onViewAllClick={() => navigate("/giftshop_dash")}
                            viewAllButtonText="View Inventory"
                          />

                          <StatusMetricsPanel
                            title="Sales Overview"
                            metrics={salesMetrics}
                            isLoading={isLoading}
                            onViewAllClick={() =>
                              navigate("/query_report/revenue")
                            }
                            viewAllButtonText="View Sales Data"
                          />
                        </div>

                        {/* Low Stock Items Table */}
                        {giftShopStats.lowStockItems > 0 && (
                          <div className="low-stock-section">
                            <h3 className="Low-stock">Low Stock Items</h3>
                            <table className="dashboard-table">
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Current Stock</th>
                                  <th>Last Stocked On</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {giftShopStats.products
                                  .filter((item) => item.status === "Low Stock")
                                  .map((item) => (
                                    <tr key={item.id}>
                                      <td>{item.name}</td>
                                      <td>{item.stock}</td>
                                      <td>{item.lastStocked}</td>
                                      <td>
                                        <div className="status-container">
                                          <span className="low-stock">
                                            {item.status}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    );

                  case "veterinarian":
                    return (
                      <>
                        <div className="short-cut-grid">
                          <button
                            onClick={() => navigate("/manager_timesheets")}
                            className="dashboard-button"
                          >
                            View Timesheets
                          </button>
                          <button
                            onClick={() => navigate("/medicalRecords")}
                            className="dashboard-button"
                          >
                            View Medical Records Report
                          </button>
                          <button
                            onClick={() =>
                              navigate("/entry_form/medicalRecords")
                            }
                            className="dashboard-button"
                          >
                            Medical History Entry Form
                          </button>

                          <button
                            onClick={() => navigate("/zookeeper_dash")}
                            className="dashboard-button"
                          >
                            View Zoo Keeper Portal
                          </button>
                          <button
                            onClick={() => navigate("/veterinarian_dash")}
                            className="dashboard-button"
                          >
                            View Veterinarian Portal
                          </button>
                          {/*<button
                  onClick={() => navigate("/employeeByManager_queryReport")}
                  className="dashboard-button"
                >
                  View Employees by Manager
                </button>*/}
                          {/*<button
                  onClick={() => navigate("/")}
                  className="dashboard-button"
                >
                  View GiftShop Sales Dashboard
                </button>*/}
                        </div>

                        {/* Animal Health Status Section */}
                        <StatusMetricsPanel
                          title="Animal Health Overview"
                          metrics={animalHealthMetrics}
                          isLoading={isLoading}
                          onViewAllClick={() =>
                            navigate("/entry_form/medicalRecords")
                          }
                          viewAllButtonText="View All Animal Health Records"
                        >
                          {animalHealth.criticalAnimals?.length > 0 && (
                            <div className="critical-animals">
                              <h3>Critical Cases</h3>
                              <div className="critical-animals-table">
                                <table className="dashboard-table">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Name</th>
                                      <th>Species</th>
                                      <th>Enclosure</th>
                                      <th>Status</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {animalHealth.criticalAnimals.map(
                                      (animal) => (
                                        <tr key={animal.id}>
                                          <td>{animal.id}</td>
                                          <td>{animal.name}</td>
                                          <td>{animal.species}</td>
                                          <td>{animal.enclosure}</td>
                                          <td
                                            style={{
                                              color: getStatusColor(
                                                animal.status
                                              ),
                                            }}
                                          >
                                            {animal.status}
                                          </td>
                                          <td>
                                            <button
                                              className="view-record-btn"
                                              onClick={() =>
                                                navigate(`/animal/${animal.id}`)
                                              }
                                            >
                                              View Record
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </StatusMetricsPanel>
                      </>
                    );

                  case "general":
                    return (
                      <>
                        <div className="short-cut-grid">
                          <button
                            onClick={() => navigate("/manager_timesheets")}
                            className="dashboard-button"
                          >
                            View Timesheets
                          </button>
                          <button
                            onClick={() => navigate("/query_report/revenue")}
                            className="dashboard-button"
                          >
                            View Revenue Reports
                          </button>
                          <button
                            onClick={() => navigate("/entryForm/enclosures")}
                            className="dashboard-button"
                          >
                            Enclosure Entry Form
                          </button>
                          <button
                            onClick={() => navigate("/entryForm/animals")}
                            className="dashboard-button"
                          >
                            Animal Entry Form
                          </button>
                          <button
                            onClick={() => navigate("/entryForm/feedLogs")}
                            className="dashboard-button"
                          >
                            Feed Logs Entry Form
                          </button>

                          {/* <button
                            onClick={() => navigate("/general_reports")}
                            className="dashboard-button"
                          >
                            View Reports
                          </button> */}
                        </div>
                      </>
                    );
                  default:
                    return <p>No dashboard available for this manager type.</p>;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManagerDash;
