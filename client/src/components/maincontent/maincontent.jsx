import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./maincontent.css";
import DonationImage from "../../zoo_pictures/baby_cougar.jpg";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5004";

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const parseDurationToMs = (duration) => {
  if (!duration) return 0;
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return (hours * 3600 + minutes * 60 + (seconds || 0)) * 1000;
};

const MainContent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentMonth = "April 2025";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/calendar`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events");
        }

        if (data.success) {
          const formattedEvents = data.events.map((event) => ({
            id: event.eventID,
            name: event.eventName,
            date: event.eventDate,
            start_time: formatTime(new Date(event.eventDate)),
            end_time: formatTime(
              new Date(
                new Date(event.eventDate).getTime() +
                  (parseDurationToMs(event.duration) || 3600000)
              )
            ),
            description: event.description,
            image_url: event.imageUrl,
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="main-content-container">
      {/* Calendar Section */}
      <div className="calendar-section">
        <div className="section-header">
          <h2>ZOO CALENDAR</h2>
          <Link to="/calendar" className="view-all">
            {">"} VIEW DATES
          </Link>
        </div>

        <div className="calendar">
          <div className="calendar-header">
            <h3>{currentMonth}</h3>
          </div>
          <div className="calendar-days">
            <div className="weekdays">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            {/* Calendar grid would be dynamically generated */}
            <div className="calendar-grid">
              {/* This would typically be generated programmatically */}
              {/* Sample of a few days */}
              <div className="day prev-month">30</div>
              <div className="day">1</div>
              <div className="day">2</div>
              {/* ... other days */}
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="donation-section">
          <img
            src={DonationImage}
            alt="Baby cheetah"
            className="donation-image"
          />
          <div className="donation-text">
            <p>
              Your donation helps us provide world-class care for our animals,
              create immersive exhibits, and support global wildlife
              conservation efforts. Every contribution—big or small—makes a
              lasting impact on the lives of the animals and the future of
              endangered species.
            </p>
            <button className="donate-button">DONATE TODAY</button>
          </div>
        </div>
      </div>

      <section className="upcoming-events">
        <div className="container">
          <div className="section-header">
            <h2>UPCOMING EVENTS</h2>
          </div>
          <div className="events-container">
            {loading ? (
              <div className="loading-spinner">Loading events...</div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.name}</h3>
                  <p className="event-meta">
                    Date:{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    | Time: {event.start_time} - {event.end_time}
                  </p>
                  <p className="event-description">{event.description}</p>
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className="event-image"
                      onError={(e) => {
                        e.target.style.display = "none"; // Hide image if it fails to load
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainContent;
