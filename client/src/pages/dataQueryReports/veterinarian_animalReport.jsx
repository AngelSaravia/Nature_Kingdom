import React, { useState, useEffect } from "react";
import "./veterinarian_criticalReport.css";
import styles from "../dataEntries/forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const animalColumnHeaders = [
  "animal_name",
  "species",
  "animal_type",
  "health_status",
  "date_of_birth",
  "enclosure_name", // Added to show which enclosure the animal belongs to
];

const CriticalAnimalsReport = () => {
  const [criticalAnimals, setCriticalAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [popupState, setPopupState] = useState({
    isOpen: false,
    animal: null,
    nextStatus: null,
  });

  // Added state for medical form popup
  const [showMedicalFormPopup, setShowMedicalFormPopup] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    fetchCriticalAnimals();
  }, []);

  const fetchCriticalAnimals = async () => {
    setLoading(true);
    try {
      // Fetch all enclosures first
      const enclosureResponse = await fetch(
        `${API_BASE_URL}/query_report/enclosures`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table1: "enclosures",
            table2: "employees",
            join_condition: "enclosures.Manager_id = employees.employee_id",
            additional_joins: [
              {
                table: "exhibits",
                join_condition: "enclosures.exhibit_id = exhibits.exhibit_id",
              },
            ],
            computed_fields: `
            enclosures.*, 
            CONCAT(employees.first_name, ' ', employees.last_name) AS manager_name,
            exhibits.name AS exhibit_name
          `,
          }),
        }
      );

      const enclosureData = await enclosureResponse.json();

      if (!enclosureData.success) {
        console.error("Error fetching enclosures:", enclosureData.message);
        setLoading(false);
        return;
      }

      // Create a map of enclosure IDs to names for quick lookup
      const enclosureMap = {};
      enclosureData.data.forEach((enclosure) => {
        enclosureMap[enclosure.enclosure_id] = enclosure.name;
      });

      // Fetch all animals with critical or needs care status
      const allCriticalAnimals = [];

      // Fetch animals for each enclosure and filter them
      for (const enclosure of enclosureData.data) {
        const animalsResponse = await fetch(
          `${API_BASE_URL}/animals/enclosure/${enclosure.enclosure_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const animalsData = await animalsResponse.json();

        if (animalsData.success) {
          // Filter animals by health status
          const criticalInEnclosure = animalsData.data.filter(
            (animal) =>
              animal.health_status === "CRITICAL" ||
              animal.health_status === "NEEDS CARE"
          );

          // Add enclosure name to each animal
          criticalInEnclosure.forEach((animal) => {
            animal.enclosure_name = enclosure.name;
          });

          allCriticalAnimals.push(...criticalInEnclosure);
        }
      }

      setCriticalAnimals(allCriticalAnimals);
    } catch (error) {
      console.error("Error fetching critical animals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonTextByStatus = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "Mark as Needs Care";
      case "NEEDS CARE":
        return "Mark as Critical";
      case "CRITICAL":
        return "Mark as Healthy";
      default:
        return "Update Health Status";
    }
  };

  const getNextHealthStatusValue = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "NEEDS CARE";
      case "NEEDS CARE":
        return "CRITICAL";
      case "CRITICAL":
        return "HEALTHY";
      default:
        return "HEALTHY";
    }
  };

  const getStatusChangeDescription = (currentStatus, nextStatus) => {
    if (currentStatus === "HEALTHY" && nextStatus === "NEEDS CARE") {
      return "This animal will be marked as needing care. Regular monitoring and appropriate care will be initiated.";
    } else if (currentStatus === "NEEDS CARE" && nextStatus === "CRITICAL") {
      return "This animal will be marked as critical. Immediate veterinary attention will be required and emergency protocols will be activated.";
    } else if (currentStatus === "CRITICAL" && nextStatus === "HEALTHY") {
      return "This animal will be marked as healthy. This indicates the animal has recovered and no longer requires special medical attention.";
    } else {
      return `Health status will be updated from ${currentStatus} to ${nextStatus}.`;
    }
  };

  const initiateHealthStatusChange = (animal) => {
    const nextStatus = getNextHealthStatusValue(animal.health_status);

    // For any status change, show the popup
    setPopupState({
      isOpen: true,
      animal: animal,
      nextStatus: nextStatus,
    });
  };

  // Function for confirming the health status change
  const confirmHealthStatusChange = () => {
    if (popupState.animal) {
      // Apply the health status change
      handleHealthStatusProgression(popupState.animal);
      //window.location.reload(); optional if you want to reload
    }
    // Close the popup
    setPopupState({
      isOpen: false,
      animal: null,
      nextStatus: null,
    });
  };

  // Function for canceling the health status change
  const closePopup = () => {
    setPopupState({
      isOpen: false,
      animal: null,
      nextStatus: null,
    });
  };

  const getButtonColorByStatus = (currentStatus) => {
    switch (currentStatus) {
      case "HEALTHY":
        return "#5cb85c"; // Green for Healthy
      case "NEEDS CARE":
        return "#ffc107"; // Yellow/amber for Needs Care
      case "CRITICAL":
        return "#d9534f"; // Red for Critical
      default:
        return "#2c5e4e"; // Default color
    }
  };

  const getButtonStyleByStatus = (currentStatus) => {
    const baseStyle = {
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      fontSize: "0.9rem",
    };

    return {
      ...baseStyle,
      backgroundColor: getButtonColorByStatus(currentStatus),
      cursor: "pointer",
    };
  };

  const handleHealthStatusProgression = async (animal) => {
    setUpdateLoading(true);
    const nextStatus = getNextHealthStatusValue(animal.health_status);

    try {
      const response = await fetch(
        `${API_BASE_URL}/animals/${animal.animal_id}/health`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ healthStatus: nextStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the status in our local state
        setCriticalAnimals((prevAnimals) =>
          prevAnimals.map((a) =>
            a.animal_id === animal.animal_id
              ? { ...a, health_status: nextStatus }
              : a
          )
        );

        console.log(`Health status updated to ${nextStatus}`);
      } else {
        console.error("Failed to update health status:", data.message);
        alert("Failed to update health status: " + data.message);
      }
    } catch (error) {
      console.error("Failed to update health status:", error);
      alert("Failed to update health status. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Fetch medical history for an animal
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  const handleViewMedicalHistory = async (animal) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/medical_records/animal/${animal.animal_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMedicalHistory(data.data);
        setSelectedAnimal(animal);
        setShowMedicalHistory(true);
      } else {
        console.error("Failed to fetch medical history:", data.message);
        alert("Failed to fetch medical history: " + data.message);
      }
    } catch (error) {
      console.error("Failed to fetch medical history:", error);
      alert("Error fetching medical history. Please try again.");
    }
  };

  const MedicalFormContent = ({ animal, onClose }) => {
    const [formData, setFormData] = useState({
      record_id: "",
      animal_id: animal ? animal.animal_id : "",
      employee_id: "",
      enclosure_id: animal ? animal.enclosure_id : "",
      location: "",
      date: new Date().toISOString().slice(0, 10),
      record_type: "",
      diagnosis: "",
      treatment: "",
      followup: "",
      additional: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
      fetch(`${API_BASE_URL}/get_medical_records`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) setRecords(data.data);
        })
        .catch((error) => console.error("Error fetching records:", error));
    }, []);

    // Handle text input changes
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle dropdown selections
    const handleSelect = (name, value) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handles only numeric input
    const handleNumericInput = (event) => {
      event.target.value = event.target.value.replace(/\D/g, "");
    };

    // Handle form submission
    const handleSubmit = async (action) => {
      if (action !== "delete") {
        const requiredFields = [
          "animal_id",
          "employee_id",
          "enclosure_id",
          "location",
          "record_type",
        ];
        const missingFields = requiredFields.filter(
          (field) => !formData[field]
        );
        if (missingFields.length > 0) {
          setSubmissionStatus(
            `Please fill out all of the required fields. Missing: ${missingFields.join(
              ", "
            )}`
          );
          return;
        }
      }

      if (action === "delete" && !formData.record_id) {
        setSubmissionStatus("Medical record ID is required for deletion.");
        return;
      }
      const requestData = { ...formData };
      if (action === "add") {
        delete requestData.record_id; // Remove record_id for add action
      }

      try {
        const response = await fetch(`${API_BASE_URL}/medical_form`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...requestData, action }),
        });
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const result = await response.json();
        setSubmissionStatus(result.message);

        if (result.success) {
          if (action === "delete") {
            const freshResponse = await fetch(
              `${API_BASE_URL}/get_medical_records`
            );
            const freshData = await freshResponse.json();
            if (freshData.success) setRecords(freshData.data);
          }
          if (action !== "delete") {
            setFormData({
              record_id: "",
              animal_id: animal ? animal.animal_id : "",
              employee_id: "",
              enclosure_id: animal ? animal.enclosure_id : "",
              location: "",
              date: new Date().toISOString().slice(0, 10),
              record_type: "",
              diagnosis: "",
              treatment: "",
              followup: "",
              additional: "",
            });
          }

          // After successful submit, refresh critical animals data
          if (action === "add" && formData.record_type) {
            fetchCriticalAnimals();
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
      }
    };

    // Input Field Component
    const InputField = ({
      label,
      name,
      type,
      value,
      onChange,
      onInput,
      autoComplete,
      disabled,
    }) => {
      return (
        <div className={styles.inputGroup}>
          <label htmlFor={name} className={styles.label}>
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onInput={onInput}
            className={styles.input}
            autoComplete={autoComplete}
            disabled={disabled}
          />
        </div>
      );
    };

    return (
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>MEDICAL RECORD DATA ENTRY</h2>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formRow}>
            <InputField
              label="ANIMAL ID *"
              name="animal_id"
              type="text"
              value={formData.animal_id}
              onChange={handleChange}
              onInput={handleNumericInput}
              autoComplete="off"
              disabled={animal ? true : false}
            />
            <InputField
              label="EMPLOYEE ID *"
              name="employee_id"
              type="text"
              value={formData.employee_id}
              onChange={handleChange}
              onInput={handleNumericInput}
              autoComplete="off"
            />
          </div>
          <div className={styles.formRow}>
            <InputField
              label="ENCLOSURE ID *"
              name="enclosure_id"
              type="text"
              value={formData.enclosure_id}
              onChange={handleChange}
              onInput={handleNumericInput}
              autoComplete="off"
              disabled={animal ? true : false}
            />
            <InputField
              label="LOCATION *"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="diagnosis" className={styles.label}>
                DIAGNOSIS/CONDITION
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                placeholder="Enter diagnosis"
                onChange={handleChange}
                rows="5"
                maxLength="2000"
                style={{ width: "100%", resize: "vertical" }}
                autoComplete="off"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="treatment" className={styles.label}>
                PRESCRIPTION/TREATMENT
              </label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                placeholder="Enter prescription details and treatment plan"
                onChange={handleChange}
                rows="5"
                maxLength="2000"
                style={{ width: "100%", resize: "vertical" }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <InputField
              label="DATE OF RECORD"
              name="date"
              value={formData.date}
              type="date"
              onChange={handleChange}
              autoComplete="bday"
            />
            <InputField
              label="FOLLOW UP DATE"
              name="followup"
              type="date"
              value={formData.followup}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="record_typeDropdown" className={styles.label}>
              RECORD TYPE (choose one) *
            </label>
            <Dropdown
              label="Select record type *"
              selectedLabel={formData.record_type || "Select record type *"}
              onSelect={(value) => handleSelect("record_type", value)}
              id="record_typeDropdown"
              value={formData.record_type}
            >
              {[
                "Medication",
                "Surgery",
                "Disease",
                "Vaccination",
                "Injury",
                "Checkup",
                "Dental",
                "Post-Mortem",
                "Other",
              ].map((option) => (
                <DropdownItem key={option} value={option}>
                  {option}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="additional" className={styles.label}>
                ADDITIONAL NOTES
              </label>
              <textarea
                id="additional"
                name="additional"
                value={formData.additional}
                placeholder="Enter any additional notes or observations"
                onChange={handleChange}
                rows="5"
                maxLength="2000"
                style={{ width: "100%", resize: "vertical" }}
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="button" onClick={() => handleSubmit("add")}>
              ADD
            </button>
            <button type="button" onClick={() => handleSubmit("update")}>
              MODIFY
            </button>
            <button type="button" onClick={() => handleSubmit("delete")}>
              DELETE
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              CLOSE
            </button>
          </div>
        </form>
        {submissionStatus && (
          <p className={styles.statusMessage}>{submissionStatus}</p>
        )}
      </div>
    );
  };

  // Medical History Component
  const MedicalHistoryContent = ({ animal, medicalHistory, onClose }) => {
    return (
      <div className="medical-history-container">
        <h3>Medical History - {animal.animal_name}</h3>

        {medicalHistory.length === 0 ? (
          <p>No medical records found for this animal.</p>
        ) : (
          <div className="medical-history-list">
            {medicalHistory.map((record, index) => (
              <div key={index} className="medical-record-card">
                <div className="record-header">
                  <span className="record-date">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  <span className="record-type">{record.record_type}</span>
                </div>

                <div className="record-details">
                  {record.diagnosis && (
                    <div className="record-field">
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </div>
                  )}

                  {record.treatment && (
                    <div className="record-field">
                      <strong>Treatment:</strong> {record.treatment}
                    </div>
                  )}

                  {record.location && (
                    <div className="record-field">
                      <strong>Location:</strong> {record.location}
                    </div>
                  )}

                  {record.followup && (
                    <div className="record-field">
                      <strong>Follow-up:</strong>{" "}
                      {new Date(record.followup).toLocaleDateString()}
                    </div>
                  )}

                  {record.additional && (
                    <div className="record-field">
                      <strong>Additional Notes:</strong> {record.additional}
                    </div>
                  )}
                </div>

                <div className="record-footer">
                  <button
                    onClick={() => {
                      // Store record data for editing
                      sessionStorage.setItem(
                        "medicalRecordEditData",
                        JSON.stringify(record)
                      );
                      // Open the edit form with this record data
                      setSelectedAnimal(animal);
                      setShowMedicalHistory(false);
                      setShowMedicalFormPopup(true);
                    }}
                    className="edit-record-btn"
                  >
                    Edit Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="popup-footer">
          <button onClick={onClose} className="close-btn">
            Close
          </button>
          <button
            onClick={() => {
              setShowMedicalHistory(false);
              setShowMedicalFormPopup(true);
            }}
            className="new-record-btn"
          >
            Add New Record
          </button>
        </div>
      </div>
    );
  };

  // Render Medical Form Popup
  const renderMedicalFormPopup = () => {
    if (!showMedicalFormPopup || !selectedAnimal) return null;

    return (
      <div className="popup-medicalForm-overlay">
        <div className="popup-content-medical-form">
          <div className="popup-header">
            <h3>Medical Record - {selectedAnimal.animal_name}</h3>
            <button
              className="popup-close"
              onClick={() => setShowMedicalFormPopup(false)}
            >
              ×
            </button>
          </div>
          <div className="popup-body">
            <MedicalFormContent
              animal={selectedAnimal}
              onClose={() => setShowMedicalFormPopup(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render Medical History Popup
  const renderMedicalHistoryPopup = () => {
    if (!showMedicalHistory || !selectedAnimal) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content-medical-history">
          <div className="popup-header">
            <button
              className="popup-close"
              onClick={() => setShowMedicalHistory(false)}
            >
              ×
            </button>
          </div>
          <div className="popup-body">
            <MedicalHistoryContent
              animal={selectedAnimal}
              medicalHistory={medicalHistory}
              onClose={() => setShowMedicalHistory(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderStatusChangePopup = () => {
    if (!popupState.isOpen || !popupState.animal) return null;

    const { animal, nextStatus } = popupState;
    const currentStatus = animal.health_status;
    const isCritical = nextStatus === "CRITICAL";

    const getStatusColor = (status) => {
      switch (status) {
        case "HEALTHY":
          return "#d4edda"; // light green background
        case "NEEDS CARE":
          return "#fff3cd"; // light yellow background
        case "CRITICAL":
          return "#f8d7da"; // light red background
        default:
          return "#ffffff"; // white
      }
    };

    const getStatusTextColor = (status) => {
      switch (status) {
        case "HEALTHY":
          return "#155724"; // dark green text
        case "NEEDS CARE":
          return "#856404"; // dark yellow/brown text
        case "CRITICAL":
          return "#721c24"; // dark red text
        default:
          return "#212529"; // dark gray
      }
    };

    const description = getStatusChangeDescription(currentStatus, nextStatus);

    return (
      <div className="popup-overlay">
        <div className="popup-statusChange-content">
          <div className="popup-header">
            <h3>Update Health Status</h3>
            <button className="popup-close" onClick={closePopup}>
              ×
            </button>
          </div>

          <div className="popup-statusChange-body">
            <div className="animal-name">
              <strong>{animal.animal_name}</strong> ({animal.species})
            </div>

            <div className="status-change">
              <div
                className="status-box"
                style={{
                  backgroundColor: getStatusColor(currentStatus),
                  color: getStatusTextColor(currentStatus),
                }}
              >
                {currentStatus}
              </div>

              <div className="arrow">
                <span>⟶</span>
              </div>

              <div
                className="status-box"
                style={{
                  backgroundColor: getStatusColor(nextStatus),
                  color: getStatusTextColor(nextStatus),
                }}
              >
                {nextStatus}
              </div>
            </div>

            <div className="status-description">{description}</div>
          </div>

          <div className="popup-footer">
            <button
              className="confirm-button"
              onClick={confirmHealthStatusChange}
              style={{
                backgroundColor: "#2c5e4e",
              }}
            >
              Confirm
            </button>
            <button className="cancel-button" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Common style for action buttons
  const actionButtonStyle = {
    marginRight: "8px",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2c5e4e",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  };

  return (
    <div className="critical-animals-report">
      <div className="report-table-container">
        {loading ? (
          <div className="loading-message">Loading data...</div>
        ) : criticalAnimals.length === 0 ? (
          <div className="no-data-message">
            No animals currently need attention.
          </div>
        ) : (
          <table className="animals-table">
            <thead>
              <tr>
                {animalColumnHeaders.map((header, idx) => (
                  <th key={idx}>{header.replace(/_/g, " ").toUpperCase()}</th>
                ))}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {criticalAnimals.map((animal, idx) => (
                <tr key={animal.animal_id || idx}>
                  {animalColumnHeaders.map((header, headerIdx) => (
                    <td key={headerIdx}>{animal[header]}</td>
                  ))}
                  <td>
                    <div className="button-group">
                      <button
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setShowMedicalFormPopup(true);
                        }}
                        style={actionButtonStyle}
                      >
                        Add Record
                      </button>
                      <button
                        onClick={() => handleViewMedicalHistory(animal)}
                        style={actionButtonStyle}
                      >
                        Medical History
                      </button>
                      <button
                        onClick={() => initiateHealthStatusChange(animal)}
                        style={getButtonStyleByStatus(animal.health_status)}
                      >
                        {getButtonTextByStatus(animal.health_status)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {renderStatusChangePopup()}
      {renderMedicalFormPopup()}
      {renderMedicalHistoryPopup()}
    </div>
  );
};

export default CriticalAnimalsReport;
