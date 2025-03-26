import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkMembershipStatus } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [membership, setMembership] = useState(null);

    useEffect(() => {
        // Fetch tickets and membership info
        fetch("/api/tickets").then(res => res.json()).then(setTickets);
        fetch("/api/membership").then(res => res.json()).then(setMembership);
    }, []);

    return (
        <div className="dashboard-container">
        <div className="dashboard-card">
            <h1 className="dashboard-title">Your Dashboard</h1>
            
            {/* Quick Summary */}
            <div className="dashboard-box single">
            <h2 className="dashboard-heading">Your Account</h2>
            <p className="dashboard-text">Display User info here</p>
            </div>
            <div className="dashboard-grid">
            <div className="dashboard-box">
                <h2 className="dashboard-heading">My Tickets</h2>
                <p className="dashboard-text">{tickets.length} active ticket(s)</p>
                <button onClick={() => navigate("/my-tickets", { state: { tickets } })} 
                        className="dashboard-button">View Tickets</button>
            </div>
            <div className="dashboard-box">
                <h2 className="dashboard-heading">My Membership</h2>
                <p className="dashboard-text">{membership ? membership.type : "No active membership"}</p>
                <button onClick={() => navigate("/my-membership", { state: { membership } })} 
                        className="dashboard-button">View Membership</button>
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