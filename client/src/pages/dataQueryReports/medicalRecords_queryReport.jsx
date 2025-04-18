import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "ANIMAL ID", type: "number", name: "animal_id"},
    { label: "EMPLOYEE EMAIL", type: "dropdown", name: "employee_email"},
    { label: "ANIMAL NAME", type: "text", name: "animal_name"},
    { label: "HEALTH STATUS", type: "checkbox", name: "health_status", options: ["HEALTHY", "NEEDS CARE", "CRITICAL"] },
    { label: "ENCLOSURE NAME", type: "dropdown", name: "enclosure_name"},
    { label: "RECORD TYPE", type: "checkbox", name: "record_type", options: ["Medication", "Surgery", "Disease", "Vaccination", "Injury", "Checkup", "Dental", "Post-Mortem", "Other"] },
    { label: "ANIMAL SPECIES", type: "dropdown", name: "species"},
    { label: "STARTING DATE OF RECORD" , type: "date", name: "dateMin"},
    { label: "ENDING DATE OF RECORD" , type: "date", name: "dateMax"},
];

const columnHeaders = {
    animal_id: "Animal ID",
    animal_name: "Animal Name",
    employee_email: "Employee Email",
    enclosure_name: "Enclosure Name",
    location: "Location",
    health_status: "Health Status",
    date: "Medical Record Date",
    species: "Species",
    record_type: "Record Type",
    diagnosis: "Diagnosis",
    treatment: "Treatment",
    followup: "Follow-Up Date",
    additional: "Additional Notes",
};

const MedicalRecordsQueryReport = () => {
    const [filters, setFilters] = useState({});
    const [reportData, setReportData] = useState([]);
    const navigate = useNavigate();
    const [dropdownData, setDropdownData] = useState({
        employee_email: [],
        enclosure_name: [],
        species: [],
    });
    const [resetDropdowns, setResetDropdowns] = useState(false);

    useEffect(() => {
        fetchReport(false);
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [employeeEmails, enclosureNames, species] = await Promise.all([
                fetch(`${API_BASE_URL}/medical_records/distinct_values?field=email&table=employees`).then((res) => res.json()),
                fetch(`${API_BASE_URL}/medical_records/distinct_values?field=name&table=enclosures`).then((res) => res.json()),
                fetch(`${API_BASE_URL}/medical_records/distinct_values?field=species&table=animals`).then((res) => res.json()),
            ]);

            setDropdownData({
                employee_email: employeeEmails.success ? employeeEmails.data : [],
                enclosure_name: enclosureNames.success ? enclosureNames.data : [],
                species: species.success ? species.data : [],
            });
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    const handleFilterChange = (eventOrUpdater) => {
        if (typeof eventOrUpdater === "function") {
            setFilters((prevFilters) => {
                const updatedFilters = eventOrUpdater(prevFilters);
                fetchDropdownData();
                return updatedFilters;
            });
        } else {
            const { name, value, type, checked } = eventOrUpdater.target;

            setFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };

                if (type === "checkbox") {
                    const updatedValues = prevFilters[name] ? [...prevFilters[name]] : [];
                    if (checked) {
                        if (!updatedValues.includes(value)) updatedValues.push(value);
                    } else {
                        const index = updatedValues.indexOf(value);
                        if (index > -1) updatedValues.splice(index, 1);
                    }
                    updatedFilters[name] = updatedValues;
                } else {
                    updatedFilters[name] = value;
                }

                fetchDropdownData();
                return updatedFilters;
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
                        prefixedFilters[`medical_records.${key}`] = filters[key];
                    } else if (key === "species") {
                        prefixedFilters["animals.species"] = filters[key];
                    }
                });
            }

            const queryParams = {
                entity_type: "medical_records",
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
        setResetDropdowns(true);
        console.log("Resetting dropdowns: ", true); // Debugging
        fetchReport(false);
        setTimeout(() => {
            setResetDropdowns(false);
        console.log("Resetting dropdowns: ", false); // Debugging
        }, 0);
    };

    const renderEditButton = (tuple) => {
        return (
          <button 
            onClick={() => {
              // Store in sessionStorage as fallback
              sessionStorage.setItem('medicalRecordEditData', JSON.stringify(tuple));
              navigate('/medical_form', { state: { tuple } });
            }}
            className="edit-tuple-button"
          >
            Edit
          </button>
        );
      };
    return (
        <div className="medicalRecords-query-report">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onRunReport={fetchReport} onClearAll={onClearAll} filterOptions={filterOptions} dropdownData={dropdownData} resetDropdowns={resetDropdowns}/>
          <div className="report-table-container">
          <ReportTable data={reportData} columns={Object.keys(columnHeaders)} renderActions={(tuple) => renderEditButton(tuple)} columnLabels={columnHeaders}/>
          <div className="edit-medicalRecords-button-container">
            <Link to="/medical_form" className="edit-medicalRecords-button">Add Medical Record</Link>
          </div>
        </div>
        </div>
    );
};
export default MedicalRecordsQueryReport;