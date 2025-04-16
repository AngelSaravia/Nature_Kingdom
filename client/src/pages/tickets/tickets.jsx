import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./tickets.css";
import BabyKoala from "../../zoo_pictures/koala_baby_photo.jpg";
import Babycougar from "../../zoo_pictures/baby_cougar.jpg";
import Lion from "../../zoo_pictures/zoo_lion.jpg";
import CoupleBirds from "../../zoo_pictures/couple_birds_2.jpg";

const Tickets = () => {
  const [isMemberView, setIsMemberView] = useState(false);
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [memberTicketsThisMonth, setMemberTicketsThisMonth] = useState(0);
  const [lastRedemptionDate, setLastRedemptionDate] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    senior: 0,
    member: 0,
  });

  const [total, setTotal] = useState(0);

  const prices = {
    adult: 24.99,
    child: 14.99,
    senior: 19.99,
    member: 0,
  };

  const handleCheckout = () => {
    const totalTickets = Object.values(tickets).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalTickets === 0) {
      setErrorMessage(
        "Please select at least one ticket before proceeding to checkout"
      );
      return;
    }

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    navigate(`/tickets/checkout`, {
      state: {
        tickets: tickets,
        total: total,
        type: "tickets",
      },
    });
  };

  // This would normally come from your backend
  const checkMemberStatus = () => {
    // Mock authentication check
    return isLoggedIn;
  };

  const checkMonthlyLimit = () => {
    // Mock check of monthly ticket usage
    return memberTicketsThisMonth < 4;
  };

  const handleMemberToggle = () => {
    if (!checkMemberStatus()) {
      alert("Please log in to access member benefits");
      return;
    }
    setIsMemberView(!isMemberView);
    resetTickets();
  };

  const resetTickets = () => {
    setTickets({
      adult: 0,
      child: 0,
      senior: 0,
      member: 0,
    });
    setTotal(0);
  };

  const handleIncrement = (type) => {
    if (type === "member") {
      if (!checkMonthlyLimit()) {
        alert("Monthly free ticket limit reached");
        return;
      }
      setMemberTicketsThisMonth((prev) => prev + 1);
      setLastRedemptionDate(new Date().toISOString());
    }

    setTickets((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setTotal((prev) => prev + prices[type]);
  };

  const handleDecrement = (type) => {
    if (tickets[type] > 0) {
      if (type === "member") {
        setMemberTicketsThisMonth((prev) => prev - 1);
      }
      setTickets((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
      setTotal((prev) => prev - prices[type]);
    }
  };

  return (
    <div className="tickets-container">
      <div className="tickets-hero">
        <h1>Purchase Your Tickets</h1>
        <p>Experience the wonders of nature at Nature Kingdom Zoo</p>

        <div className="member-toggle">
          <button
            className={`toggle-button ${!isMemberView ? "active" : ""}`}
            onClick={() => setIsMemberView(false)}
          >
            Regular Tickets
          </button>
          <button
            className={`toggle-button ${isMemberView ? "active" : ""}`}
            onClick={handleMemberToggle}
          >
            Member Benefits
          </button>
        </div>
      </div>

      {!isMemberView ? (
        <div className="ticket-types">
          <div className="ticket-card">
            <img src={Lion} alt="Adult Ticket" className="ticket-image" />
            <h2>Adult Ticket</h2>
            <p className="price">${prices.adult}</p>
            <p className="description">Ages 13-64</p>
            <div className="ticket-counter">
              <button onClick={() => handleDecrement("adult")}>-</button>
              <span>{tickets.adult}</span>
              <button onClick={() => handleIncrement("adult")}>+</button>
            </div>
          </div>

          <div className="ticket-card">
            <img src={Babycougar} alt="Child Ticket" className="ticket-image" />
            <h2>Child Ticket</h2>
            <p className="price">${prices.child}</p>
            <p className="description">Ages 3-12</p>
            <div className="ticket-counter">
              <button onClick={() => handleDecrement("child")}>-</button>
              <span>{tickets.child}</span>
              <button onClick={() => handleIncrement("child")}>+</button>
            </div>
          </div>

          <div className="ticket-card">
            <img src={BabyKoala} alt="Senior Ticket" className="ticket-image" />
            <h2>Senior Ticket</h2>
            <p className="price">${prices.senior}</p>
            <p className="description">Ages 65+</p>
            <div className="ticket-counter">
              <button onClick={() => handleDecrement("senior")}>-</button>
              <span>{tickets.senior}</span>
              <button onClick={() => handleIncrement("senior")}>+</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="member-tickets-section">
          <div className="ticket-card member-card">
            <img
              src={CoupleBirds}
              alt="Member Ticket"
              className="ticket-image"
            />
            <h2>Member Free Admission</h2>
            <p className="price">FREE</p>
            <p className="description">Maximum 4 tickets per month</p>
            <div className="ticket-counter">
              <button onClick={() => handleDecrement("member")}>-</button>
              <span>{tickets.member}</span>
              <button onClick={() => handleIncrement("member")}>+</button>
            </div>
            <div className="member-info">
              <p className="tickets-remaining">
                {4 - memberTicketsThisMonth} free tickets remaining this month
              </p>
              {lastRedemptionDate && (
                <p className="last-redemption">
                  Last redeemed:{" "}
                  {new Date(lastRedemptionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="checkout-section">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="total-amount">
          <h2>Total: ${total.toFixed(2)}</h2>
        </div>

        <button
          className="checkout-button"
          onClick={() => {
            handleCheckout();
          }}
        >
          {isMemberView ? "Redeem Free Tickets" : "Proceed to Checkout"}
        </button>
      </div>

      <div className="ticket-info">
        <h3>Important Information</h3>
        <ul>
          <li>Children under 3 enter free</li>
          <li>Tickets are valid for the selected date only</li>
          <li>No refunds available for purchased tickets</li>
          <li>Present your e-ticket at the entrance</li>
          <li>Tickets are only valid 60 days after purchase date</li>
          {isMemberView && (
            <>
              <li>Member ID required at entrance</li>
              <li>Maximum 4 free tickets per month</li>
              <li>Monthly limit resets on the 1st of each month</li>
            </>
          )}
        </ul>
      </div>
      {showLoginPopup && (
        <>
          <div
            className="overlay"
            onClick={() => setShowLoginPopup(false)}
          ></div>
          <div className="login-popup">
            <h3>Login Required</h3>
            <p>Please log in to proceed with your ticket purchase.</p>
            <div className="popup-buttons">
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="login-button"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tickets;
