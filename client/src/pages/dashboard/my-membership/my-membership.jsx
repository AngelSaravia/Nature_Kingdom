import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './my-membership.css';

const MyMembership = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { dashboardData } = location.state || {};  

    const countMemberTicketsForCurrentMonth = (tickets) => {
        // Get current date information
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();  // 0 = January, 11 = December
        const currentYear = currentDate.getFullYear();
      
        // Filter tickets to find those of type 'member' and within the current month/year
        const memberTicketsThisMonth = tickets.filter(ticket => {
          const ticketDate = new Date(ticket.start_date);  // Assuming ticket has a 'date' field
          return (
            ticket.ticket_type === 'member' && 
            ticketDate.getFullYear() === currentYear &&
            ticketDate.getMonth() === currentMonth
          );
        });
      
        return memberTicketsThisMonth.length;  // Return the count of tickets
      };

    const mostCurrentMembership = dashboardData.membership.length 
        ? dashboardData.membership.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0] 
        : null
    console.log(dashboardData.membership)
    console.log(dashboardData.membership.length)
    return (
        <div className="membership-container">
            <div className="membership-card">
                <h1 className="membership-title">My Membership</h1>
                {mostCurrentMembership ? (
                    <div className="membership-details">
                        <h2 className="membership-heading"> Active Membership</h2>
                        <p className="membership-text">Membership ID: {mostCurrentMembership.membership_id}</p>
                        <p className="membership-text">Purchase Date: {new Date(mostCurrentMembership.start_date).toLocaleDateString()}</p>
                        <p className="membership-text">Expiration Date: {new Date(mostCurrentMembership.end_date).toLocaleDateString()}</p>
                        <p className="membership-text">Monthly Membership Tickets Used: {countMemberTicketsForCurrentMonth(dashboardData.tickets)}/4</p> 

                    </div>
                ) : (
                    <p className="no-membership-text">You do not have an active membership.</p>
                )}
                <button onClick={() => navigate('/dashboard')} className="membership-button">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default MyMembership;
