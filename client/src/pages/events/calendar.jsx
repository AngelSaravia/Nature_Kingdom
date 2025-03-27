import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

const locales = {
  'en-US': enUS,
};

// CORRECTED: Only include what dateFnsLocalizer actually needs
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch events from the backend
  const fetchEvents = async () => {
    try {
      console.log("Fetching events from backend...");
      const response = await fetch("http://localhost:5004/calendar", {
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

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={handleNavigate}
        defaultView="month"
      />
    </div>
  );
};

export default MyCalendar;