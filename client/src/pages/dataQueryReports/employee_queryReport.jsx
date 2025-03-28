import React, { useState } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";

const filterOptions = [
    { label: "FIRST NAME", type: "text", name: "first_name"},
    { label:  "LAST NAME", type: "text", name: "last_name"},
    { label: "USER NAME", type: "text", name: "user_name" },
    { label: "DEPARTMENT ID", type: "number", name: "department_id" },
    { label: "DATE OF BIRTH", type: "date", name: "date_of_birth" },
    { label: "STREET ADDRESS", type: "text", name: "street_address" },
    { label: "CITY", type: "text", name: "city"},
    { label: "STATE", type: "text", name: "state"},
    { label: "ZIP CODE", type: "number", name: "zip_code"},
    { label: "COUNTRY", type: "text", name: "country"},
    { label: "SALARY", type: "number", name: "salary"},
    { label: "ROLE", type: "checkbox", name: "role", options: ["Manager", "Zookeeper", "Veterinarian", "Maintenance", "Guest Services", "Administrator", "Operator"] },
    { label: "GENDER", type: "checkbox", name: "gender", options: ["Male", "Female", "Other", "Prefer not to say"] },
    { label: "EMAIL", type: "text", name: "email"},
    { label: "PHONE", type: "text", name: "phone"},
    { label: "MANAGER ID", type: "number", name: "Manager_id"},
];

const columnHeaders = ["Employee_id", "first_name", "last_name", "user_name", "department_id", "date_of_birth", "street_address", "city", "state", "zip_code", "country", "salary", "role", "gender", "email", "phone", "Manager_id"];

const EmployeeQueryReport = () => {
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
    
            const queryParams = { entity_type: "employees", ...filters };
    
            Object.keys(queryParams).forEach((key) => {
                if (Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });
    
            const response = await fetch(`http://localhost:5004/query_report/employees`, { //const response = await fetch(`${API_BASE_URL}/query_report/animals`, {
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

      return (
        <div className="employee-query-report">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} filterOptions={filterOptions} />
          <ReportTable data={reportData} columns={columnHeaders} />
        </div>
      );
};
export default EmployeeQueryReport;