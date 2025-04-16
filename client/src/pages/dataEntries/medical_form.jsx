import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const MedicalForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    record_id: "",
    animal_id: "",
    employee_id: "",
    enclosure_id: "",
    location: "",
    date: "",
    record_type: "",
    diagnosis: "",
    treatment: "",
    followup: "",
    additional: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    console.log("Location object:", location);
    const tupleData =
      location.state?.tuple ||
      JSON.parse(sessionStorage.getItem("medicalRecordEditData") || null);

    if (tupleData) {
      console.log("Loading medical record data:", tupleData);
      setFormData({
        record_id: tupleData.record_id || "",
        animal_id: tupleData.animal_id || "",
        employee_id: tupleData.employee_id || "",
        enclosure_id: tupleData.enclosure_id || "",
        location: tupleData.location || "",
        date: tupleData.date ? tupleData.date.slice(0, 10) : "",
        record_type: tupleData.record_type || "",
        diagnosis: tupleData.diagnosis || "",
        treatment: tupleData.treatment || "",
        followup: tupleData.followup ? tupleData.followup.slice(0, 10) : "",
        additional: tupleData.additional || "",
      });

      // Clear the sessionStorage after use
      sessionStorage.removeItem("medicalRecordEditData");
    } else {
      console.log("No medical record data found - creating new form");
    }
    fetch(`${API_BASE_URL}/get_medical_records`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setRecords(data.data);
      })
      .catch((error) => console.error("Error fetching records:", error));
  }, [location]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("medicalRecordFormState");
    };
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
      const missingFields = requiredFields.filter((field) => !formData[field]);
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
      setSubmissionStatus("medical record ID is required for deletion.");
      return;
    }
    const requestData = { ...formData };
    if (action === "add") {
      delete requestData.record_id; //remove record_id for add action
    }
    console.log("Action:", action, "Request Data:", requestData);

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
            animal_id: "",
            employee_id: "",
            enclosure_id: "",
            location: "",
            date: "",
            record_type: "",
            diagnosis: "",
            treatment: "",
            followup: "",
            additional: "",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("Server error. Please try again.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>MEDICAL RECORD DATA ENTRY FORM</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formRow}>
          <InputFields
            label="ANIMAL ID *"
            name="animal_id"
            type="number"
            value={formData.animal_id}
            onChange={handleChange}
            onInput={handleNumericInput}
            autoComplete="off"
          />
          <InputFields
            label="EMPLOYEE ID *"
            name="employee_id"
            type="number"
            value={formData.employee_id}
            onChange={handleChange}
            onInput={handleNumericInput}
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="ENCLOSURE ID *"
            name="enclosure_id"
            type="number"
            value={formData.enclosure_id}
            onChange={handleChange}
            onInput={handleNumericInput}
            autoComplete="off"
          />
          <InputFields
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
              required={false}
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
              required={false}
              autoComplete="off"
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="DATE OF RECORD"
            name="date"
            value={formData.date}
            type="date"
            onChange={handleChange}
            autoComplete="bday"
          />
          <InputFields
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
            RECORD TYPE (choose one)
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
              required={false}
              autoComplete="off"
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button type="add-button" onClick={() => handleSubmit("add")}>
            ADD
          </button>
          <button type="modify-button" onClick={() => handleSubmit("update")}>
            MODIFY
          </button>
          <button type="delete-button" onClick={() => handleSubmit("delete")}>
            DELETE
          </button>
        </div>
      </form>
      {submissionStatus && (
        <p className={styles.statusMessage}>{submissionStatus}</p>
      )}
    </div>
  );
};
export default MedicalForm;
