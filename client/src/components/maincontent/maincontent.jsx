import React from "react";
import { Link } from "react-router-dom";
import "./maincontent.css";
import DonationImage from "../../zoo_pictures/baby_cougar.jpg";
import ConservationDay from "../../zoo_pictures/penguins_talk.webp";
import EasterEgg from "../../zoo_pictures/easter_egg_hunting.jpg";
import EarthDay from "../../zoo_pictures/earth_day_zoo.jpeg";

const MainContent = () => {
  const currentMonth = "April 2025";

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

      {/* Events Section */}
      <div className="events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events" className="view-all">
            {">"}All Events
          </Link>
        </div>

        <div className="events-list">
          {/* Event 1 */}
          <div className="event-card">
            <h3>Wildlife Conservation Day</h3>
            <div className="event-details">
              <p className="event-date">
                Date: April 5, 2025{" "}
                <span className="event-time">| Time: 10:00 AM - 4:00 PM</span>
              </p>
              <p>
                Join us for a day focused on wildlife conservation! Learn about
                global efforts to protect endangered species, meet
                conservationists, and discover how you can help.
              </p>
            </div>
            <img
              src={ConservationDay}
              alt="Wildlife conservation event"
              className="event-image"
            />
          </div>

          {/* Event 2 */}
          <div className="event-card">
            <h3>Easter Egg Hunt at the Zoo</h3>
            <div className="event-details">
              <p className="event-date">
                Date: April 12, 2025{" "}
                <span className="event-time">| Time: 9:00 AM - 12:00 PM</span>
              </p>
              <p>
                Hop into the zoo for a fun-filled Easter Egg Hunt! Explore the
                exhibits, find hidden eggs, and enjoy special prizes.
              </p>
            </div>
            <img
              src={EasterEgg}
              alt="Children at Easter egg hunt"
              className="event-image"
            />
          </div>

          {/* Event 3 */}
          <div className="event-card">
            <h3>Earth Day Celebration</h3>
            <div className="event-details">
              <p className="event-date">
                Date: April 22, 2025{" "}
                <span className="event-time">| Time: 10:00 AM - 3:00 PM</span>
              </p>
              <p>
                Celebrate Earth Day with us! Enjoy eco-friendly activities,
                learn about sustainable practices, and discover how our zoo is
                contributing to a greener planet.
              </p>
            </div>
            <img
              src={EarthDay}
              alt="Earth day celebration"
              className="event-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
