import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const purchaseType = location.pathname.includes('/tickets/') ? 'tickets' : 'membership';

    useEffect(() => {
      // Validate state and redirect if invalid access
      if (!state) {
        navigate(purchaseType === 'tickets' ? '/tickets' : '/membership');
        return;
      }
  
      // Validate required data based on purchase type
      if (purchaseType === 'tickets' && !state.tickets) {
        navigate('/tickets');
        return;
      }
  
      if (purchaseType === 'membership' && !state.membershipDetails) {
        navigate('/membership');
        return;
      }
    }, [purchaseType, state, navigate]);
  
    const renderPurchaseDetails = () => {
      if (purchaseType === 'tickets') {
        return (
          <div className="purchase-details">
            <h3>Ticket Purchase Details</h3>
            {Object.entries(state.tickets).map(([type, quantity]) => {
              if (quantity > 0) {
                return (
                  <div key={type} className="cart-item">
                    <p>Ticket Type: {type.charAt(0).toUpperCase() + type.slice(1)}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Price: ${(quantity * prices[type]).toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            }).filter(Boolean)}
            <div className="total">
              <h4>Total: ${state.total.toFixed(2)}</h4>
            </div>
          </div>
        );
      }
  
      if (purchaseType === 'membership') {
        return (
          <div className="purchase-details">
            <h3>Membership Purchase Details</h3>
            <div className="membership-details">
              <p>Type: {state?.membershipDetails.type}</p>
              <p>Duration: {state?.membershipDetails.duration}</p>
              <p>Price: ${state?.membershipDetails.price}</p>
            </div>
          </div>
        );
      }
    };
  
    // Add prices object at the top of the component
    const prices = {
      adult: 24.99,
      child: 14.99,
      senior: 19.99,
      member: 0
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
        
        // 6-second delay before redirecting
        setTimeout(() => {
          navigate('/confirmation');  // or wherever you want to redirect after purchase
        }, 5000);
      };
    
      return (
        <>
          <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="purchase-type-indicator">
              {purchaseType === 'tickets' ? 'Ticket Purchase' : 'Membership Purchase'}
            </div>
    
            {renderPurchaseDetails()}
    
            <div className="payment-section">
              <h3>Payment Details</h3>
              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="16"
                    required
                  />
                </div>
    
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
    
                <div className="form-group">
                  <label>Name on Card</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    required
                  />
                </div>
    
                <button type="submit" className="checkout-button">
                  Complete Purchase
                </button>
              </form>
            </div>
          </div>
    
          {showConfirmation && (
            <>
              <div className="overlay"></div>
              <div className="confirmation-popup">
                <h3>Processing Your Purchase</h3>
                <div className="loading-spinner"></div>
                <p>Please wait while we process your payment...</p>
              </div>
            </>
          )}
        </>
      );
    };
    

export default Checkout;