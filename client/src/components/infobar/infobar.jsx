import React from "react";
import "./infobar.css";
import { FaTicketAlt, FaMapMarkerAlt, FaMap, FaIdCard } from "react-icons/fa";

const InfoBar = () => {
  return (
    <div className="info-bar">
      <div className="hours-info">
        <p>
          <span className="primary-text">TODAY'S HOURS 9AM-5PM</span>
          <span className="secondary-text">(LAST ENTRY 4PM)</span>
        </p>
      </div>

      <a href="/tickets" className="info-link">
        <span>Buy Tickets</span>
        <FaTicketAlt className="icon" />
      </a>

      <a href="/calendar" className="info-link">
        <span>EVENTS</span>
        <FaMapMarkerAlt className="icon" />
      </a>

      <a href="/exhibits" className="info-link">
        <span>ZOO MAP</span>
        <FaMap className="icon" />
      </a>

      <a href="/membership" className="info-link">
        <span>MEMBERSHIP</span>
        <FaIdCard className="icon" />
      </a>
    </div>
  );
};

export default InfoBar;
