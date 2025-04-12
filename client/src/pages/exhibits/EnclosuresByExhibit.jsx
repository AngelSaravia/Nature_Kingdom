import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EnclosuresByExhibit.css"; // You'll need to create this CSS file

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EnclosuresByExhibit = () => {
    const { exhibitId } = useParams();
    const [enclosures, setEnclosures] = useState([]);
    const [exhibitDetails, setExhibitDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!exhibitId) {
            setError("No exhibit specified");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch enclosures data
                const enclosuresResponse = await fetch(`${API_BASE_URL}/get_enclosures`);
                if (!enclosuresResponse.ok) {
                    throw new Error("Failed to fetch enclosures");
                }
                const enclosuresData = await enclosuresResponse.json();
                
                // Fetch exhibit details
                const exhibitsResponse = await fetch(`${API_BASE_URL}/get_exhibits`);
                if (!exhibitsResponse.ok) {
                    throw new Error("Failed to fetch exhibits");
                }
                const exhibitsData = await exhibitsResponse.json();
                
                if (enclosuresData.success && exhibitsData.success) {
                    // Find current exhibit
                    const currentExhibit = exhibitsData.data.find(
                        exhibit => String(exhibit.exhibit_id) === String(exhibitId)
                    );
                    
                    setExhibitDetails(currentExhibit);
                    
                    // Filter enclosures for this exhibit
                    const filteredEnclosures = enclosuresData.data.filter(
                        enclosure => String(enclosure.exhibit_id) === String(exhibitId)
                    );
                    
                    setEnclosures(filteredEnclosures);
                } else {
                    throw new Error("Error fetching data");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [exhibitId]);

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
        navigate(`/exhibits/${exhibitId}/enclosures/${enclosureId}/animals/`);
    };

    if (loading) {
        return <div className="loading">Loading enclosures...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (enclosures.length === 0) {
        return <div className="no-enclosures">No enclosures found in this exhibit.</div>;
    }

    return (
        <div className="enclosures-by-exhibit">
            <div className="exhibit-header">
                <h1>{exhibitDetails ? exhibitDetails.name : `Exhibit ${exhibitId}`}</h1>
                {exhibitDetails && (
                    <div className="exhibit-details">
                        <span className="habitat-badge">{exhibitDetails.habitat_type}</span>
                        {exhibitDetails.description && (
                            <p className="exhibit-description">{exhibitDetails.description}</p>
                        )}
                    </div>
                )}
            </div>

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

export default EnclosuresByExhibit;