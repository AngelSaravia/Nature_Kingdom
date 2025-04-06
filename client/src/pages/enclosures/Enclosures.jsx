import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Enclosures.css"; // Regular CSS import
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Enclosure = () => {
    const [enclosures, setEnclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnclosures = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_enclosures`);
                if (!response.ok) {
                    throw new Error("Failed to fetch enclosures");
                }
                const data = await response.json();
                if (data.success) {
                    setEnclosures(data.data);
                } else {
                    throw new Error(data.message || "Failed to load enclosure data");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching enclosures:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnclosures();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "active":
                return "active";
            case "inactive":
                return "inactive";
            case "under_maintenance":
                return "maintenance";
            default:
                return "";
        }
    };

    const handleViewAnimals = (enclosureId) => {
        navigate(`/animals/${enclosureId}`)
    };

    if (loading) {
        return <div className="loading">Loading enclosures...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="enclosure-page">
            <h1 className="page-title">Our Animal Enclosures</h1>
            <p className="page-description">
                Explore the diverse habitats we've created for our animals
            </p>

            <div className="enclosure-grid">
                {enclosures.map((enclosure) => (
                    <div key={enclosure.enclosure_id} className="enclosure-card">
                        <div className="card-header">
                            <h2>{enclosure.name}</h2>
                            <span className={`status ${getStatusClass(enclosure.status)}`}>
                                {enclosure.status.replace('_', ' ')}
                            </span>
                        </div>
                        
                        <div className="card-content">
                            <p className="location">
                                <strong>Location:</strong> {enclosure.location || "Not specified"}
                            </p>
                            
                            <div className="capacity">
                                <span>Capacity: {enclosure.current_capacity}/{enclosure.capacity}</span>
                                <div className="capacity-bar">
                                    <div 
                                        className="capacity-fill"
                                        style={{ width: `${(enclosure.current_capacity / enclosure.capacity) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            {enclosure.opens_at && enclosure.closes_at && (
                                <p className="hours">
                                    <strong>Hours:</strong> {enclosure.opens_at} - {enclosure.closes_at}
                                </p>
                            )}
                            
                            <p className="temp-control">
                                <strong>Temperature Controlled:</strong> 
                                {enclosure.temp_control ? " Yes" : " No"}
                            </p>
                            <button 
                                className="view-animals-btn"
                                onClick={() => handleViewAnimals(enclosure.enclosure_id)}
                            >
                                View Animals
                            </button>
    
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Enclosure;