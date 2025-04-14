import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { FiTrendingUp } from 'react-icons/fi';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const locales = {
  'en-US': enUS,
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
  const durationMs = event.end - event.start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationString = `${hours}h ${minutes}m`;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="custom-event"
      onMouseMove={handleMouseMove}
    >
      <div className="event-title">{event.title}</div>
      {showTooltip && (
      <div 
        className="event-tooltip" 
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <div><strong>Title: </strong>{event.title}</div>
        <div><strong>Description:</strong> {event.description}</div>
        <div><strong>Location:</strong> {event.location}</div>
        <div><strong>Duration:</strong> {durationString}</div>

        <div><strong>Price:</strong> ${event.price || 'Free'}</div>
        <div><strong>Type:</strong> {event.type}</div>
      </div>
      )}
    </div>
  );
};

//showOnlyCurrentMonth = false if doesnt work
const MyCalendar = ({ showTooltip = true, showOnlyCurrentMonth = false }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch events from the backend
  const fetchEvents = async () => {
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
      console.log("Parsed data:", data);

      if (data.success) {
        // CORRECTED: Format events for react-big-calendar
        const formattedEvents = data.events.map((event) => ({
          id: event.eventID,
          title: event.eventName, // react-big-calendar expects 'title'
          start: new Date(event.eventDate), // must be Date object
          end: new Date(new Date(event.eventDate).getTime() + 
               (parseDurationToMs(event.duration) || 3600000)), // default 1 hour
          description: event.description,
          location: event.location,
          type: event.eventType,
          capacity: event.capacity,
          price: event.price,
          managerID: event.managerID,
        }));
        setEvents(formattedEvents);
      } else {
        console.error("Failed to fetch events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Helper function to convert duration string to milliseconds
  const parseDurationToMs = (duration) => {
    if (!duration) return 0;
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + (seconds || 0)) * 1000;
  };

  useEffect(() => {
    fetchEvents();

    const handleNewEvent = () => {
      fetchEvents();
    };

    window.addEventListener('newEventAdded', handleNewEvent);

    return () => {
      window.removeEventListener('newEventAdded', handleNewEvent);
    };
  }, [refreshTrigger]);

  const handleNavigate = (newDate, view, action) => {
    setCurrentDate(newDate);
  };

  // Customize event appearance
  const eventPropGetter = (event) => {
    return {
      className: `rbc-event-${event.type.toLowerCase()}`,
    };
  };

  const filteredEvents = showOnlyCurrentMonth 
    ? events.filter(event => {
        const eventMonth = event.start.getMonth();
        const eventYear = event.start.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        return eventMonth === currentMonth && eventYear === currentYear;
      })
    : events;

  return (
    <div className='calendar-container'>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={handleNavigate}
        defaultView="month"
        components={{
          event: (props) => <CustomEvent {...props} showTooltip={showTooltip} />,
        }}
        eventPropGetter={eventPropGetter}
        toolbar={!showOnlyCurrentMonth}
      />
    </div>
  );
};

export default MyCalendar;