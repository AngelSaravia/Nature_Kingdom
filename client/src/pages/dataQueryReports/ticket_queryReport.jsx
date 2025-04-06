import React, { useState } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "VISITOR ID", type: "number", name: "visitor_id" },
    { label: "START DATE", type: "date", name: "start_date" },
    { label: "END DATE", type: "date", name: "end_date" },
    { label: "TICKET TYPE", type: "checkbox", name: "ticket_type", options: ["Child", "Adult", "Senior", "Group", "Member"] },
    { label: "BEGINNING PURCHASE DATE", type: "date", name: "purchase_dateMin" },
    { label: "ENDING PURCHASE DATE", type: "date", name: "purchase_dateMax" },
];

const columnHeaders = ["ticket_id", "visitor_id", "start_date", "end_date", "ticket_type", "purchase_date"];

const TicketQueryReport = () => {
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

            const queryParams = { entity_type: "tickets", ...filters };

            // Add time portion for compatibility with TIMESTAMP
            if (queryParams.start_date) {
                queryParams.start_date = `${queryParams.start_date} 00:00:00`; // Start of the day
            }
            if (queryParams.end_date) {
                queryParams.end_date = `${queryParams.end_date} 23:59:59`; // End of the day
            }

            Object.keys(queryParams).forEach((key) => {
                if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });

            const response = await fetch(`${API_BASE_URL}/query_report/tickets`, {
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
        <div className="ticket-query-report">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
            <div className="report-table-container">
                <ReportTable data={reportData} columns={columnHeaders} />
                <div className="edit-ticket-button-container">
                    <Link to="/ticket_form" className="edit-ticket-button">Edit Ticket</Link>
                </div>
            </div>
        </div>
    );
};
export default TicketQueryReport;