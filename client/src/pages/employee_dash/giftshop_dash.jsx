import { useEffect, useState } from "react";
import "./giftshop_dash.css";
import {
  restockProduct,
  getProducts,
  getProductHistory,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
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

  // New state variables for image handling
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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
          buyLimit: product.buy_limit, // Include buy_limit
          status: product.amount_stock < 5 ? "Low Stock" : "In Stock",
          lastStocked: history.lastStocked,
          totalPurchased: history.totalPurchased,
          imageUrl: product.imageUrl, // Include image URL
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

  const debugUploadProcess = async (imageFile) => {
    console.log("Starting image upload process with file:", imageFile.name);

    try {
      // Test FormData creation
      const formData = new FormData();
      formData.append("file", imageFile);
      console.log("FormData created successfully");

      // Log the API endpoint
      const uploadUrl = `${API_BASE_URL}/api/products/upload-image`;
      console.log("Uploading to endpoint:", uploadUrl);

      // Make the request with debug logs
      console.log("Initiating fetch request...");
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers]),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Successfully parsed response JSON:", data);

      if (data.success && data.imageUrl) {
        console.log("Image uploaded successfully, URL:", data.imageUrl);
        return data.imageUrl;
      } else {
        console.error("Response indicated failure:", data);
        throw new Error(data.message || "Failed to get upload URL");
      }
    } catch (error) {
      console.error("Error in image upload process:", error);
      throw error;
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    // Reset the file input
    document.getElementById("imageFile").value = "";
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
        imageUrl: product.imageUrl || "",
      };
      setModalData({ action, product: fullProduct });

      // Set image preview and URL for the form
      setImageUrl(product.imageUrl || "");
      setImagePreview(product.imageUrl || "");
      setImageFile(null);
    } else {
      setModalData({ action, product });
      // Reset image states for new products
      setImageUrl("");
      setImagePreview("");
      setImageFile(null);
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

    // Handle image (either URL or file)
    if (imageFile) {
      // If we have a file, we need to upload it first
      try {
        const uploadedImageUrl = await uploadProductImage(imageFile);
        formData.imageUrl = uploadedImageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(
          "Failed to upload image. Please try again or use an image URL instead."
        );
        return;
      }
    } else if (imageUrl) {
      // If we have a URL, use that
      formData.imageUrl = imageUrl;
    }

    // Submit the form data
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

  const CATEGORY_PLACEHOLDERS = {
    // Default gray placeholder
    default:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNmI2YiIgZHk9Ii4zZW0iPlpvbyBQcm9kdWN0PC90ZXh0Pjwvc3ZnPg==",
    // Blue placeholder for clothing
    clothing:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNjYWU4ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5NjJmZiIgZHk9Ii4zZW0iPlpvbyBDbG90aGluZzwvdGV4dD48L3N2Zz4=",
    // Green placeholder for books
    books:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNkN2ZmZDciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzA5NjYwOSIgZHk9Ii4zZW0iPlpvbyBCb29rPC90ZXh0Pjwvc3ZnPg==",
    // Yellow placeholder for souvenirs
    souvenirs:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmY5YzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2E1N2MwNyIgZHk9Ii4zZW0iPlpvbyBTb3V2ZW5pcjwvdGV4dD48L3N2Zz4=",
    // Orange placeholder for plush toys
    plush:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmUwYzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2M0NjcwMCIgZHk9Ii4zZW0iPlBsdXNoIFRveTwvdGV4dD48L3N2Zz4=",
    // Additional placeholder for "plushy" category since your data shows this variation
    plushy:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmZmUwYzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2M0NjcwMCIgZHk9Ii4zZW0iPlBsdXNoeSBUb3k8L3RleHQ+PC9zdmc+",
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
                <th>Image</th>
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
                  <td className="image-cell">
                    {/* Temporarily hard-code an image to test rendering */}
                    <img
                      src="https://placehold.co/100x100/cccccc/333333?text=Test"
                      alt="Test placeholder"
                      className="product-thumbnail"
                    />
                    {/* Original dynamic code */}
                    {false && item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="product-thumbnail"
                      />
                    )}
                  </td>
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

                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    defaultValue={modalData.product.category || ""}
                    required
                  />

                  <label htmlFor="buy_limit">Buy Limit</label>
                  <input
                    type="number"
                    id="buy_limit"
                    defaultValue={modalData.product.buy_limit || ""}
                    required
                  />

                  {/* Image input section */}
                  <div className="image-input-container">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                    />

                    <div className="separator">
                      <span>OR</span>
                    </div>

                    <label htmlFor="imageFile">Upload Image</label>
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="file-input"
                    />

                    {imagePreview && (
                      <div className="image-preview">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            marginTop: "10px",
                          }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
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
