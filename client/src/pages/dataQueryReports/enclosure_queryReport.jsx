import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  { label: "ENCLOSURE NAME", type: "text", name: "name" },
  { label: "CURRENT CAPACITY", type: "number", name: "current_capacity" },
  { label: "MAXIMUM CAPACITY", type: "number", name: "capacity" },
  { label: "OPENING TIME", type: "time", name: "opens_at" },
  { label: "CLOSING TIME", type: "time", name: "closes_at" },
  { label: "STATUS", type: "checkbox", name: "status", options: ["active", "inactive", "under maintenance"] },
  { label: "LOCATION", type: "text", name: "location" },
  { label: "TEMPERATURE CONTROL", type: "radio", name: "temp_control", options: ["Yes", "No"] },
  { label: "MANAGER NAME", type: "text", name: "manager_name" },
  { label: "EXHIBIT NAME", type: "checkbox", name: "exhibit_name", options: ['Feather Fiesta','Creepy Crawlies','Tundra Treasures','Sunlit Savanna','Rainforest Rumble','Willowing Wetlands','Desert Mirage','Underwater Utopia'] },
];

const columnHeaders = ["name", "current_capacity", "capacity", "location", "opens_at", "closes_at", "status", "temp_control", "manager_name", "exhibit_name"];

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

        const queryParams = {
          table1: "enclosures",
          table2: "employees",
          join_condition: "enclosures.Manager_id = employees.employee_id",
          additional_joins: [{table: "exhibits", join_condition: "enclosures.exhibit_id = exhibits.exhibit_id"}],
          computed_fields: `
            enclosures.*, 
            CONCAT(employees.first_name, ' ', employees.last_name) AS manager_name,
            exhibits.name AS exhibit_name
          `,
          ...filters,
        };

        Object.keys(queryParams).forEach((key) => {
            if (key !== "additional_joins" && Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                queryParams[key] = queryParams[key].join(",");
            }
        });

        const response = await fetch(`${API_BASE_URL}/query_report/enclosures`, {
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
      <div className="report-table-container">
        <ReportTable data={reportData} columns={columnHeaders} />
        <div className="edit-enclosure-button-container">
          <Link to="/enclosure_form" className="edit-enclosure-button">Edit Enclosure</Link>
        </div>
      </div>
      </div>
  );
};

export default EnclosureQueryReport;