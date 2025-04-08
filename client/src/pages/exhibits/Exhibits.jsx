import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Exhibits.css"; // You'll need to create this CSS file

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Exhibits = () => {
    const [exhibits, setExhibits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExhibits = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_exhibits`);
                if (!response.ok) {
                    throw new Error("Failed to fetch exhibits");
                }
                const data = await response.json();
                if (data.success) {
                    setExhibits(data.data);
                } else {
                    throw new Error(data.message || "Failed to load exhibit data");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching exhibits:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExhibits();
    }, []);

    const handleViewEnclosures = (exhibitId) => {
        navigate(`/enclosures/${exhibitId}`);
    };

    if (loading) {
        return <div className="loading">Loading exhibits...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="exhibit-page">
            <h1 className="page-title">Our Zoo Exhibits</h1>
            <p className="page-description">
                Explore our fascinating world of animal exhibits
            </p>

            <div className="exhibit-grid">
                {exhibits.map((exhibit) => (
                    <div key={exhibit.exhibit_id} className="exhibit-card">
                        <div className="card-header">
                            <h2>{exhibit.name}</h2>
                            <span className="habitat-type">
                                {exhibit.habitat_type}
                            </span>
                        </div>
                        
                        <div className="card-content">
                            {exhibit.description && (
                                <p className="description">{exhibit.description}</p>
                            )}
                            
                            {exhibit.opens_at && (
                                <p className="opening">
                                    <strong>Open:</strong> {exhibit.opens_at}
                                </p>
                            )}

                            {exhibit.closes_at && (
                                <p className="closing">
                                    <strong>Closed:</strong> {exhibit.closes_at}
                                </p>
                            )}

                            {exhibit.location && (
                                <p className="location">
                                    <strong>Location</strong> {exhibit.location}
                                </p>
                            )}
                        
                            <button 
                                className="view-enclosures-btn"
                                onClick={() => handleViewEnclosures(exhibit.exhibit_id)}
                            >
                                View Enclosures
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exhibits;