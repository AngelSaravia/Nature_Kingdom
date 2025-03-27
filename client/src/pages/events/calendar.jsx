import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale'; // Import the locale directly
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css'; // Import your custom CSS

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

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events from backend...");
        const response = await fetch("${API_BASE_URL}/calendar");
  
        // Log the raw response for debugging
        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);
  
        // Check if the response is valid JSON
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = JSON.parse(rawResponse); // Parse the response as JSON
        console.log("Parsed data:", data);
  
        if (data.success) {
          const formattedEvents = data.events.map((event) => ({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            desc: event.event_desc,
          }));
          setEvents(formattedEvents);
        } else {
          console.error("Failed to fetch events:", data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);
  //new addition ^^

  const handleNavigate = (newDate,/*add*/ view,/*addd*/ action) => {
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