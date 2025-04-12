import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "ANIMAL NAME", type: "text", name: "animal_name"},
    { label: "ENCLOSURE NAME", type: "text", name: "enclosure_name"},
    { label: "EMPLOYEE NAME", type: "text", name: "employee_name"},
    { label: "STARTING FEED DATE", type: "date", name: "dateMin"},
    { label: "ENDING FEED DATE", type: "date", name: "dateMax"},
    { label: "HEALTH STATUS", type: "checkbox", name: "health_status", options: ["HEALTHY", "NEEDS CARE", "CRITICAL"] },
];

const columnHeaders = ["animal_name", "enclosure_name", "employee_name", "date", "health_status", "summary"];

const FeedLogsQueryReport = () => {
    const[filters, setFilters] = useState({});
    const[reportData, setReportData] = useState([]);
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

                if (type === "date") {
                    return { ...prevFilters, [name]: value };
                }
                return { ...prevFilters, [name]: value };
            });
        }
    };

    const fetchReport = async (applyFilters = true) => {
        try {
            // Create prefixed filters object
            const prefixedFilters = {};
            if (applyFilters && Object.keys(filters).length > 0) {
                Object.keys(filters).forEach((key) => {
                    if (key === "animal_name") {
                        prefixedFilters["animals.animal_name"] = filters[key];
                    } else if (key === "enclosure_name") {
                        prefixedFilters["enclosures.name"] = filters[key];
                    } else if (key === "employee_name") {
                        prefixedFilters["CONCAT(employees.first_name, ' ', employees.last_name)"] = filters[key];
                    } else if (key === "dateMin" || key === "dateMax") {
                        // Keep the Min/Max suffix for date range filters
                        prefixedFilters[`feed_schedules.${key}`] = filters[key];
                    } else if (key === "health_status") {
                        prefixedFilters["feed_schedules.health_status"] = filters[key];
                    }
                });
            }

            const queryParams = {
                table1: "feed_schedules",
                table2: "animals",
                join_condition: "feed_schedules.animal_id = animals.animal_id",
                additional_joins: [
                    {
                        table: "employees",
                        join_condition: "feed_schedules.employee_id = employees.Employee_id",
                    },
                    {
                        table: "enclosures",
                        join_condition: "feed_schedules.enclosure_id = enclosures.enclosure_id",
                    },
                ],
                computed_fields: `
                    feed_schedules.*, 
                    animals.animal_name AS animal_name,
                    enclosures.name AS enclosure_name,
                    CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name  
                `,
                ...prefixedFilters,
            };

            Object.keys(queryParams).forEach((key) => {
                if (key !== "additional_joins" && Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });

            const response = await fetch(`${API_BASE_URL}/query_report/feedLogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(queryParams),
            });

            const data = await response.json();
            if (data.success) {
                setReportData(data.data);
            } else {
                console.error("Error fetching report data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching report data:", error);
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
              sessionStorage.setItem('feedLogEditData', JSON.stringify(tuple));
              navigate('/feedLog_form', { state: { tuple } });
            }}
            className="edit-tuple-button"
          >
            Edit Tuple
          </button>
        );
      };
    return (
        <div className="feedLogs-query-report">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
          <div className="report-table-container">
          <ReportTable data={reportData} columns={columnHeaders} renderActions={(tuple) => renderEditButton(tuple)} />
          <div className="edit-feedLogs-button-container">
            <Link to="/feedLog_form" className="edit-feedLogs-button">Add Feed Logs</Link>
          </div>
        </div>
        </div>
    );
};
export default FeedLogsQueryReport;