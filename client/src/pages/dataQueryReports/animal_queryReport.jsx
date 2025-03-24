import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";

const filterOptions = [
  { label: "ANIMAL NAME", type: "text", name: "animal_name" },
  { label: "BIRTH DATE", type: "date", name: "birth_date" },
  { label: "ENCLOSURE ID", type: "number", name: "enclosure_id" },
  { label: "TYPE", type: "checkbox", name: "animal_type", options: ["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate"] },
  { label: "HEALTH STATUS", type: "checkbox", name: "health_status", options: ["HEALTHY", "NEEDS CARE", "CRITICAL"] },
  { label: "SPECIES", type: "text", name: "species" },
];

const columnHeaders = ["animal_id", "animal_name", "species", "animal_type", "health_status", "date_of_birth", "enclosure_id"];

const AnimalQueryReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFilters((prevFilters) => {
      if (type === "checkbox") {
        const updatedValues = prevFilters[name] ? [...prevFilters[name]] : [];
        if (checked) {
          updatedValues.push(value);
        } else {
          const index = updatedValues.indexOf(value);
          if (index > -1) updatedValues.splice(index, 1);
        }
        return { ...prevFilters, [name]: updatedValues };
      }
      return { ...prevFilters, [name]: value };
    });
  };

  const fetchReport = async () => {
    try {
      const queryString = new URLSearchParams(
        Object.entries(filters)
          .filter(([_, value]) => value && value.length > 0)
          .reduce((acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value.join(",") : value;
            return acc;
          }, {})
      ).toString();

      const response = await fetch(`http://localhost:5004/query_report/animals?${queryString}`);
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
      <ReportTable data={reportData} columns={columnHeaders} />
    </div>
  );
};

export default AnimalQueryReport;