import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
// Fix JSX transform warning by upgrading package or configuring bundler
// See: https://react.dev/link/new-jsx-transform

const API_BASE_URL = import.meta.env.VITE_API_URL;

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Event Component
const CustomEvent = ({ event, showTooltip = true }) => {
  const tooltipRef = useRef(null);
  const [showingTooltip, setShowingTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Calculate event duration
  const durationMs = event.end - event.start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationString = `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`;

  const handleMouseMove = (e) => {
    if (!showTooltip) return;

    // Calculate position with boundaries to keep tooltip on screen
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 150;

    const x = Math.min(e.clientX, window.innerWidth - tooltipWidth - 20);
    const y = Math.min(e.clientY, window.innerHeight - tooltipHeight - 20);

    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (showTooltip) {
      setShowingTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowingTooltip(false);
  };

  return (
    <div
      className="custom-event"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="event-title">{event.title}</div>
      {showTooltip && showingTooltip && (
        <div
          ref={tooltipRef}
          className="event-tooltip"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div>
            <strong>Title: </strong>
            {event.title}
          </div>
          <div>
            <strong>Description:</strong>{" "}
            {event.description || "No description"}
          </div>
          <div>
            <strong>Location:</strong> {event.location || "No location"}
          </div>
          <div>
            <strong>Duration:</strong> {durationString}
          </div>
          <div>
            <strong>Price:</strong> {event.price ? `$${event.price}` : "Free"}
          </div>
          <div>
            <strong>Type:</strong> {event.type || "General"}
          </div>
        </div>
      )}
    </div>
  );
};

const MyCalendar = ({ showTooltip = true, showOnlyCurrentMonth = false }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Improved duration parser with better error handling
  const parseDurationToMs = useCallback((duration) => {
    if (!duration) return 3600000; // Default to 1 hour

    try {
      // Handle different possible formats
      if (typeof duration === "number") {
        return duration * 1000; // Assuming duration is in seconds
      }

      if (duration.includes(":")) {
        const parts = duration.split(":").map(Number);
        // Handle HH:MM:SS or MM:SS format
        if (parts.length === 3) {
          return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
        } else if (parts.length === 2) {
          return (parts[0] * 60 + parts[1]) * 1000;
        }
      }

      // Try parsing as a number of hours
      const numValue = parseFloat(duration);
      if (!isNaN(numValue)) {
        return numValue * 3600000;
      }

      console.warn(`Couldn't parse duration: ${duration}, using default`);
      return 3600000; // Default to 1 hour
    } catch (err) {
      console.error("Error parsing duration:", err);
      return 3600000; // Default to 1 hour
    }
  }, []);

  // Fetch events memoized with useCallback
  const fetchEvents = useCallback(async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching events from backend...");
      const response = await fetch(`${API_BASE_URL}/calendar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format events for react-big-calendar
        const formattedEvents = data.events.map((event) => ({
          id: event.eventID,
          title: event.eventName,
          start: new Date(event.eventDate),
          end: new Date(
            new Date(event.eventDate).getTime() +
              parseDurationToMs(event.duration)
          ),
          description: event.description,
          location: event.location,
          type: event.eventType || "default",
          capacity: event.capacity,
          price: event.price,
          managerID: event.managerID,
        }));
        setEvents(formattedEvents);
      } else {
        throw new Error(data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, parseDurationToMs]);

  useEffect(() => {
    fetchEvents();

    const handleNewEvent = () => {
      fetchEvents();
    };

    window.addEventListener("newEventAdded", handleNewEvent);

    return () => {
      window.removeEventListener("newEventAdded", handleNewEvent);
    };
  }, [fetchEvents]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Customize event appearance
  const eventPropGetter = (event) => {
    return {
      className: `rbc-event-${(event.type || "default").toLowerCase()}`,
    };
  };

  const filteredEvents = showOnlyCurrentMonth
    ? events.filter((event) => {
        const eventMonth = event.start.getMonth();
        const eventYear = event.start.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        return eventMonth === currentMonth && eventYear === currentYear;
      })
    : events;

  if (error) {
    return <div className="calendar-error">{error}</div>;
  }

  return (
    <div className="calendar-container">
      {loading && <div className="calendar-loading">Loading events...</div>}

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={handleNavigate}
        defaultView="month"
        components={{
          event: (props) => (
            <CustomEvent {...props} showTooltip={showTooltip} />
          ),
        }}
        eventPropGetter={eventPropGetter}
        toolbar={!showOnlyCurrentMonth}
      />
    </div>
  );
};

export default MyCalendar;
