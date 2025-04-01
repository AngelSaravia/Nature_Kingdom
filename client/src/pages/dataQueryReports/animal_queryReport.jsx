import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  { label: "ANIMAL NAME", type: "text", name: "animal_name" },
  { label: "BIRTH DATE", type: "date", name: "date_of_birth" },
  { label: "ENCLOSURE ID", type: "number", name: "enclosure_id" },
  { label: "TYPE", type: "checkbox", name: "animal_type", options: ["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate"] },
  { label: "HEALTH STATUS", type: "checkbox", name: "health_status", options: ["HEALTHY", "NEEDS CARE", "CRITICAL"] },
  { label: "SPECIES", type: "text", name: "species" },
];

const columnHeaders = ["animal_id", "animal_name", "species", "animal_type", "health_status", "date_of_birth", "enclosure_id"];

const AnimalQueryReport = () => {
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

        const queryParams = { entity_type: "animals", ...filters };

        Object.keys(queryParams).forEach((key) => {
            if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                queryParams[key] = queryParams[key].join(",");
            }
        });

        const response = await fetch(`${API_BASE_URL}/query_report/animals`, {
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
    <div className="animal-query-report">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
      <div className="report-table-container">
        <ReportTable data={reportData} columns={columnHeaders} />
        <div className="edit-animal-button-container">
          <Link to="/animal_form" className="edit-animal-button">Edit Animal</Link>
        </div>
      </div>
      </div>
  );
};

export default AnimalQueryReport;