import React, { useState, useEffect } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
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
  const navigate = useNavigate();

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
        // Add a helper function to convert time to military format
        const convertToMilitaryTime = (time) => {
          const [hours, minutes] = time.split(':');
          const period = time.toLowerCase().includes('pm') ? 'PM' : 'AM';
          let militaryHours = parseInt(hours, 10);
          if (period === 'PM' && militaryHours < 12) militaryHours += 12;
          if (period === 'AM' && militaryHours === 12) militaryHours = 0;
          return `${String(militaryHours).padStart(2, '0')}:${minutes}:00`;
        };

        // Create prefixed filters object
        const prefixedFilters = {};
        if (applyFilters && Object.keys(filters).length > 0) {
          Object.keys(filters).forEach((key) => {
              if (key === 'manager_name') {
                  // Handle manager name search using CONCAT in WHERE clause
                  prefixedFilters['CONCAT(employees.first_name, " ", employees.last_name)'] = filters[key];
              } else if (key === 'exhibit_name') {
                // Handle exhibit name search using the actual column name
                if (Array.isArray(filters[key]) && filters[key].length > 0) {
                  prefixedFilters['exhibits.name'] = filters[key];
                }
              } else if (key === 'opens_at' || key === 'closes_at') {
                prefixedFilters[`enclosures.${key}`] = convertToMilitaryTime(filters[key]);
              } else if (['status', 'temp_control'].includes(key)) {
                  prefixedFilters[`enclosures.${key}`] = filters[key];
              } else {
                  prefixedFilters[`enclosures.${key}`] = filters[key];
              }
          });
        }

        const queryParams = {
          table1: "enclosures",
          table2: "employees",
          join_condition: "enclosures.Manager_id = employees.employee_id",
          additional_joins: [{table: "exhibits", join_condition: "enclosures.exhibit_id = exhibits.exhibit_id"}],
          computed_fields: `
            enclosures.*, 
            CONCAT(employees.first_name, ' ', employees.last_name) AS manager_name,
            exhibits.name AS exhibit_name,
            CASE enclosures.temp_control WHEN 1 THEN 'Yes' WHEN 0 THEN 'No' END AS temp_control
          `,
          ...prefixedFilters,
        };

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

  const onClearAll = () => {
    setFilters({});
    fetchReport(false);
  };

  const renderEditButton = (tuple) => {
    return (
      <button 
        onClick={() => {
          // Store in sessionStorage as fallback
          sessionStorage.setItem('enclosureEditData', JSON.stringify(tuple));
          navigate('/enclosure_form', { state: { tuple } });
        }}
        className="edit-tuple-button"
      >
        Edit Tuple
      </button>
    );
  };
  return (
    <div className="enclosure-query-report">
      <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
      <div className="report-table-container">
        <ReportTable data={reportData} columns={columnHeaders} renderActions={(tuple) => renderEditButton(tuple)} />
        <div className="edit-enclosure-button-container">
          <Link to="/enclosure_form" className="edit-enclosure-button">Add Enclosure</Link>
        </div>
      </div>
      </div>
  );
};

export default EnclosureQueryReport;