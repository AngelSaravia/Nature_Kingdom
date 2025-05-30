import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AnimalQueryReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [enclosureOptions, setEnclosureOptions] = useState([]); // State to store enclosure names
  const navigate = useNavigate();

  // Fetch enclosure names from the backend
  useEffect(() => {
    fetchReport(false);
    const fetchEnclosureNames = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_enclosure_names`);
        const data = await response.json();
        if (data.success) {
          setEnclosureOptions(data.data); // Set the enclosure names
        } else {
          console.error("Error fetching enclosure names:", data.message);
        }
      } catch (error) {
        console.error("Error fetching enclosure names:", error);
      }
    };

    fetchEnclosureNames();
  }, []);

  const filterOptions = [
    { label: "ANIMAL NAME", type: "text", name: "animal_name" },
    {
      label: "ENCLOSURE NAME",
      type: "checkbox",
      name: "enclosures.name",
      options: enclosureOptions,
    }, // This will be populated with enclosure names
    { label: "BEGINNING BIRTH DATE", type: "date", name: "date_of_birthMin" },
    { label: "ENDING BIRTH DATE", type: "date", name: "date_of_birthMax" },
    {
      label: "ANIMAL TYPE",
      type: "checkbox",
      name: "animal_type",
      options: [
        "Mammal",
        "Bird",
        "Reptile",
        "Amphibian",
        "Fish",
        "Invertebrate",
      ],
    },
    { label: "SPECIES", type: "text", name: "species" },
    {
      label: "HEALTH STATUS",
      type: "checkbox",
      name: "health_status",
      options: ["HEALTHY", "NEEDS CARE", "CRITICAL"],
    },
  ];

  const columnHeaders = {
    animal_name: "Animal Name",
    species: "Species",
    animal_type: "Animal Type",
    health_status: "Health Status",
    date_of_birth: "Date of Birth",
    enclosure_name: "Enclosure Name",
  };

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
      const prefixedFilters = {};
      if (applyFilters && Object.keys(filters).length > 0) {
        Object.keys(filters).forEach((key) => {
          // Skip empty array values or empty strings
          if (Array.isArray(filters[key]) && filters[key].length === 0) {
            return;
          }
          // Handle different filter types
          switch (key) {
            case "enclosures.name":
              prefixedFilters["enclosures.name"] = filters[key];
              break;
            case "date_of_birthMin":
            case "date_of_birthMax":
              prefixedFilters[`animals.${key}`] = filters[key];
              break;
            case "animal_type":
            case "health_status":
            case "animal_name":
            case "species":
              prefixedFilters[`animals.${key}`] = filters[key];
              break;
            default:
              prefixedFilters[key] = filters[key];
          }
        });
      }

      const queryParams = {
        table1: "animals",
        table2: "enclosures",
        join_condition: "animals.enclosure_id = enclosures.enclosure_id",
        computed_fields: "animals.*, enclosures.name as 'enclosure_name'",
        entity_type: "animals",
        ...prefixedFilters,
      };

      const response = await fetch(`${API_BASE_URL}/entryForm/animals`, {
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

  const renderEditButton = (tuple) => {
    return (
      <button
        onClick={() => {
          // Store in sessionStorage as fallback
          sessionStorage.setItem("animalEditData", JSON.stringify(tuple));
          navigate("/animal_form", { state: { tuple } });
        }}
        className="edit-tuple-button"
      >
        Edit
      </button>
    );
  };
  return (
    <div className="animal-query-report">
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onRunReport={fetchReport}
        onClearAll={onClearAll}
        filterOptions={filterOptions}
      />
      <div className="report-table-container">
        <ReportTable
          data={reportData}
          columns={Object.keys(columnHeaders)}
          renderActions={(tuple) => renderEditButton(tuple)}
          columnLabels={columnHeaders}
        />
        <div className="edit-animal-button-container">
          <a href="/animal_form" className="edit-animal-button">
            Add Animal
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnimalQueryReport;
