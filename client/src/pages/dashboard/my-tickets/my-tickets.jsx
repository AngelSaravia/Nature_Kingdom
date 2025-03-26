import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './my-tickets.css';

const MyTickets = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tickets] = useState(location.state?.tickets || []);

    return (
        <div className="tickets-container">
            <div className="tickets-card">
                <h1 className="tickets-title">My Tickets</h1>
                {tickets.length > 0 ? (
                    <div className="tickets-list">
                        {tickets.map((ticket, index) => (
                            <div key={index} className="ticket-box">
                                <h2 className="ticket-heading">Ticket #{ticket.id}</h2>
                                <p className="ticket-text">Date: {ticket.date}</p>
                                <p className="ticket-text">Time: {ticket.time}</p>
                                <p className="ticket-text">Status: {ticket.status}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-tickets-text">You have no active tickets.</p>
                )}
                <button onClick={() => navigate('/dashboard')} className="tickets-button">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default MyTickets;
