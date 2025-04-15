import React from "react";
import ZooMap from "../../zoo_pictures/Zoo map! (1).png";
import "./Map.css"
import { useNavigate } from "react-router-dom";

const Map = () => {
    return (
        <div className="zoo-map-container">
                <img 
                    src={ZooMap} 
                    alt="Nature Kingdom Zoo Map" 
                    className="zoo-map"
                />
        </div>
    );
}

export default Map;