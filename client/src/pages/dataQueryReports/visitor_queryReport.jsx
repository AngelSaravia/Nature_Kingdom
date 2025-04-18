import React, { useState, useEffect } from "react"; 
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "FIRST NAME", type: "text", name: "first_name"},
    { label: "LAST NAME", type: "text", name: "last_name"},
    { label: "USER NAME", type: "text", name: "username" },
    { label: "EMAIL", type: "text", name: "email" },
    { label: "PHONE", type: "text", name: "phone_number" },
    { label: "BEGINNING BIRTH DATE", type: "date", name: "date_of_birthMin" },
    { label: "ENDING BIRTH DATE", type: "date", name: "date_of_birthMax" },
    { label: "GENDER", type: "checkbox", name: "gender", options: ["Male", "Female", "Other", "Prefer not to say"]},
    { label: "STREET ADDRESS", type: "text", name: "street_address" },
    { label: "CITY", type: "text", name: "city" },
    { label: "STATE", type: "text", name: "state" },
    { label: "ZIP CODE", type: "number", name: "zipcode" },
    { label: "COUNTRY", type: "text", name: "country" },

    { label: "MEMBERSHIP STATUS", type: "checkbox", name: "membership_status", options: ["active", "inactive"] },
];


const columnHeaders = {
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    email: "Email",
    phone_number: "Phone Number",
    date_of_birth: "Date of Birth",
    gender: "Gender",
    street_address: "Street Address",
    city: "City",
    state: "State",
    zipcode: "Zip Code",
    country: "Country",
    membership_status: "Membership Status",
    end_date: "Membership End Date",
    first_login: "First Login",
    last_login: "Last Login",
};

const VisitorQueryReport = () => {
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
            const prefixedFilters = {};
            if (applyFilters && Object.keys(filters).length > 0) {
                Object.keys(filters).forEach((key) => {
                    if (key === 'membership_status') {
                        // Pass membership_status directly without prefixing with visitors
                        prefixedFilters[key] = filters[key];
                    } else if (key === 'date_of_birthMin' || key === 'date_of_birthMax') {
                        // Handle date range filters
                        prefixedFilters[`visitors.${key}`] = filters[key];
                    } else if (key === 'gender') {
                        // Handle gender as array
                        prefixedFilters['visitors.gender'] = filters[key];
                    } else {
                        // Prefix all other visitor fields
                        prefixedFilters[`visitors.${key}`] = filters[key];
                    }
                });
            }

            const queryParams = {
                table1: "visitors",
                table2: "memberships",
                join_condition: "visitors.visitor_id = memberships.visitor_id",
                computed_fields: ` 
                    visitors.*, 
                    CASE 
                        WHEN memberships.visitor_id IS NOT NULL THEN 'active'
                        ELSE 'inactive'
                    END AS membership_status,
                    memberships.end_date,
                    visitors.first_login,
                    visitors.last_login
                `,
                ...prefixedFilters,
            };

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

    const onClearAll = () => {
        setFilters({});
        fetchReport(false);
    };

    const renderEditButton = (tuple) => {
        return (
          <button 
            onClick={() => {
              // Store in sessionStorage as fallback
              sessionStorage.setItem('visitorEditData', JSON.stringify(tuple));
              navigate('/visitor_form', { state: { tuple } });
            }}
            className="edit-tuple-button"
          >
            Edit
          </button>
        );
      };
    return (
        <div className="visitor-query-report"> 
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
          <div className="report-table-container">
          <ReportTable data={reportData} columns={Object.keys(columnHeaders)} renderActions={(tuple) => renderEditButton(tuple)} columnLabels={columnHeaders}/>
          <div className="edit-visitor-button-container">

            <a href="/visitor_form" className="edit-visitor-button">Add Visitor</a>

          </div>
        </div>
        </div>
    );
};
export default VisitorQueryReport;