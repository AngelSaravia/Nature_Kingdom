import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "VISITOR NAME", type: "text", name: "visitor_name" },
    { label: "START DATE", type: "date", name: "start_date" },
    { label: "END DATE", type: "date", name: "end_date" },
    { label: "TICKET TYPE", type: "checkbox", name: "ticket_type", options: ["Child", "Adult", "Senior", "Group", "Member"] },
    { label: "BEGINNING PURCHASE DATE", type: "date", name: "purchase_dateMin" },
    { label: "ENDING PURCHASE DATE", type: "date", name: "purchase_dateMax" },
];

const columnHeaders = ["visitor_name", "start_date", "end_date", "ticket_type", "purchase_date"];

const TicketQueryReport = () => {
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
                    if (key === 'visitor_name') {
                        prefixedFilters['CONCAT(visitors.first_name, " ", visitors.last_name)'] = filters[key];
                    } else if (key === 'start_date' || key === 'end_date' || key === 'purchase_dateMin' || key === 'purchase_dateMax') {
                        prefixedFilters[`tickets.${key}`] = filters[key];
                    } else if (key === 'ticket_type') {
                        prefixedFilters[`tickets.${key}`] = filters[key];
                    }
                });
            }

            // Time portion for compatibility with TIMESTAMP
            if (prefixedFilters['tickets.start_date']) {
                prefixedFilters['tickets.start_date'] = prefixedFilters['tickets.start_date'];
            }
            if (prefixedFilters['tickets.end_date']) {
                prefixedFilters['tickets.end_date'] = prefixedFilters['tickets.end_date'];
            }
            if (prefixedFilters['tickets.purchase_dateMin']) {
                prefixedFilters['tickets.purchase_dateMin'] = prefixedFilters['tickets.purchase_dateMin'];
            }
            if (prefixedFilters['tickets.purchase_dateMax']) {
                prefixedFilters['tickets.purchase_dateMax'] = prefixedFilters['tickets.purchase_dateMax'];
            }

            const queryParams = {
            table1: "tickets",
            table2: "visitors",
            join_condition: "tickets.visitor_id = visitors.visitor_id",
            computed_fields: `
                tickets.*, 
                CONCAT(visitors.first_name, ' ', visitors.last_name) AS visitor_name
            `,
            ...prefixedFilters,
            };

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
    const onClearAll = () => {
        setFilters({});
        fetchReport(false);
    };
    return (
        <div className="ticket-query-report">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
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