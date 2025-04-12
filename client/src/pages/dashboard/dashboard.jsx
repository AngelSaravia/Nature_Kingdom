import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkMembershipStatus, getDashboardData } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        user: [],
        tickets: [],
        activeTicketsCount: 0,
        membership: [],
        orders: [],
      });
    
    useEffect(() => {
        const fetchDashboardData = async () => {
          try {
            const data = await getDashboardData();
            setDashboardData({
              tickets: data.tickets.tickets || [],
              activeTicketsCount: data.tickets.activeCount || 0,
              membership: data.membership || [],
              user: data.visitor || [],
              orders: data.giftShopPurchases.data.purchases || []
            });
          } catch (error) {
            console.error('Error:', error);
          }
        };
      
        fetchDashboardData();
      }, []);
      
      
      console.log("user",dashboardData.user)
      console.log("member", dashboardData.tickets)
      console.log("orders ", dashboardData.orders)
      
      const capitalizeFirstLetter = (str) => {
        if (!str) return str; // Handle empty string or null
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match the phone number
      
        if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
      
        return null; // Return null if the phone number is invalid
      };
    
    return (
        <div className="dashboard-container">
        <div className="dashboard-card">
            <h1 className="dashboard-title">Your Dashboard</h1>
            
            {/* Quick Summary */}
            <div className="dashboard-box single">
            <h2 className="dashboard-heading">Your Account</h2>
            <p className="dashboard-text">Username: {dashboardData.user.username}</p>
            <p className="dashboard-text">Full Name: {capitalizeFirstLetter(dashboardData.user.first_name)} {capitalizeFirstLetter(dashboardData.user.Minit_name)} {capitalizeFirstLetter(dashboardData.user.last_name)}</p>
            <p className="dashboard-text">Email: {dashboardData.user.email}</p>
            <p className="dashboard-text">Phone: {formatPhoneNumber(dashboardData.user.phone_number)}</p>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-box">
                  <h2 className="dashboard-heading">My Tickets</h2>
                  <p className="dashboard-text">{dashboardData.activeTicketsCount} active ticket(s)</p>
                  <button onClick={() => navigate("/my-tickets", { state: { dashboardData } })} 
                          className="dashboard-button">View Tickets</button>
              </div>
              <div className="dashboard-box">
                  <h2 className="dashboard-heading">My Membership</h2>
                  <p className="dashboard-text">{dashboardData.membership.length ? "Active membership" : "No active membership"}</p>
                  <button onClick={() => navigate("/my-membership", { state: { dashboardData } })} 
                          className="dashboard-button">View Membership</button>
              </div>
              <div className="dashboard-box">
                  <h2 className="dashboard-heading">Giftshop Purchases</h2>
                  {/* <p className="dashboard-text">{dashboardData.membership.length ? "Active membership" : "No active membership"}</p> */}
                  <button onClick={() => navigate("/giftshop-purchases", { state: { dashboardData } })} 
                          className="dashboard-button">View Purchases</button>
              </div>
              <div className="dashboard-box">
                <h2 className="dashboard-heading">Exhibits and Animals</h2>
                <button className="dashboard-button" onClick={() => navigate("/exhibits")}>View Exhibits and Animals</button>
              </div>
            </div>
            
            {/* Additional Features */}

            

            <div className="dashboard-box single">
            <h2 className="dashboard-heading">Upcoming Events</h2>
            <p className="dashboard-text">Stay updated on zoo events and activities.</p>
            </div>
            
            <div className="dashboard-box single">
            <h2 className="dashboard-heading">Animal Spotlights</h2>
            <p className="dashboard-text">Discover featured animals and fun facts.</p>
            </div>
        </div>
        </div>
    );
};

export default Dashboard