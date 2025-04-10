import React, { useState, useEffect } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  { label: "EVENT NAME", type: "text", name: "eventName" },
  { label: "EVENT DATE", type: "date", name: "eventDate" },
  { label: "MIN DURATION (HH:MM)", type: "text", name: "durationMin" },
  { label: "MAX DURATION (HH:MM)", type: "text", name: "durationMax" },
  { label: "LOCATION", type: "text", name: "location" },
  { label: "TYPE", type: "checkbox", name: "eventType", options: ["Educational", "Entertainment", "Seasonal", "Workshops", "Fundraising", "Animal Interaction", "Corporate"] },
  { label: "CAPACITY", type: "number", name: "capacity" },
  { label: "PRICE (Min)", type: "number", name: "priceMin" },
  { label: "PRICE (Max)", type: "number", name: "priceMax" },
  { label: "MANAGER EMAIL", type: "text", name: "manager_email" },
];

const columnHeaders = ["eventName", "description", "eventDate", "duration", "location", "eventType", "capacity", "price", "manager_email"];

const EventQueryReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchReport(false);
  }, []);

  const handleFilterChange = (eventOrUpdater) => {
    if (typeof eventOrUpdater === "function") {
      setFilters((prevFilters) => eventOrUpdater(prevFilters));
    } else {
      const { name, value, type, checked } = eventOrUpdater.target;
    
      setFilters((prevFilters) => {
        if (type === "checkbox") {
          const updatedValues = prevFilters[name] ? [...prevFilters[name]] : [];
          if (checked) {
            if (!updatedValues.includes(value)) updatedValues.push(value);
          } else {
            const index = updatedValues.indexOf(value);
            if (index > -1) updatedValues.splice(index, 1);
          }
          return { ...prevFilters, [name]: updatedValues };
        }
        return { ...prevFilters, [name]: value };
      });
    }
  };

  const fetchReport = async (applyFilters = true) => {
    try {
        // Validate HH:MM format for durationMin and durationMax
      if (filters.durationMin && !/^([0-9]|[0-9][0-9]):[0-5][0-9]$/.test(filters.durationMin)) {
        console.error("Invalid durationMin format. Please use HH:MM.");
        return;
      }
      if (filters.durationMax && !/^([0-9]|[0-9][0-9]):[0-5][0-9]$/.test(filters.durationMax)) {
        console.error("Invalid durationMax format. Please use HH:MM.");
        return;
      }

        // Create prefixed filters
        const prefixedFilters = {};
        if (applyFilters && Object.keys(filters).length > 0) {
          Object.keys(filters).forEach((key) => {
              if (['eventName', 'eventDate', 'duration', 'location', 
                  'eventType', 'capacity', 'price'].includes(key)) {
                  prefixedFilters[`events.${key}`] = filters[key];
              } else if (key.endsWith('Min') || key.endsWith('Max')) {
                  // Handle range filters
                  const baseKey = key.replace('Min', '').replace('Max', '');
                  prefixedFilters[`events.${key}`] = filters[key];
              } else if (key === "manager_email") {
                prefixedFilters["manager.email"] = filters[key];
              } else {
                  prefixedFilters[key] = filters[key];
              }
          });
        }
        const queryParams = {
          table1: "events",
          table2: "employees AS manager",
          join_condition: "events.managerID = manager.Employee_id",
          computed_fields: `
              events.*, 
              manager.email AS manager_email
          `,
          ...prefixedFilters,
        };

        const response = await fetch(`${API_BASE_URL}/query_report/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(queryParams),
        });

        const data = await response.json();

        if (data.success) {
            setReportData(data.data);
        } else {
            console.error("Error fetching report:", data.message);
        }
    } catch (error) {
        console.error("Error fetching report:", error);
    }
  };

  const onClearAll = () => {
    setFilters({});
    fetchReport(false);
  };
  return (
    <div className="event-query-report">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
      <div className="report-table-container">
        <ReportTable data={reportData} columns={columnHeaders} />
        <div className="edit-event-button-container">
          <a href="/event_form" target="_blank" rel="noopener noreferrer" className="edit-event-button">Edit Event</a>
        </div>
      </div>
      </div>
  );
};

export default EventQueryReport;