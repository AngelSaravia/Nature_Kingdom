import { useEffect, useState } from "react";
import "./giftshop_dash.css";
import {
  restockProduct,
  getProducts,
  getProductHistory,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";
import backgroundImage from "../../zoo_pictures/aquarium.jpg";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const GiftDash = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stockInputs, setStockInputs] = useState({});
  const [reload, setReload] = useState(false);
  const [modalData, setModalData] = useState({ action: "", product: {} });
  const [showModal, setShowModal] = useState(false);
  const [selectedProductIdToDelete, setSelectedProductIdToDelete] =
    useState(null);

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

      console.log(fetchedProductHistory)
      console.log(fetchedProducts)

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
          buyLimit: product.buy_limit, // Include buy_limit
          status: product.amount_stock < 5 ? "Low Stock" : "In Stock",
          lastStocked: history.lastStocked,
          totalPurchased: history.totalPurchased,
          price: product.price,
          category: product.category,
          product_id: product.product_id,
          amount_stock: product.amount_stock,
        };
      });

      setProducts(transformedInventory);
    } catch (error) {
      console.error("Error fetching initial products:", error);
    }
    setIsLoading(false);
  };

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  }

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

  const calculateTotalUnitsSold = (products) => {
    return products.reduce((total, product) => {
      return total + parseInt(product.totalPurchased, 10);
    }, 0);
  };

  const openModal = (action, product = {}) => {
    // For update action, make sure we have all the required fields
    if (action === "update" && product) {
      // Ensure we have all the needed fields from the product
      const fullProduct = {
        product_id: product.id || product.product_id,
        name: product.name || "",
        price: product.price || "",
        amount_stock: product.stock || product.amount_stock || 0,
        category: product.category || "",
        buy_limit: product.buyLimit || product.buy_limit || 0,
      };
      setModalData({ action, product: fullProduct });
    } else {
      setModalData({ action, product });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalData.action === "delete") {
      handleModalSubmit({ product_id: selectedProductIdToDelete });
      return;
    }

    // Get form values
    const formData = {
      shop_id: "1",
      product_id: modalData.product?.product_id,
      name: e.target.name.value,
      price: e.target.price.value,
      amount_stock: e.target.amount_stock.value,
      category: e.target.category.value,
      buy_limit: e.target.buy_limit.value,
    };

    handleModalSubmit(formData);
  };

  const handleModalSubmit = async (productData) => {
    try {
      if (modalData.action === "add") {
        await addProduct(productData);
      } else if (modalData.action === "update") {
        await updateProduct(productData);
      } else if (modalData.action === "delete") {
        await deleteProduct(productData.product_id);
      }

      // Show success message
      alert(
        `Product successfully ${
          modalData.action === "add"
            ? "added"
            : modalData.action === "update"
            ? "updated"
            : "deleted"
        }!`
      );

      setReload((prev) => !prev);
      closeModal();
    } catch (error) {
      console.error(`Error ${modalData.action}ing product:`, error);
      alert(`Error ${modalData.action}ing product. See console for details.`);
    }
  };

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
                  <td>{(item.lastStocked != "N/A")? formatDate(item.lastStocked): item.lastStocked}</td>
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
                    {localStorage.getItem("managerType") === "Giftshop" && (
                      <button
                        className="update-button"
                        onClick={() =>
                          openModal(
                            "update",
                            products.find((p) => p.id === item.id)
                          )
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="dashboard-button-group">
            {localStorage.getItem("managerType") === "Giftshop" && (
              <div>
                <button onClick={() => openModal("add")}>Add Product</button>
                <button onClick={() => openModal("delete")}>
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup for Add/Update/Delete */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>
              {modalData.action === "add"
                ? "Add New Product"
                : modalData.action === "update"
                ? "Update Product"
                : "Delete Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              {(modalData.action === "add" ||
                modalData.action === "update") && (
                <>
                  <label htmlFor="name">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={modalData.product.name || ""}
                    required
                  />

                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    defaultValue={modalData.product.price || ""}
                    required
                  />

                  <label htmlFor="amount_stock">Stock Quantity</label>
                  <input
                    type="number"
                    id="amount_stock"
                    defaultValue={modalData.product.amount_stock || ""}
                    required
                  />

                  <label htmlFor="category">Category (choose one)</label>
                  <div className="form-group">
                    <select
                      id="category"
                      name="category"
                      defaultValue={modalData.product.category || ""}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="souvenirs">Souvenirs</option>
                      <option value="plush">Plush </option>
                    </select>
                  </div>

                  <label htmlFor="buy_limit">Buy Limit</label>
                  <input
                    type="number"
                    id="buy_limit"
                    defaultValue={modalData.product.buy_limit || ""}
                    required
                  />
                </>
              )}

              {modalData.action === "delete" && (
                <>
                  <label htmlFor="productToDelete">
                    Select Product to Delete:
                  </label>
                  <select
                    id="productToDelete"
                    value={selectedProductIdToDelete ?? ""}
                    onChange={(e) =>
                      setSelectedProductIdToDelete(e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.id}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <button type="submit">
                {modalData.action === "add"
                  ? "Add"
                  : modalData.action === "update"
                  ? "Update"
                  : "Delete"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftDash;
