import React, { useState, useEffect, useCallback, useRef } from "react"; // Added useRef
import { FiShoppingCart, FiSearch, FiX, FiPlus, FiMinus } from "react-icons/fi";
import debounce from "lodash/debounce";
import { getProducts } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./GiftShop.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const GiftShop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Store cart data in localStorage
    localStorage.setItem("cartItems", JSON.stringify(cart));
    localStorage.setItem("cartTotal", subtotal.toString());

    // Navigate to checkout
    navigate("/giftshop/checkout", {
      state: {
        items: cart,
        total: subtotal,
        type: "gift",
      },
    });
  };

  // Create debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (searchValue, category) => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts(
          category === "all" ? "" : category,
          searchValue
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setIsLoading(false);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(value, activeCategory);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    debouncedFetch(searchTerm, category);
  };

  // Initial load
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getProducts("", "");
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching initial products:", error);
      }
      setIsLoading(false);
    };

    initialFetch();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product_id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="gift-shop-page">
      <header className="gift-shop-header">
        <div className="header-content">
          <h1>
            Wild Treasures <span>Zoo Gift Shop</span>
          </h1>
          <p>Take home a piece of your zoo adventure</p>
        </div>
      </header>

      <div className="shop-container">
        <aside className="sidebar">
          <div className="search-box">
            <form onSubmit={(e) => e.preventDefault()}>
              <FiSearch className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search gifts..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            </form>
          </div>

          <div className="categories">
            <h3>Categories</h3>
            <ul>
              {["all", "plush", "clothing", "books", "souvenirs"].map(
                (category) => (
                  <li
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                  >
                    <button onClick={() => handleCategoryChange(category)}>
                      {category === "all"
                        ? "All Items"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        </aside>

        <main className="product-area">
          {isLoading ? (
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Loading our wonderful zoo gifts...</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))
              ) : (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>Try adjusting your search or category filters</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <button className="cart-button" onClick={() => setIsCartOpen(true)}>
        <FiShoppingCart />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <div className="cart-header">
              <h2>Your Shopping Cart</h2>
              <button
                className="close-cart"
                onClick={() => setIsCartOpen(false)}
              >
                <FiX />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button
                  className="continue-shopping"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.product_id} className="cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>${(parseFloat(item.price) || 0).toFixed(2)}</p>
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                          >
                            <FiMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="subtotal">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <button
                    className="checkout-button"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
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

const ProductCard = ({ product, addToCart }) => {
  const SERVER_URL = API_BASE_URL;

  // Function to get appropriate image URL based on product data
  const getImageUrl = () => {
    // If product has an image URL
    if (product.imageUrl) {
      // Check if it's already a full URL or just a path
      return product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${SERVER_URL}${product.imageUrl}`;
    }

    // Category-based placeholder using embedded SVGs
    return (
      CATEGORY_PLACEHOLDERS[product.category] || CATEGORY_PLACEHOLDERS.default
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite callbacks
    e.target.src = CATEGORY_PLACEHOLDERS.default;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={getImageUrl()}
          alt={product.name}
          onError={handleImageError}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">
          {product.description || "No description available"}
        </p>
        <div className="product-footer">
          <span className="price">
            ${(parseFloat(product.price) || 0).toFixed(2)}
          </span>
          {product.amount_stock < 5 && product.amount_stock > 0 && (
            <span className="low-stock">Only {product.amount_stock} left!</span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
          disabled={product.amount_stock <= 0}
        >
          {product.amount_stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default GiftShop;
