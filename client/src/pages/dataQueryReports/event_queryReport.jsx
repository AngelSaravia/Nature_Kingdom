import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  { label: "EVENT NAME", type: "text", name: "eventName" },
  { label: "EVENT DATE", type: "date", name: "eventDate" },
  { label: "DURATION (Min)", type: "time", name: "durationMin" },
  { label: "DURATION (Max)", type: "time", name: "durationMax" },
  { label: "LOCATION", type: "text", name: "location" },
  { label: "TYPE", type: "checkbox", name: "eventType", options: ["Educational", "Entertainment", "Seasonal", "Workshops", "Fundraising", "Animal Interaction", "Corporate"] },
  { label: "CAPACITY", type: "number", name: "capacity" },
  { label: "PRICE (Min)", type: "number", name: "priceMin" },
  { label: "PRICE (Max)", type: "number", name: "priceMax" },
  { label: "MANAGER ID", type: "number", name: "managerID" },
];

const columnHeaders = ["eventName", "description", "eventDate", "duration", "location", "eventType", "capacity", "price", "managerID"];

const EventQueryReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);

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

  const fetchReport = async () => {
    try {
        if (Object.keys(filters).length === 0) {
            console.error("No filters applied. Please select at least one filter.");
            return;
        }

        const queryParams = { entity_type: "events", ...filters };

        Object.keys(queryParams).forEach((key) => {
            if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                queryParams[key] = queryParams[key].join(",");
            }
        });

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

  return (
    <div className="event-query-report">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
      <ReportTable data={reportData} columns={columnHeaders} />
    </div>
  );
};

export default EventQueryReport;