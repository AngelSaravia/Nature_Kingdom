import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ZooMap from "../../zoo_pictures/Zoo map.png";
import dining from "../../zoo_pictures/dining.png";
import  restroom from "../../zoo_pictures/image 3.png";
import gift from "../../zoo_pictures/image 4.png";
import "./Exhibits.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Exhibits = () => {
    const [exhibits, setExhibits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedExhibit, setSelectedExhibit] = useState(null);
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
        navigate(`/exhibits/${exhibitId}/enclosures/`);
    };

    if (loading) {
        return <div className="loading">Loading exhibits...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="exhibit-page">
            <div className="exhibit-content">
                <h1 className="page-title">Our Zoo Exhibits</h1>
                <p className="page-description">
                    Explore our fascinating world of animal exhibits
                </p>

                <div className="exhibit-grid">
                    {exhibits.map((exhibit) => (
                        <div 
                            key={exhibit.exhibit_id} 
                            className={`exhibit-card ${selectedExhibit === exhibit.exhibit_id ? 'highlighted' : ''}`}
                            onMouseEnter={() => setSelectedExhibit(exhibit.exhibit_id)}
                            onMouseLeave={() => setSelectedExhibit(null)}
                        >
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

            {/* Map Container */}
            <div className="map-container">
                <h2>Zoo Map</h2>
                <img 
                    src={ZooMap} 
                    alt="Zoo Map" 
                    className="map-image"
                />
                <div className="map-legend">
                    <h3>Legend</h3>
                    <ul>
                        <li><img src={restroom} alt="restroom icon" className="restroom"/>Restrooms</li>
                        <li><img src={gift} alt="giftshop icon" className="gift"/>Shops</li>
                        <li><img src={dining} alt="Restaurant icon" className="restaurant"/>Restaurants</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Exhibits;