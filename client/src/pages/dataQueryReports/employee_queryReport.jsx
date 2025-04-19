import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "FIRST NAME", type: "text", name: "first_name"},
    { label:  "LAST NAME", type: "text", name: "last_name"},
    { label: "USER NAME", type: "text", name: "user_name" },
    { label: "DEPARTMENT NAME", type: "text", name: "department_name" },
    { label: "BEGINNING BIRTH DATE", type: "date", name: "date_of_birthMin" },
    { label: "ENDING BIRTH DATE", type: "date", name: "date_of_birthMax" },
    { label: "STREET ADDRESS", type: "text", name: "street_address" },
    { label: "CITY", type: "text", name: "city"},
    { label: "STATE", type: "text", name: "state"},
    { label: "ZIP CODE", type: "number", name: "zip_code"},
    { label: "COUNTRY", type: "text", name: "country"},
    { label: "MIN SALARY", type: "number", name: "salaryMin"},
    { label: "MAX SALARY", type: "number", name: "salaryMax"},
    { label: "GENDER", type: "checkbox", name: "gender", options: ["Male", "Female", "Other", "Prefer not to say"] },
    { label: "EMAIL", type: "text", name: "email"},
    { label: "PHONE", type: "text", name: "phone"},
    { label: "MANAGER EMAIL", type: "text", name: "manager_email"},
];

const columnHeaders = {
  first_name: "First Name",
  last_name: "Last Name",
  user_name: "User Name",
  department_name: "Department Name",
  date_of_birth: "Date of Birth",
  street_address: "Street Address",
  city: "City",
  state: "State",
  zip_code: "Zip Code",
  country: "Country",
  salary: "Salary",
  gender: "Gender",
  email: "Email",
  phone: "Phone Number",
  manager_email: "Manager Email",
};

const EmployeeQueryReport = () => {
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
            
            if (type === "date") {
              const formattedValue = new Date(value).toISOString().split("T")[0];
              return { ...prevFilters, [name]: formattedValue };
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
                  // List of fields that need "employees." prefix
                  const employeeFields = [
                      "first_name", "last_name", "user_name", "gender", 
                      "date_of_birth", "street_address", "city", "state", 
                      "zip_code", "country", "salary", "email", "phone"
                  ];
                  if (key === "gender") {
                    // Special handling for gender array
                    prefixedFilters["employees.gender"] = Array.isArray(filters[key]) 
                        ? filters[key].join(",")  // Join array values with comma
                        : filters[key];           // Keep single value as is
                } else if (key === "date_of_birthMin" || key === "date_of_birthMax") {
                      // Keep the Min/Max suffix for date range filters
                      prefixedFilters[`employees.${key}`] = filters[key];
                  } else if (key === "salaryMin" || key === "salaryMax") {
                    prefixedFilters[`employees.${key}`] = filters[key];
                  } else if (employeeFields.includes(key)) {
                      prefixedFilters[`employees.${key}`] = filters[key];
                  } else if (key === "manager_email") {
                      prefixedFilters["manager.email"] = filters[key];
                  } else if (key === "department_name") {
                      prefixedFilters["departments.name"] = filters[key];
                  } else {
                      prefixedFilters[key] = filters[key];
                  }
              });
            }
    
            const queryParams = {
              table1: "employees",
              table2: "departments",
              join_condition: "employees.department_id = departments.department_id",
              additional_joins: [
                  {
                      table: "employees AS manager",
                      join_condition: "employees.Manager_id = manager.Employee_id",
                  },
              ],
              computed_fields: `
                  employees.*, 
                  departments.name AS department_name, 
                  manager.email AS manager_email
              `,
              ...prefixedFilters,
            };
    
            Object.keys(queryParams).forEach((key) => {
                if (key !== "additional_joins" && Array.isArray(queryParams[key]) && queryParams[key].length > 0) {
                    queryParams[key] = queryParams[key].join(",");
                }
            });
            
            const response = await fetch(`${API_BASE_URL}/query_report/employees`, {
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
            console.log("3"); 
        } catch (error) {
            console.error("Error fetching report: ", error);
        }
      };

      const onClearAll = () => {
        setFilters({});
        fetchReport(false);
      };

      const renderEditButton = (tuple) => {
        console.log("Employee Query Report - Tuple data:", tuple); // Debugging log
        return (
          <button 
            onClick={() => {
              // Store in sessionStorage as fallback
              sessionStorage.setItem('employeeEditData', JSON.stringify(tuple));
              navigate('/employee_form', { state: { tuple } });
            }}
            className="edit-tuple-button"
          >
            Edit
          </button>
        );
      };
      return (
        <div className="employee-query-report">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} />
          <div className="report-table-container">
          <ReportTable data={reportData} columns={Object.keys(columnHeaders)} renderActions={(tuple) => renderEditButton(tuple)} columnLabels={columnHeaders}/>
          <div className="edit-employee-button-container">

            <a href="/employee_form" className="edit-employee-button">Add Employee</a>

          </div>
        </div>
        </div>
      );  
};
export default EmployeeQueryReport;