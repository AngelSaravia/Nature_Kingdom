import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [showProcessing, setShowProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const purchaseType = location.pathname.includes('/tickets/') ? 'tickets' : 'membership';

  // Add state for form fields
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });


  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 16) {
      // Format with spaces for display (but spaces aren't stored in value)
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = formatted;
      setPaymentDetails(prev => ({
        ...prev,
        cardNumber: value
      }));
    }
  };

  // Handle expiry date input
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 4) {
      // Auto-format as MM/YY
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      // Validate month
      if (value.length >= 2) {
        const month = parseInt(value.slice(0, 2));
        if (month > 12) {
          value = '12' + value.slice(2);
        }
        if (month < 1) {
          value = '01' + value.slice(2);
        }
      }
      e.target.value = value;
      setPaymentDetails(prev => ({
        ...prev,
        expiryDate: value
      }));
    }
  };

  // Handle CVV input
  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 3) {
      setPaymentDetails(prev => ({
        ...prev,
        cvv: value
      }));
    }
  };

  // Handle name input
  const handleNameChange = (e) => {
    setPaymentDetails(prev => ({
      ...prev,
      nameOnCard: e.target.value
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    if (paymentDetails.cardNumber.length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }
    if (paymentDetails.expiryDate.length !== 5) {
      alert('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (paymentDetails.cvv.length !== 3) {
      alert('Please enter a valid 3-digit CVV');
      return false;
    }
    if (!paymentDetails.nameOnCard.trim()) {
      alert('Please enter the name on card');
      return false;
    }
    return true;
  };


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
            <div className="membership-details cart-item">
              <p>Type: {state?.membershipDetails.type}</p>
              <p>Duration: {state?.membershipDetails.duration}</p>
              <p>Price: ${state?.membershipDetails.price}</p>
            </div>
            <div className='total'>
            <h4>Total: ${state?.membershipDetails.price}</h4>
            </div>
          </div>
        );
      }
    };
  
    // Add prices object at the top of the component
    const prices = {
      membership: 79.99,
      adult: 24.99,
      child: 14.99,
      senior: 19.99,
      member: 0
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
          setShowProcessing(true);
          
          // After 6 seconds, switch to confirmation popup
          setTimeout(() => {
            setShowProcessing(false);
            setShowConfirmation(true);
          }, 6000);
        }
      };

      const handleConfirmationClose = () => {
        setShowConfirmation(false);
        navigate('/'); // Optional: navigate only when they click "Done"
      };

      return (
        <>
          <div className="checkout-container">
            {/* <h2 className = "checkout-heading">Checkout</h2> */}
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
                    onChange={handleCardNumberChange}
                    onKeyPress={(e) => {
                      if (!/\d/.test(e.key)) e.preventDefault();
                    }}
                    maxLength="19"
                    required
                  />
                </div>
    
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      onChange={handleExpiryDateChange}
                      onKeyPress={(e) => {
                        if (!/\d/.test(e.key)) e.preventDefault();
                      }}
                      maxLength="5"
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      onChange={handleCVVChange}
                      onKeyPress={(e) => {
                        if (!/\d/.test(e.key)) e.preventDefault();
                      }}
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
                    onChange={handleNameChange}
                    required
                  />
                </div>
    
                <button type="submit" className="checkout-button">
                  Complete Purchase
                </button>
              </form>
            </div>
          </div>
    
          {showProcessing && (
            <>
            <div className="overlay"></div>
            <div className="confirmation-popup">
                <h3>Processing Your Purchase</h3>
                <div className="loading-spinner"></div>
                <p>Please wait while we process your payment...</p>
            </div>
            </>
        )}
          {showConfirmation && (
            <>
            <div className="overlay"></div>
            <div className="confirmation-popup success">
                <div className="success-icon">✓</div>
                <h3>Purchase Successful!</h3>
                <p>Thank you for your purchase.</p>
                {purchaseType === 'tickets' ? (
                <p>Your tickets can be viewed from your dashboard.</p>
                ) : (
                <p>Your membership has been activated.</p>
                )}
                <button 
                className="checkout-button"
                onClick={handleConfirmationClose}
                >
                Done
                </button>
            </div>
            </>
        )}
        </>
      );
    };
    
    export default Checkout;