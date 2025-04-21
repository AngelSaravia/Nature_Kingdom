import React, { useEffect, useState } from "react";
import Select from "react-select";
import PieChart from "./PieChart";
import { getMedicalRecordsSummary } from "../../services/api";
import "./MedicalRecordsReport.css";
import backgroundImage from "../../zoo_pictures/cave.jpg";

const MedicalRecordsReport = () => {
  const [summaryData, setSummaryData] = useState(null); // initially null
  const [detailedRecords, setDetailedRecords] = useState([]); // assuming this is part of the API too
  const [enclosuresOptions, setEnclosuresOptions] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]); // Add this line
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    employees: [],
    recordTypes: [],
    enclosures: [],
    animalSpecies: [],
  });

  const [employeesOptions, setEmployeesOptions] = useState([]); // employee options state
  const [recordTypesOptions, setRecordTypesOptions] = useState([]); // record types options state

  useEffect(() => {
    const fetchFilteredSummary = async () => {
      try {
        // Fetch medical records summary with filters
        console.log("Fetching medical records summary with filters:", filters);
        const data = await getMedicalRecordsSummary(filters); // Pass filters to API
        console.log("Filtered Data fetched:", data);

        // Set the fetched data into state
        setSummaryData(data.summary);
        setDetailedRecords(data.detailedRecords);

        // Extract and set employee and record type data
        setEmployeesOptions(
          data.employees.map((emp) => ({
            value: emp.id,
            label: emp.name,
          }))
        );
        setRecordTypesOptions(
          data.recordTypes.map((type) => ({
            value: type.id,
            label: type.name,
          }))
        );

        // Set species and enclosures options if available
        setSpeciesOptions(
          data.species.map((species) => ({
            value: species,
            label: species,
          }))
        );
        setEnclosuresOptions(
          data.enclosures.map((enclosure) => ({
            value: enclosure.id,
            label: enclosure.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data with filters", error);
      }
    };

    if (filters) {
      fetchFilteredSummary(); // Fetch when filters change
    }
  }, [filters]); // Dependency on filters for re-fetching data

  const handleEmployeeChange = (selectedOptions) => {
    setFilters((prevState) => ({ ...prevState, employees: selectedOptions }));
  };

  const handleRecordTypeChange = (selectedOptions) => {
    console.log("Record Type Change:", selectedOptions);
    setFilters((prevState) => ({ ...prevState, recordTypes: selectedOptions }));
  };

  const handleEnclosureChange = (selectedOptions) => {
    setFilters((prevState) => ({ ...prevState, enclosures: selectedOptions }));
  };

  const handleAnimalSpeciesChange = (selectedOptions) => {
    setFilters((prevState) => ({
      ...prevState,
      animalSpecies: selectedOptions,
    }));
  };

  return (
    <div
      className="report-body"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="report-container">
        <h1>Medical Records Report</h1>

        {/* Filters Section */}
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filter-inputs">
            <div className="filter-date-container">
              <label>Date Range:</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
              <button
                className="clear-filters-button"
                onClick={() =>
                  setFilters({
                    startDate: "",
                    endDate: "",
                    employees: [],
                    recordTypes: [],
                    enclosures: [],
                    animalSpecies: [],
                  })
                }
              >
                Clear All Filters
              </button>
            </div>
            <div className="filter-selectors-container">
              <div className="filter-selectors-row">
                <label>Employee:</label>
                <Select
                  className="filter-selectors"
                  isMulti
                  options={employeesOptions} // uses the state populated with employee data
                  value={filters.employees}
                  onChange={handleEmployeeChange}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  placeholder="Select Employees"
                />
              </div>
              <div className="filter-selectors-row">
                <label>Record Type:</label>
                <Select
                  className="filter-selectors"
                  isMulti
                  options={recordTypesOptions} // uses the state populated with record type data
                  value={filters.recordTypes}
                  onChange={handleRecordTypeChange}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  placeholder="Select Record Types"
                />
              </div>
              <div className="filter-selectors-row">
                <label>Animal Species:</label>
                <Select
                  className="filter-selectors"
                  isMulti
                  options={speciesOptions}
                  value={filters.animalSpecies}
                  onChange={handleAnimalSpeciesChange}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  placeholder="Select Species"
                />
              </div>

              <div className="filter-selectors-row">
                <label>Enclosure:</label>
                <Select
                  className="filter-selectors"
                  isMulti
                  options={enclosuresOptions}
                  value={filters.enclosures}
                  onChange={handleEnclosureChange}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  placeholder="Select Enclosures"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section and Pie Chart Inline */}
        {summaryData ? (
          <div className="summary-and-piechart">
            <div className="summary-section">
              <h2 className="section-title">Summary</h2>
              <div className="summary-table">
                <div className="summary-row">
                  <div className="summary-label">Total Medical Records</div>
                  <div className="summary-value">
                    {summaryData.totalMedicalRecords}
                  </div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">
                    Total Unique Animals With Records
                  </div>
                  <div className="summary-value">
                    {summaryData.uniqueAnimalsWithRecords}
                  </div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Most Common Record Type</div>
                  <div className="summary-value">
                    {summaryData.mostCommonRecordType}
                  </div>
                </div>
                {/* {Object.entries(summaryData.recordsByType).map(([type, count]) => (
                                    <div className="summary-row" key={type}>
                                        <div className="summary-label">Total {type} Records</div>
                                        <div className="summary-value">{count}</div>
                                    </div>
                                ))} */}
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="pie-chart-section">
              <h3>Record Type Distribution</h3>
              <PieChart data={summaryData.recordsByType} />
            </div>
          </div>
        ) : (
          <p>Loading medical records...</p>
        )}

        {/* Detailed Records Section */}
        <div className="detailed-records-section">
          <h3>Detailed Records</h3>
          {detailedRecords.length === 0 ? (
            <p className="no-records-message">
              No medical records found for the selected filters.
            </p>
          ) : (
            <table className="detailed-records-table">
              <thead>
                <tr>
                  <th>Animal ID</th>
                  <th>Animal Name</th>
                  <th>Record Type</th>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Enclosure</th>
                </tr>
              </thead>
              <tbody>
                {detailedRecords.map((record) => (
                  <tr key={record.recordId}>
                    <td>{record.animalId}</td>
                    <td>{record.animalName}</td>
                    <td>{record.recordType}</td>
                    <td>{record.date}</td>
                    <td>{record.employee}</td>
                    <td>{record.enclosure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsReport;
