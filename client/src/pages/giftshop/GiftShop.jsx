// GiftShop.js
import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiSearch, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import './GiftShop.css';

const GiftShop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock data - replace with your API call
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Zoo Plush Elephant',
        description: 'Soft and cuddly elephant plush toy',
        price: 24.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Elephant+Plush',
        category: 'plush',
        stock: 15
      },
      {
        id: 2,
        name: 'Safari Hat',
        description: 'Perfect for your zoo adventures',
        price: 19.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Safari+Hat',
        category: 'clothing',
        stock: 8
      },
      {
        id: 3,
        name: 'Animal Encyclopedia',
        description: 'Learn about all the animals in our zoo',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Animal+Book',
        category: 'books',
        stock: 12
      },
      {
        id: 4,
        name: 'Zoo Keychain Set',
        description: 'Set of 5 animal keychains',
        price: 12.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Keychain+Set',
        category: 'souvenirs',
        stock: 20
      },
      {
        id: 5,
        name: 'Lion Plush',
        description: 'King of the jungle plush toy',
        price: 22.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Lion+Plush',
        category: 'plush',
        stock: 10
      },
      {
        id: 6,
        name: 'Zoo T-Shirt',
        description: 'Official zoo branded t-shirt',
        price: 18.99,
        imageUrl: 'https://via.placeholder.com/300x300?text=Zoo+T-Shirt',
        category: 'clothing',
        stock: 15
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 800); // Simulate loading delay
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading our wonderful zoo gifts...</p>
      </div>
    );
  }

  return (
    <div className="gift-shop-page">
      <header className="gift-shop-header">
        <div className="header-content">
          <h1>Wild Treasures <span> Zoo Gift Shop</span></h1>
          <p>Take home a piece of your zoo adventure</p>
        </div>
      </header>

      <div className="shop-container">
        <aside className="sidebar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="categories">
            <h3>Categories</h3>
            <ul>
              <li className={activeCategory === 'all' ? 'active' : ''}>
                <button onClick={() => setActiveCategory('all')}>All Items</button>
              </li>
              <li className={activeCategory === 'plush' ? 'active' : ''}>
                <button onClick={() => setActiveCategory('plush')}>Plush Toys</button>
              </li>
              <li className={activeCategory === 'clothing' ? 'active' : ''}>
                <button onClick={() => setActiveCategory('clothing')}>Clothing</button>
              </li>
              <li className={activeCategory === 'books' ? 'active' : ''}>
                <button onClick={() => setActiveCategory('books')}>Books</button>
              </li>
              <li className={activeCategory === 'souvenirs' ? 'active' : ''}>
                <button onClick={() => setActiveCategory('souvenirs')}>Souvenirs</button>
              </li>
            </ul>
          </div>
        </aside>

        <main className="product-area">
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
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
        </main>
      </div>

      <button 
        className="cart-button" 
        onClick={() => setIsCartOpen(true)}
      >
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
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.imageUrl} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <FiMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                      <button 
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
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
                  <button className="checkout-button">Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          {product.stock < 5 && (
            <span className="low-stock">Only {product.stock} left!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftShop;