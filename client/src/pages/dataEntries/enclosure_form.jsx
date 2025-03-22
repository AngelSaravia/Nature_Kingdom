import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EnclosureForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        current_capacity: "",
        capacity: "",
        exhibit_id: "",
        Manager_id: "",
        location: "",
        opens_at: "",
        closes_at: "",
        status: "",
        temp_control: "",
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
                name: "",
                current_capacity: "",
                capacity: "",
                exhibit_id: "",
                Manager_id: "",
                location: "",
                opens_at: "",
                closes_at: "",
                status: "",
                temp_control: "",
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
                <InputFields label="ENCLOSURE NAME" name="name" value={formData.name} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
                <InputFields label="CURRENT CAPACITY" name="current_capacity" value={formData.current_capacity} pattern="[0-9]+" onChange={handleChange} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="MAXIMUM CAPACITY" name="capacity" value={formData.capacity} pattern="[0-9]+" min="0" onChange={handleChange} autocomplete="off"/>
                <InputFields label="LOCATION" name="location" value={formData.location} onChange={handleChange} pattern="[A-Za-z0-9\s\-,]+" required={false} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="OPENING TIME" name="opens_at" type="time" value={formData.opens_at} onChange={handleChange} required={false} autocomplete="off"/>
                <InputFields label="CLOSING TIME" name="closes_at" type="time" value={formData.closes_at} onChange={handleChange} required={false} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px" }}>
                    TEMPERATURE CONTROLLED:
                    <input type="checkbox" name="temp_control" checked={formData.temp_control || false} 
                    onChange={(e) => handleChange({ target: { name: "temp_control", value: e.target.checked } })}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}/></label>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="statusDropdown" className={styles.label}>ENCLOSURE STATUS (choose one)</label>
                <Dropdown
                    label={formData.status || "Select enclosure status"}
                    onSelect={(value) => handleSelect("status", value)}
                    id="statusDropdown"
                >
                    {["active", "inactive", "under maintenance"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className={styles.formRow}>
                <InputFields label="EXHIBIT ID" name="exhibit_id" type="text" value={formData.exhibit_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
                <InputFields label="MANAGER ID" name="Manager_id" type="text" value={formData.Manager_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} required={false} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default EnclosureForm;