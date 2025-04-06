import React, { useState } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "FIRST NAME", type: "text", name: "first_name"},
    { label: "LAST NAME", type: "text", name: "last_name"},
    { label: "USER NAME", type: "text", name: "username" },
    { label: "EMAIL", type: "text", name: "email" },
    { label: "PHONE", type: "text", name: "phone_number" },
    { label: "DATE OF BIRTH", type: "date", name: "date_of_birth" },
    { label: "GENDER", type: "checkbox", name: "gender", options: ["Male", "Female", "Other", "Prefer not to say"]},
    { label: "STREET ADDRESS", type: "text", name: "street_address" },
    { label: "CITY", type: "text", name: "city" },
    { label: "STATE", type: "text", name: "state" },
    { label: "ZIP CODE", type: "number", name: "zipcode" },
    { label: "COUNTRY", type: "text", name: "country" },
    { label: "ROLE", type: "text", name: "role" }, 

    { label: "MEMBERSHIP ID", type: "number", name: "membership_id" },
    { label: "START DATE", type: "datetime-local", name: "start_date" },
    { label: "END DATE", type: "date", name: "end_date" },
    { label: "MAX GUESTS", type: "number", name: "max_guests" },
];

const columnHeaders = [
    "visitor_id", "first_name", "last_name", "username", "email",
    "phone_number", "date_of_birth", "gender", "street_address", 
    "city", "state", "zipcode", "country", "role",
    "membership_id", "start_date", "end_date", "max_guests"

];

const VisitorMembershipQueryReport = () => {
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

            const queryParams = { table1: "visitors", table2: "memberships", join_condition: "visitors.visitor_id = memberships.visitor_id", ...filters };

            Object.keys(queryParams).forEach((key) => {
                if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });

            const response = await fetch(`${API_BASE_URL}/query_report/visitors`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
        <div className="visitor-query-report"> 
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
          <div className="report-table-container">
          <ReportTable data={reportData} columns={columnHeaders} />
          <div className="edit-visitor-button-container">
            <a href="/visitor_form" target="_blank" rel="noopener noreferrer" className="edit-visitor-button">Edit Visitor</a>
          </div>
        </div>
        </div>
    );
};
export default VisitorMembershipQueryReport;