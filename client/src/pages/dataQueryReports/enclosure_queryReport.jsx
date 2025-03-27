import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";

const filterOptions = [
  { label: "ENCLOSURE NAME", type: "text", name: "name" },
  { label: "CURRENT CAPACITY", type: "number", name: "current_capacity" },
  { label: "MAXIMUM CAPACITY", type: "number", name: "capacity" },
  { label: "LOCATION", type: "text", name: "location" },
  { label: "OPENING TIME", type: "time", name: "opens_at" },
  { label: "CLOSING TIME", type: "time", name: "closes_at" },
  { label: "STATUS", type: "checkbox", name: "status", options: ["active", "inactive", "under maintenance"] },
  { label: "TEMPERATURE CONTROL", type: "radio", name: "temp_control", options: ["Yes", "No"] },
  { label: "MANAGER ID", type: "number", name: "Manager_id" },
  { label: "EXHIBIT ID", type: "number", name: "exhibit_id" },
];

const columnHeaders = ["name", "current_capacity", "capacity", "location", "opens_at", "closes_at", "status", "temp_control", "Manager_id", "exhibit_id"];

const EnclosureQueryReport = () => {
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

        const queryParams = { entity_type: "enclosures", ...filters };

        Object.keys(queryParams).forEach((key) => {
            if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                queryParams[key] = queryParams[key].join(",");
            }
        });

        const response = await fetch(`http://localhost:5004/query_report/enclosures`, {
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
    <div className="enclosure-query-report">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
      <ReportTable data={reportData} columns={columnHeaders} />
    </div>
  );
};

export default EnclosureQueryReport;