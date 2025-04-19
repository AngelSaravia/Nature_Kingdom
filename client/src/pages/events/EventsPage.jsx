import React from "react";
import MyCalendar from "./calendar"; // Adjust the path if necessary
import "./calendar.css";
import backgroundImage from "../../zoo_pictures/user-dashbackground.jpg";

const EventsPage = () => {
  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="calendar-page">
        <h1 className="calendar-title">Nature Kingdom Events</h1>
        <MyCalendar />
      </div>
    </div>
  );
};

export default EventsPage;
