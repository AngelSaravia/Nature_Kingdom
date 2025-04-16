import { useEffect, useState } from "react";
import "./giftshop_dash.css";
import {
  restockProduct,
  getProducts,
  getProductHistory,
} from "../../services/api";

const GiftDash = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stockInputs, setStockInputs] = useState({});
  const [reload, setReload] = useState(false);

  // Fetch products and transform them to inventory structure
  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [reload]);

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getProducts("", "");
      const fetchedProductHistory = await getProductHistory("");

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

      const transformedInventory = fetchedProducts.map((product) => {
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
      console.log("transformedInventory", transformedInventory);
      setProducts(transformedInventory);
    } catch (error) {
      console.error("Error fetching initial products:", error);
    }
    setIsLoading(false);
  };

  const handleStockChange = (productId, value) => {
    setStockInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleRestock = async (itemId) => {
    const newStock = stockInputs[itemId] ?? 0;
    try {
      await restockProduct({ product_id: itemId, newStock: newStock });
      // Update local state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                stock: newStock,
                status: "In Stock",
                lastStocked: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Restock error:", error);
    }
  };

  // console.log("products", products);
  const calculateTotalUnitsSold = (products) => {
    return products.reduce((total, product) => {
      // console.log("total", total);
      return total + parseInt(product.totalPurchased, 10);
    }, 0);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">GiftShop Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2>Inventory</h2>
            <p>Total Items: {products.length}</p>
            <p>
              Total Stocked Items:{" "}
              {products.filter((item) => item.stock > 0).length}
            </p>
            <p>
              Total Low Stock Items:{" "}
              {products.filter((item) => item.status === "Low Stock").length}
            </p>
          </div>
          <div className="dashboard-box">
            <h2>Sales</h2>
            {/* <p>Total Sales: $500</p> */}
            <p>Total Items Purchased: {calculateTotalUnitsSold(products)}</p>
          </div>
        </div>

        <div className="dashboard-box">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock</th>
                <th>Total Purchased</th>
                <th>Last Stocked On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.totalPurchased}</td>
                  <td>{item.lastStocked}</td>
                  <td>
                    <div className="status-container">
                      <span
                        className={
                          item.status === "Low Stock" ? "low-stock" : ""
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="stock-cell">
                      <input
                        className="stock-input"
                        type="number"
                        min="0"
                        value={stockInputs[item.id] ?? item.stock}
                        onChange={(e) =>
                          handleStockChange(item.id, e.target.value)
                        }
                      />
                      <button
                        className="restock-button"
                        onClick={() => handleRestock(item.id)}
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="dashboard-button-group">
            <button className="dashboard-button">Export Inventory</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default GiftDash;
