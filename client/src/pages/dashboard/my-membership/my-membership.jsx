import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './my-membership.css';

const MyMembership = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [membership] = useState(location.state?.membership || null);

    return (
        <div className="membership-container">
            <div className="membership-card">
                <h1 className="membership-title">My Membership</h1>
                {membership ? (
                    <div className="membership-details">
                        <h2 className="membership-heading">{membership.type} Membership</h2>
                        <p className="membership-text">Status: {membership.status}</p>
                        <p className="membership-text">Expiration Date: {membership.expirationDate}</p>
                        <p className="membership-text">Benefits: {membership.benefits}</p>
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
