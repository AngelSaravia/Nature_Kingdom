import React from 'react';
import MyCalendar from './calendar'; // Adjust the path if necessary
import './calendar.css';

const EventsPage = () => {
  return (
    <div>
      <h1>Nature Kingdom Events</h1>
      <MyCalendar />
    </div>
  );
};

export default EventsPage;