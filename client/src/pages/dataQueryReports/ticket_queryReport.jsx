import React, { useState } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "VISITOR ID", type: "number", name: "visitor_id" }, //remove id's from all query reports? Don't know if I need to take out primary key id's or foreign key id's
    { label: "START DATE", type: "datetime-local", name: "start_date" },
    { label: "END DATE", type: "datetime-local", name: "end_date" },
    { label: "PRICE (Min)", type: "number", name: "priceMin" },
    { label: "PRICE (Max)", type: "number", name: "priceMax" },
    { label: "TICKET TYPE", type: "checkbox", name: "ticket_type", options: ["Child", "Adult", "Senior", "Group", "Member"] },
    { label: "PURCHASE DATE", type: "datetime-local", name: "purchase_date" },
];

const columnHeaders = ["ticket_id", "visitor_id", "start_date", "end_date", "price", "ticket_type", "purchase_date"];

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
                // Format TIMESTAMP fields to datetime-local format
                const formattedData = data.data.map((row) => ({
                ...row,
                start_date: row.start_date ? new Date(row.start_date).toISOString().slice(0, 16) : "",
                end_date: row.end_date ? new Date(row.end_date).toISOString().slice(0, 16) : "",
                purchase_date: row.purchase_date ? new Date(row.purchase_date).toISOString().slice(0, 16) : "",
            }));
                setReportData(formattedData);
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