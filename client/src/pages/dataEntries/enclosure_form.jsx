import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const EnclosureForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    enclosure_id: "",
    name: "",
    current_capacity: "",
    capacity: "",
    exhibit_id: "",
    Manager_id: "",
    location: "",
    opens_at: "",
    closes_at: "",
    status: "",
    temp_control: false,
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [enclosures, setEnclosures] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // New state to track if data is being passed

  useEffect(() => {
    console.log("Location object:", location);
    // Try to get data from either location state or sessionStorage
    const tupleData =
      location.state?.tuple ||
      JSON.parse(sessionStorage.getItem("enclosureEditData") || null);

    if (tupleData) {
      console.log("Loading enclosure data:", tupleData);
      setFormData({
        enclosure_id: tupleData.enclosure_id || "",
        name: tupleData.name || "",
        current_capacity: tupleData.current_capacity || "",
        capacity: tupleData.capacity || "",
        exhibit_id: tupleData.exhibit_id || "",
        Manager_id: tupleData.Manager_id || "",
        location: tupleData.location || "",
        opens_at: tupleData.opens_at ? tupleData.opens_at.slice(0, 5) : "",
        closes_at: tupleData.closes_at ? tupleData.closes_at.slice(0, 5) : "",
        status: tupleData.status || "",
        temp_control:
          tupleData.temp_control === 1 || tupleData.temp_control === "Yes",
      });
      setIsEditMode(true); // Set edit mode to true if data is passed

      // Clear the sessionStorage after use
      sessionStorage.removeItem("enclosureEditData");
    } else {
      console.log("No enclosure data found - creating new form");
      setIsEditMode(false); // Set edit mode to false if no data is passed
    }

    // Fetch enclosures data
    fetch(`${API_BASE_URL}/get_enclosures`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEnclosures(data.data);
        } else {
          console.error("Failed to fetch enclosures:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching enclosures:", error));
  }, [location]);

  // Add this cleanup effect near your other effects
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("enclosureFormState");
    };
  }, []); // Empty dependency array means this runs once on unmount

  // Handle text input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "temp_control") {
      setFormData((prevData) => ({
        ...prevData,
        temp_control: value === true,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle dropdown selections
  const handleSelect = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles only numeric input
  const handleNumericInput = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "");
  };

  // Handle form submission
  const handleSubmit = async (action) => {
    if (action !== "delete") {
      const requiredFields = [
        "name",
        "current_capacity",
        "capacity",
        "temp_control",
        "exhibit_id",
      ];
      const missingFields = requiredFields.filter((field) => {
        const value = formData[field];
        return (
          value === undefined ||
          value === null ||
          value === "" ||
          (field === "temp_control" && typeof value !== "boolean")
        );
      });

      if (missingFields.length > 0) {
        setSubmissionStatus(
          `Please fill out all required fields. Missing: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }
    }

    if (action === "delete" && !formData.enclosure_id) {
      setSubmissionStatus("Enclosure ID is required for deletion");
      return;
    }

    const requestData = {
      ...formData,
      temp_control: formData.temp_control ? 1 : 0,
      status: formData.status ? formData.status.replace(" ", "_") : null,
    };
    if (action === "add") {
      delete requestData.enclosure_id; // Remove enclosure_id for add action
    }

    try {
      const response = await fetch(`${API_BASE_URL}/enclosure_form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...requestData, action }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const result = await response.json();
      setSubmissionStatus(result.message);

      if (result.success) {
        if (action === "delete") {
          const freshResponse = await fetch("${API_BASE_URL}/get_enclosures");
          const freshData = await freshResponse.json();
          if (freshData.success) setEnclosures(freshData.data);
        }
        if (action !== "delete") {
          setFormData({
            enclosure_id: "",
            name: "",
            current_capacity: "",
            capacity: "",
            exhibit_id: "",
            Manager_id: "",
            location: "",
            opens_at: "",
            closes_at: "",
            status: "",
            temp_control: false,
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
      <div className={styles.queryReportLink}>
        <Link to="/entryForm/enclosures" className={styles.queryReportButton}>
          View Enclosure Query Report
        </Link>
      </div>
      <h2 className={styles.formTitle}>ENCLOSURE DATA ENTRY FORM</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formRow}>
          <InputFields
            label="ENCLOSURE NAME *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            pattern="[A-Za-z\s\-]+"
            autoComplete="off"
          />
          <InputFields
            label="CURRENT CAPACITY *"
            name="current_capacity"
            value={formData.current_capacity}
            pattern="[0-9]+"
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <InputFields
            label="MAXIMUM CAPACITY *"
            name="capacity"
            value={formData.capacity}
            pattern="[0-9]+"
            min="0"
            onChange={handleChange}
            autoComplete="off"
          />
          <InputFields
            label="LOCATION"
            name="location"
            value={formData.location}
            onChange={handleChange}
            pattern="[A-Za-z0-9\s\-,]+"
            required={false}
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <InputFields
            label="OPENING TIME"
            name="opens_at"
            type="time"
            value={formData.opens_at}
            onChange={handleChange}
            required={false}
            autoComplete="off"
          />
          <InputFields
            label="CLOSING TIME"
            name="closes_at"
            type="time"
            value={formData.closes_at}
            onChange={handleChange}
            required={false}
            autoComplete="off"
          />
        </div>

        <div className={styles.formRow}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "16px",
            }}
          >
            TEMPERATURE CONTROLLED * :
            <input
              type="checkbox"
              name="temp_control"
              checked={formData.temp_control} // || false}
              onChange={(e) =>
                handleChange({
                  target: { name: "temp_control", value: e.target.checked },
                })
              }
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </label>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="statusDropdown" className={styles.label}>
            ENCLOSURE STATUS (choose one)
          </label>
          <Dropdown
            label="Select enclosure status"
            selectedLabel={formData.status || "Select enclosure status"}
            onSelect={(value) => handleSelect("status", value)}
            id="statusDropdown"
            value={formData.status}
          >
            {["active", "inactive", "under_maintenance"].map((option) => (
              <DropdownItem key={option} value={option}>
                {option.replace("_", " ")}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>

        <div className={styles.formRow}>
          <InputFields
            label="EXHIBIT ID *"
            name="exhibit_id"
            type="text"
            value={formData.exhibit_id}
            onChange={handleChange}
            pattern="[0-9]+"
            onInput={handleNumericInput}
            autoComplete="off"
          />
          <InputFields
            label="MANAGER ID"
            name="Manager_id"
            type="text"
            value={formData.Manager_id}
            onChange={handleChange}
            pattern="[0-9]+"
            onInput={handleNumericInput}
            required={false}
            autoComplete="off"
          />
        </div>

        <div className={styles.buttonContainer}>
          {isEditMode ? (
            <>
              <button type="button" onClick={() => handleSubmit("update")}>
                MODIFY
              </button>
              <button type="button" onClick={() => handleSubmit("delete")}>
                DELETE
              </button>
            </>
          ) : (
            <button type="button" onClick={() => handleSubmit("add")}>
              ADD
            </button>
          )}
        </div>

        {submissionStatus && (
          <p className={styles.statusMessage}>{submissionStatus}</p>
        )}
      </form>
    </div>
  );
};

export default EnclosureForm;
