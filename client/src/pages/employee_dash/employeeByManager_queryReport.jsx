import React, { useState, useEffect } from "react";
import FilterSidebar from "../dataQueryReports/filterSidebar";
import ReportTable from "../dataQueryReports/reportTable";
import "./employeeByManagerStyles.css";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../dataEntries/employee_form"; // Import the EmployeeForm component
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  { label: "First Name", type: "text", name: "first_name" },
  { label: "Last Name", type: "text", name: "last_name" },
  { label: "Gender", type: "checkbox", name: "gender", options: ["Male", "Female", "Other", "Prefer not to say"] },
  { label: "Minimum Salary", type: "number", name: "salaryMin" },
  { label: "Maximum Salary", type: "number", name: "salaryMax" },
  { label: "Beginning Birth Date", type: "date", name: "date_of_birthMin" },
  { label: "Ending Birth Date", type: "date", name: "date_of_birthMax" },
  { label: "Email", type: "text", name: "email" },
  { label: "Username", type: "text", name: "user_name" },
];

const columnHeaders = {
  first_name: "First Name",
  last_name: "Last Name",
  gender: "Gender",
  salary: "Salary",
  date_of_birth: "Date of Birth",
  email: "Email",
  user_name: "Username",
};

const ManagerEmployeeQueryReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();
  const managerEmail = localStorage.getItem("email");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected tuple
  const [isFormVisible, setIsFormVisible] = useState(false); // State for popup visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

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
          if (key === "gender") {
            prefixedFilters["employees.gender"] = Array.isArray(filters[key])
              ? filters[key].join(",")
              : filters[key];
          } else if (key === "date_of_birthMin" || key === "date_of_birthMax") {
            prefixedFilters[`employees.${key}`] = filters[key];
          } else if (key === "salaryMin" || key === "salaryMax") {
            prefixedFilters[`employees.${key}`] = filters[key];
          }else {
            prefixedFilters[`employees.${key}`] = filters[key];
          }
        });
      }

      prefixedFilters["manager.email"] = managerEmail;

      const queryParams = {
        table1: "employees",
        table2: "employees AS manager",
        join_condition: "employees.Manager_id = manager.Employee_id",
        computed_fields: `
          employees.Employee_id,
          employees.first_name,
          employees.last_name,
          employees.gender,
          employees.salary,
          employees.date_of_birth,
          employees.email,
          employees.user_name
        `,
        ...prefixedFilters,
      };

      console.log("Sending queryParams:", queryParams); // Debug log
      console.log("Request body being sent to the backend:", JSON.stringify(queryParams, null, 2));

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
    } catch (error) {
      console.error("Error fetching report: ", error);
    }
  };

  const onClearAll = () => {
    setFilters({});
    fetchReport(false);
  };

  const handleEditClick = async (employeeId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get_employees/${employeeId}`);
      console.log("Fetching employee data from:", `${API_BASE_URL}/get_employees/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        const employee = data.data;

        // Format the date_of_birth field to yyyy-MM-dd
        if (employee.date_of_birth) {
            employee.date_of_birth = new Date(employee.date_of_birth).toISOString().split("T")[0];
        }
        setSelectedEmployee(data.data);
        setIsFormVisible(true);
      } else {
        console.error("Error fetching employee data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching full employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditButton = (tuple) => {
    console.log("Tuple data:", tuple); // Debugging log
    if (!tuple.Employee_id) {
        console.error("Missing Employee_id for tuple:", tuple); // Debugging log
        return <button className="edit-tuple-button" disabled>Invalid Data</button>;
    }
    return (
      <button
        onClick={() => handleEditClick(tuple.Employee_id)}
        className="edit-tuple-button"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Edit"}
      </button>
    );
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false);
    fetchReport(); // Refresh the data after successful form submission
  };

  return (
    <div className="manager-employee-query-report">
        <h1 className="report-header">Employees By Manager Report</h1>
        <div className="report-for-employeesByManager-container">
            <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onRunReport={fetchReport}
                onClearAll={onClearAll}
                filterOptions={filterOptions}
            />
            <div className="report-table-container">
                <ReportTable
                data={reportData}
                columns={Object.keys(columnHeaders)}
                columnLabels={columnHeaders}
                renderActions={(tuple) => renderEditButton(tuple)}
                />
            </div>
        </div>
        {isFormVisible && (
        <EmployeeForm
          employeeData={selectedEmployee} // Pass selected tuple data
          source="manager_query_report" // Indicate the source
          onClose={() => setIsFormVisible(false)} // Close popup
          onSuccess={handleFormSuccess} // Callback for successful form submission
        />
      )}
    </div>
  );
};

export default ManagerEmployeeQueryReport;