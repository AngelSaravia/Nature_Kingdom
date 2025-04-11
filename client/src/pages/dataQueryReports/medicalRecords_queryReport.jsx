import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "ANIMAL ID", type: "number", name: "animal_id"},
    { label: "ANIMAL NAME", type: "text", name: "animal_name"},
    { label: "EMPLOYEE EMAIL", type: "text", name: "employee_email"}, //create dropdown for employee email
    { label: "ENCLOSURE NAME", type: "text", name: "enclosure_name"}, //create dropdown for enclosure name
    { label: "HEALTH STATUS", type: "checkbox", name: "health_status", options: ["HEALTHY", "NEEDS CARE", "CRITICAL"] },
    { label: "STARTING DATE OF RECORD" , type: "date", name: "dateMin"},
    { label: "ENDING DATE OF RECORD" , type: "date", name: "dateMax"},
    { label: "ANIMAL SPECIES", type: "text", name: "species"}, //create dropdown for species. Make sure there are no duplicates in the dropdown.
];

const columnHeaders = ["animal_id", "animal_name", "employee_email", "enclosure_name", "location", "health_status", "date", "species", "record_type"];

const MedicalRecordsQueryReport = () => {
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

                if (type === "date") {
                    return { ...prevFilters, [name]: value };
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
                    if (key === "animal_name") {
                        prefixedFilters["animals.animal_name"] = filters[key];
                    } else if (key === "animal_id") {
                        prefixedFilters["animals.animal_id"] = filters[key];
                    } else if (key === "employee_email") {
                        prefixedFilters["employees.email"] = filters[key];
                    } else if (key === "enclosure_name") {
                        prefixedFilters["enclosures.name"] = filters[key];
                    } else if (key === "location") {
                        prefixedFilters["medical_records.location"] = filters[key];
                    } else if (key === "health_status") {
                        prefixedFilters["animals.health_status"] = filters[key];
                    } else if (key === "record_type") {
                        prefixedFilters["medical_records.record_type"] = filters[key];
                    } else if (key === "dateMin" || key === "dateMax") {
                        // Keep the Min/Max suffix for date range filters
                        prefixedFilters[`medical_records.${key}`] = filters[key];
                    } else if (key === "species") {
                        prefixedFilters["animals.species"] = filters[key];
                    }
                });
            }

            const queryParams = {
                table1: "medical_records",
                table2: "animals",
                join_condition: "medical_records.animal_id = animals.animal_id",
                additional_joins: [
                    {
                        table: "employees",
                        join_condition: "medical_records.employee_id = employees.Employee_id",
                    },
                    {
                        table: "enclosures",
                        join_condition: "medical_records.enclosure_id = enclosures.enclosure_id",
                    },
                ],
                computed_fields: `
                    medical_records.*,
                    animals.animal_id AS animal_id,
                    animals.animal_name AS animal_name,
                    animals.health_status AS health_status,
                    animals.species AS species,
                    enclosures.name AS enclosure_name,
                    employees.email AS employee_email 
                `,
                ...prefixedFilters,
            };

            Object.keys(queryParams).forEach((key) => {
                if (key !== "additional_joins" && Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });

            const response = await fetch(`${API_BASE_URL}/query_report/medicalRecords`, {
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
    return (
        <div className="medicalRecords-query-report">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
          <div className="report-table-container">
          <ReportTable data={reportData} columns={columnHeaders} />
          <div className="edit-medicalRecords-button-container">
            <Link to="/medical_form" className="edit-medicalRecords-button">Edit Medical Records</Link>
          </div>
        </div>
        </div>
    );
};
export default MedicalRecordsQueryReport;