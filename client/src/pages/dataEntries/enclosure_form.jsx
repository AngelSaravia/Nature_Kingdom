import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EnclosureForm = () => {
    const [formData, setFormData] = useState({
        enclosureName: "",
        currentCapacity: "",
        maxCapacity: "",
        exhibitID: "",
        managerID: "",
        location: "",
        openingTime: "",
        closingTime: "",
        enclosureStatus: "",
    });

const [submissionStatus, setSubmissionStatus] = useState(null);

// Handle text input changes
const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
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
const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Object.values(formData).every((field) => field.trim() !== "")) {
        setSubmissionStatus("Please fill out all fields before submitting.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5001/submit-employee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSubmissionStatus("Enclosure successfully added.");
            setFormData({
                enclosureName: "",
                currentCapacity: "",
                maxCapacity: "",
                exhibitID: "",
                managerID: "",
                location: "",
                openingTime: "",
                closingTime: "",
                enclosureStatus: "",
            });
        } else {
            setSubmissionStatus("Failed to add enclosure. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
    }
};

return (
    <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>ADD ENCLOSURE</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <InputFields label="ENCLOSURE NAME" name="enclosureName" value={formData.enclosureName} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
                <InputFields label="CURRENT CAPACITY" name="currentCapacity" value={formData.currentCapacity} pattern="[0-9]+" onChange={handleChange} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="MAXIMUM CAPACITY" name="maxCapacity" value={formData.maxCapacity} pattern="[0-9]+" onChange={handleChange} autocomplete="off"/>
                <InputFields label="LOCATION" name="location" value={formData.location} onChange={handleChange} pattern="[A-Za-z0-9\s\-,]+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="OPENING TIME" name="openingTime" type="time" value={formData.openingTime} onChange={handleChange} autocomplete="off"/>
                <InputFields label="CLOSING TIME" name="closingTime" type="time" value={formData.closingTime} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="enclosureStatusDropdown" className={styles.label}>ENCLOSURE STATUS (choose one)</label>
                <Dropdown
                    label={formData.enclosureStatus || "Select enclosure status"}
                    onSelect={(value) => handleSelect("enclosureStatus", value)}
                    id="enclosureStatusDropdown"
                >
                    {["active", "inactive", "under maintenance"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className={styles.formRow}>
                <InputFields label="EXHIBIT ID" name="exhibitID" type="text" value={formData.exhibitID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
                <InputFields label="MANAGER ID" name="managerID" type="text" value={formData.managerID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default EnclosureForm;