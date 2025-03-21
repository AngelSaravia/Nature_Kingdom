import React, { useState } from 'react';
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
  const [events, setEvents] = useState([
    {
      title: 'Event 1',
      start: new Date(2023, 10, 1),
      end: new Date(2023, 10, 2),
    },
    {
      title: 'Event 2',
      start: new Date(2023, 10, 3),
      end: new Date(2023, 10, 4),
    },
    // Add more events here
  ]);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default MyCalendar;