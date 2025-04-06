import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AnimalsByEnclosure.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AnimalsByEnclosure = () => {
  const { enclosureId } = useParams();
  const [animals, setAnimals] = useState([]);
  const [enclosureDetails, setEnclosureDetails] = useState(null);
  const [exhibitDetails, setExhibitDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enclosureId) {
      setError("No enclosure specified");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch animals data
        const animalsResponse = await fetch(`${API_BASE_URL}/get_animals`);
        if (!animalsResponse.ok) {
          throw new Error('Failed to fetch animals');
        }
        
        const animalsData = await animalsResponse.json();
        
        // Fetch enclosures data
        const enclosuresResponse = await fetch(`${API_BASE_URL}/get_enclosures`);
        if (!enclosuresResponse.ok) {
          throw new Error('Failed to fetch enclosures');
        }
        
        const enclosuresData = await enclosuresResponse.json();
        
        // Fetch exhibits data
        const exhibitsResponse = await fetch(`${API_BASE_URL}/get_exhibits`);
        if (!exhibitsResponse.ok) {
          throw new Error('Failed to fetch exhibits');
        }
        
        const exhibitsData = await exhibitsResponse.json();
        
        if (animalsData.success && enclosuresData.success && exhibitsData.success) {
          // Find current enclosure
          const currentEnclosure = enclosuresData.data.find(
            enc => String(enc.enclosure_id) === String(enclosureId)
          );
          
          setEnclosureDetails(currentEnclosure);
          
          // Find associated exhibit
          if (currentEnclosure) {
            const associatedExhibit = exhibitsData.data.find(
              exhibit => String(exhibit.exhibit_id) === String(currentEnclosure.exhibit_id)
            );
            
            setExhibitDetails(associatedExhibit);
          }
          
          // Filter animals for this enclosure
          const filteredAnimals = animalsData.data.filter(
            animal => String(animal.enclosure_id) === String(enclosureId)
          );
          
          setAnimals(filteredAnimals);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enclosureId]);

  if (loading) {
    return <div className="loading">Loading animals...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (animals.length === 0) {
    return <div className="no-animals">No animals found in this enclosure.</div>;
  }

  return (
    <div className="animals-by-enclosure">
      <div className="enclosure-header">
        <h2>{enclosureDetails ? enclosureDetails.name : `Enclosure ${enclosureId}`}</h2>
        {exhibitDetails && (
          <div className="exhibit-info">
            <span className="exhibit-badge">{exhibitDetails.name}</span>
            <span className="habitat-badge">{exhibitDetails.habitat_type}</span>
          </div>
        )}
      </div>
      
      <div className="animal-grid">
        {animals.map((animal) => (
          <div key={animal.animal_id} className="animal-card">
            <h3>{animal.animal_name}</h3>
            <p>Species: {animal.species}</p>
            <p>Type: {animal.animal_type}</p>
            <p>Date of Birth: {new Date(animal.date_of_birth).toLocaleDateString()}</p>
            <p>Health: 
              <span className={`health-status ${animal.health_status?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                {animal.health_status || 'Unknown'}
              </span>
            </p>
            {animal.description && <p className="description">{animal.description}</p>}
            {exhibitDetails && (
              <div className="card-footer">
                <span className="exhibit-tag">Exhibit: {exhibitDetails.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalsByEnclosure;