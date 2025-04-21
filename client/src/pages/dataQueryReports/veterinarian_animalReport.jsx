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

// Define available health status options
const HEALTH_STATUS_OPTIONS = ["HEALTHY", "NEEDS CARE", "CRITICAL"];

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
        `${API_BASE_URL}/entryForm/enclosures`,
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

  // Function to handle health status selection from dropdown
  const handleHealthStatusSelect = (animal, newStatus) => {
    if (newStatus !== animal.health_status) {
      setPopupState({
        isOpen: true,
        animal: animal,
        nextStatus: newStatus,
      });
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

  const confirmHealthStatusChange = () => {
    if (popupState.animal) {
      handleHealthStatusUpdate(popupState.animal, popupState.nextStatus);

      window.location.reload();
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

  // Updated function to handle direct status updates
  const handleHealthStatusUpdate = async (animal, newStatus) => {
    setUpdateLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/animals/${animal.animal_id}/health`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ healthStatus: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the status in our local state
        setCriticalAnimals((prevAnimals) =>
          prevAnimals.map((a) =>
            a.animal_id === animal.animal_id
              ? { ...a, health_status: newStatus }
              : a
          )
        );

        console.log(`Health status updated to ${newStatus}`);
      } else {
        console.error("Failed to update health status:", data.message);
        alert("Failed to update health status: " + data.message);
      }
    } catch (error) {
      console.error("Failed to update health status:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Fetch medical history for an animal
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);

  const handleViewMedicalHistory = async (animal) => {
    try {
      // Set loading state if needed
      setSelectedAnimal(animal);

      const response = await fetch(
        `${API_BASE_URL}/medical_records/animal/${animal.animal_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store the medical records for this specific animal
        setMedicalHistory(data.data);
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

  const formatDateYMD = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Replace the entire MedicalFormContent component with this version
  const MedicalFormContent = ({ animal, onClose }) => {
    // Check if there's record data stored in sessionStorage
    const storedRecordData = sessionStorage.getItem("medicalRecordEditData");
    const initialRecordData = storedRecordData
      ? JSON.parse(storedRecordData)
      : null;

    const [formData, setFormData] = useState({
      record_id: initialRecordData ? initialRecordData.record_id : "",
      animal_id: animal ? animal.animal_id : "",
      employee_id: initialRecordData ? initialRecordData.employee_id : "",
      enclosure_id: animal ? animal.enclosure_id : "",
      location: initialRecordData ? initialRecordData.location : "",
      date: initialRecordData
        ? formatDateYMD(initialRecordData.date)
        : formatDateYMD(new Date()),
      record_type: initialRecordData ? initialRecordData.record_type : "",
      diagnosis: initialRecordData ? initialRecordData.diagnosis : "",
      treatment: initialRecordData ? initialRecordData.treatment : "",
      followup: initialRecordData
        ? formatDateYMD(initialRecordData.followup)
        : "",
      additional: initialRecordData ? initialRecordData.additional : "",
    });

    // Clear the stored record data after loading it
    useEffect(() => {
      if (storedRecordData) {
        sessionStorage.removeItem("medicalRecordEditData");
      }
    }, []);

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

    // New simple handleChange function without any filtering
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle dropdown selections
    const handleSelect = (name, value) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // After successful submission, refresh related data
    const handleAfterSubmit = async () => {
      // Clear form and reload data
      fetchCriticalAnimals();

      // If user is viewing medical history for an animal, refresh that too
      if (selectedAnimal) {
        handleViewMedicalHistory(selectedAnimal);
      }
    };

    // Handle form submission with validation
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

        // Validate numeric fields only at submission time
        if (!/^\d*$/.test(formData.employee_id)) {
          setSubmissionStatus("Employee ID must contain only numbers.");
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

          // After successful submit, refresh data
          handleAfterSubmit();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
      }
    };

    // Simplified InputField Component without onInput handler
    const InputField = ({
      label,
      name,
      type,
      value,
      onChange,
      autoComplete,
      disabled,
      placeholder,
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
            value={value || ""}
            onChange={onChange}
            className={styles.input}
            autoComplete={autoComplete || "off"}
            disabled={disabled}
            placeholder={placeholder || ""}
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
              autoComplete="off"
              disabled={animal ? true : false}
            />
            <InputField
              label="EMPLOYEE ID *"
              name="employee_id"
              type="text"
              value={formData.employee_id}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter employee ID"
            />
          </div>
          <div className={styles.formRow}>
            <InputField
              label="ENCLOSURE ID *"
              name="enclosure_id"
              type="text"
              value={formData.enclosure_id}
              onChange={handleChange}
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
              placeholder="Enter location"
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
                value={formData.diagnosis || ""}
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
                value={formData.treatment || ""}
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
                value={formData.additional || ""}
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
  // Medical History Component with enhanced display
  const MedicalHistoryContent = ({ animal, medicalHistory, onClose }) => {
    return (
      <div className="medical-history-container">
        <h3>
          Medical History - {animal.animal_name} (ID: {animal.animal_id})
        </h3>

        {medicalHistory.length === 0 ? (
          <p>No medical records found for this animal.</p>
        ) : (
          <div className="medical-history-list">
            {medicalHistory.map((record, index) => (
              <div
                key={record.record_id || index}
                className="medical-record-card"
              >
                <div className="record-header">
                  <span className="record-date">
                    {formatDateYMD(record.date)}
                  </span>
                  <span className="record-type">{record.record_type}</span>
                  <span className="record-id">
                    Record ID: {record.record_id}
                  </span>
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
                      {formatDateYMD(record.followup)}
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
            <h3 className="update-title">Update Health Status</h3>
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
                <tr
                  key={animal.animal_id || idx}
                  style={{ backgroundColor: "#000000" }}
                >
                  <td className="animal-name-cell">{animal.animal_name}</td>
                  <td className="species-cell">{animal.species}</td>
                  <td className="animal-type-cell">{animal.animal_type}</td>
                  <td
                    className="health-status-cell"
                    data-status={animal.health_status}
                  >
                    {animal.health_status}
                  </td>
                  <td className="date-cell">
                    {formatDateYMD(animal.date_of_birth)}
                  </td>
                  <td className="enclosure-cell">{animal.enclosure_name}</td>
                  <td className="actions-cell">
                    <div className="button-group-actions">
                      <button
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setShowMedicalFormPopup(true);
                        }}
                        className="add-record-btn"
                      >
                        Add Record
                      </button>
                      <button
                        onClick={() => handleViewMedicalHistory(animal)}
                        className="medical-history-btn"
                      >
                        Medical History
                      </button>

                      <div className="form-group">
                        <select
                          value={animal.health_status}
                          onChange={(e) =>
                            handleHealthStatusSelect(animal, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Health Status
                          </option>
                          {HEALTH_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status === "HEALTHY"
                                ? "Mark as Healthy"
                                : status === "NEEDS CARE"
                                ? "Mark as Needs Care"
                                : "Mark as Critical"}
                            </option>
                          ))}
                        </select>
                      </div>
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
