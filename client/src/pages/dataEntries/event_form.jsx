import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EventForm = () => {
    const [formData, setFormData] = useState({
        eventName: "",
        description: "",
        eventDate: "",
        duration: "",
        location: "",
        eventType: "",
        capacity: "",
        price: "",
        managerID: "",
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
            setSubmissionStatus("Event successfully added.");
            setFormData({
                eventName: "",
                description: "",
                eventDate: "",
                duration: "",
                location: "",
                eventType: "",
                capacity: "",
                price: "",
                managerID: "",
            });
        } else {
            setSubmissionStatus("Failed to add event. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
    }
};

return (
    <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>ADD EVENT</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <InputFields label="EVENT NAME" name="eventName" value={formData.eventName} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
                <InputFields label="PRICE" name="price" type="number" value={formData.price} onChange={handleChange} min="0" max="9999.99" pattern="^\d+(\.\d{1,2})?$" step="0.01" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="EVENT DATE AND TIME" name="eventDate" value={formData.eventDate} type="datetime-local" onChange={handleChange} autocomplete="off"/>
                <InputFields label="DURATION" name="duration" title="Enter duration in HH:MM format" value={formData.duration} onChange={handleChange} type="text" placeholder="HH:MM" pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="LOCATION" name="location" value={formData.location} onChange={handleChange} pattern="[A-Za-z0-9\s\-,]+" autocomplete="off"/>
                <InputFields label="CAPACITY" name="capacity" type="number" value={formData.capacity} onChange={handleChange} min="1" max="10000" pattern="\d+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="MANAGER ID" name="managerID" type="text" value={formData.managerID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="eventTypeStatusDropdown" className={styles.label}>EVENT TYPE (choose one)</label>
                <Dropdown
                    label={formData.eventType || "Select event type"}
                    onSelect={(value) => handleSelect("eventType", value)}
                    id="eventTypeStatusDropdown"
                >
                    {["Educational", "Entertainment", "Seasonal", "Workshops", "Fundraising", "Animal Interaction", "Corporate"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>
            
            <div className={styles.formRow}>
                <textarea name="description" value={formData.description} placeholder="Enter event details" onChange={handleChange} rows="10" maxLength="2000" style={{ width: "100%", resize: "vertical" }} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default EventForm;