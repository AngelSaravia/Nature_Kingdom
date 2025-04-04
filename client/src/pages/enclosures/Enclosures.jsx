// EnclosuresPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EnclosuresPage() {
    const [enclosures, setEnclosures] = useState([]);
    const [selectedEnclosure, setSelectedEnclosure] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/enclosures')
            .then(res => res.json())
            .then(data => {
                setEnclosures(data);
                setLoading(false);
            });
    }, []);

    const handleEnclosureClick = (id) => {
        fetch(`/api/enclosures/${id}`)
            .then(res => res.json())
            .then(data => setSelectedEnclosure(data));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="enclosures-page">
            <h1>Our Animal Enclosures</h1>
            
            {selectedEnclosure ? (
                <div className="enclosure-detail">
                    <button onClick={() => setSelectedEnclosure(null)}>Back to all enclosures</button>
                    <h2>{selectedEnclosure.enclosure.name}</h2>
                    <img src={selectedEnclosure.enclosure.image_url} alt={selectedEnclosure.enclosure.name} />
                    <p>{selectedEnclosure.enclosure.description}</p>
                    
                    <h3>Animals in this enclosure:</h3>
                    <div className="animal-grid">
                        {selectedEnclosure.animals.map(animal => (
                            <div key={animal.animal_id} className="animal-card">
                                <img src={animal.image_url} alt={animal.name} />
                                <h4>{animal.name}</h4>
                                <p>{animal.species}</p>
                                <small>Conservation: {animal.conservation_status}</small>
                            </div>
                        ))}
                    </div>
                    
                    <h3>Feeding Times:</h3>
                    <ul>
                        {selectedEnclosure.schedule.map(item => (
                            <li key={item.schedule_id}>
                                <strong>{item.time}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="enclosure-grid">
                    {enclosures.map(enclosure => (
                        <div 
                            key={enclosure.enclosure_id} 
                            className="enclosure-card"
                            onClick={() => handleEnclosureClick(enclosure.enclosure_id)}
                        >
                            <img src={enclosure.image_url} alt={enclosure.name} />
                            <h3>{enclosure.name}</h3>
                            <p>{enclosure.animal_names ? enclosure.animal_names.split(',').join(', ') : 'No animals listed'}</p>
                            <span className={`status ${enclosure.status}`}>
                                {enclosure.status.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EnclosuresPage;