import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './my-tickets.css';

const MyTickets = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { dashboardData } = location.state || {};  
    const [groupedTickets, setGroupedTickets] = useState({});
    const [expiredTickets, setExpiredTickets] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        const tickets = dashboardData?.tickets || [];

        // Split tickets into active and expired
        const activeTickets = [];
        const expiredTickets = [];
        
        tickets.forEach(ticket => {
            if (new Date(ticket.end_date) > new Date()) {
                activeTickets.push(ticket);
            } else {
                expiredTickets.push(ticket);
            }
        });

        // Group active tickets by date
        const groupedActiveTickets = activeTickets.reduce((acc, ticket) => {
            const dateKey = `${ticket.start_date}_${ticket.end_date}`;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    start_date: ticket.start_date,
                    end_date: ticket.end_date,
                    tickets: []
                };
            }
            acc[dateKey].tickets.push(ticket);
            return acc;
        }, {});

        // Group expired tickets by date
        const groupedExpiredTickets = expiredTickets.reduce((acc, ticket) => {
            const dateKey = `${ticket.start_date}_${ticket.end_date}`;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    start_date: ticket.start_date,
                    end_date: ticket.end_date,
                    tickets: []
                };
            }
            acc[dateKey].tickets.push(ticket);
            return acc;
        }, {});

        setGroupedTickets(groupedActiveTickets);
        setExpiredTickets(groupedExpiredTickets);
    }, [dashboardData?.tickets]);

    const toggleGroup = (dateKey) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [dateKey]: !prev[dateKey]
        }));
    };

    // Function to count ticket types
    const countTicketTypes = (tickets) => {
        return tickets.reduce((acc, ticket) => {
            acc[ticket.ticket_type] = (acc[ticket.ticket_type] || 0) + 1;
            return acc;
        }, {});
    };

    return (
        <div className="tickets-container">
            <div className="tickets-card">
                <h1 className="tickets-title">My Tickets</h1>

                {/* Active Tickets Section */}
                <h2 className="section-title">Active Tickets</h2>
                {Object.keys(groupedTickets).length > 0 ? (
                    Object.entries(groupedTickets).map(([dateKey, group], groupIndex) => (
                        <div key={groupIndex} className="purchase-group">
                            <div className="group-header" onClick={() => toggleGroup(dateKey)}>
                                <h2 className="purchase-date">
                                    Valid Until: {new Date(group.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </h2>
                            </div>

                            {expandedGroups[dateKey] && (
                                <div className="tickets-summary">
                                    {Object.entries(countTicketTypes(group.tickets)).map(([ticketType, count], index) => (
                                        <p key={index} className="ticket-summary-text">
                                            {count} {ticketType} Tickets
                                        </p>
                                    ))}
                                    <div className="purchase-summary">
                                        <p>Total Tickets: {group.tickets.length}</p>
                                        <button className="qr-button">Show QR</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-tickets-text">You have no active tickets.</p>
                )}

                {/* Expired Tickets Section */}
                {/* <h2 className="section-title">Previous Tickets</h2> */}
                {Object.keys(expiredTickets).length > 0 ? (
                    Object.entries(expiredTickets).map(([dateKey, group], groupIndex) => (
                        <div key={groupIndex} className="purchase-group">
                            <div className="group-header expired-header" onClick={() => toggleGroup(dateKey)}>
                                <h2 className="purchase-date">
                                    Expired on: {new Date(group.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </h2>
                            </div>

                            {expandedGroups[dateKey] && (
                                <div className="tickets-summary">
                                    {Object.entries(countTicketTypes(group.tickets)).map(([ticketType, count], index) => (
                                        <p key={index} className="ticket-summary-text">
                                            {count} {ticketType} Tickets
                                        </p>
                                    ))}
                                    <div className="purchase-summary">
                                        <p>Total Tickets: {group.tickets.length}</p>
                                        <button className="qr-button">Show QR</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-tickets-text">You have no expired tickets.</p>
                )}

                <button onClick={() => navigate('/dashboard')} className="tickets-button">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default MyTickets;
