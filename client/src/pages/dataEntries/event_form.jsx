import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EventForm = () => {
    const [formData, setFormData] = useState({
        eventID: "",
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
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5004/get_events")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.data);
                } else {
                    console.error("Failed to fetch events:", data.message);
                }
            })
            .catch(error => console.error("Error fetching events:", error));
    }, []);

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

    const handleEventSelect = (event) => {
        const formattedDate = event.eventDate?.split('T')[0];
        setFormData({
            eventID: event.eventID || "",
            eventName: event.eventName || "",
            description: event.description || "",
            eventDate: formattedDate || "",
            duration: event.duration || "",
            location: event.location || "",
            eventType: event.eventType || "",
            capacity: event.capacity || "",
            price: event.price || "",
            managerID: event.managerID || "",
        });
    };

    // Handle form submission
    const handleSubmit = async (action) => {
        if (action !== "delete"){
            const requiredFields = ["eventName", "eventDate", "location", "eventType", "price"];
            const missingFields = requiredFields.filter(field => {
                const value = formData[field];
                return value === undefined || value === null || value === "";
            });
            if (missingFields.length > 0) {
                setSubmissionStatus(`Please fill out all required fields. Missing: ${missingFields.join(', ')}`);
                return;
            }
        }

        if (action === "delete" && !formData.eventID) {
            setSubmissionStatus("Event ID is required for deletion");
            return;
        }
        const requestData = { ...formData };
        if (action === "add") {
            delete requestData.eventID; // Remove eventID for add action
        }

        try {
            const response = await fetch("http://localhost:5004/event_form", { //const response = await fetch("${API_BASE_URL}/event_form", {
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
                    const freshResponse = await fetch ("http://localhost:5004/get_events");
                    const freshData = await freshResponse.json();
                    if (freshData.success) setEvents(freshData.data);
                }
                if (action !== "delete") {
                    setFormData({
                        eventID: "",
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
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionStatus("Server error. Please try again.");
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>EVENT DATA ENTRY FORM</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                    <Dropdown
                        label="Select Event to Modify/Delete"
                        onSelect={(value) => handleEventSelect(JSON.parse(value))}
                        selectedLabel={formData.eventID ? `${formData.eventName} (ID: ${formData.eventID})` : "Select Event to Modify/Delete"}
                    >
                        {events.map((event, index) => (
                            <DropdownItem key={event.eventID || `event-${index}`} value={JSON.stringify(event)}>
                                {event.eventName} (ID: {event.eventID})
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="EVENT NAME *" name="eventName" value={formData.eventName} onChange={handleChange} pattern="[A-Za-z\s\-]+" autoComplete="off"/>
                    <InputFields label="PRICE *" name="price" type="number" value={formData.price} onChange={handleChange} min="0" max="9999.99" pattern="^\d+(\.\d{1,2})?$" step="0.01" onInput={handleNumericInput} autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="EVENT DATE AND TIME *" name="eventDate" value={formData.eventDate} type="datetime-local" onChange={handleChange} autoComplete="off"/>
                    <InputFields label="DURATION (HH:MM)" name="duration" title="Enter duration in HH:MM format" value={formData.duration} onChange={handleChange} type="text" placeholder="HH:MM" pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$" required={false} autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="LOCATION *" name="location" value={formData.location} onChange={handleChange} pattern="[A-Za-z0-9\s\-,]+" autoComplete="off"/>
                    <InputFields label="CAPACITY" name="capacity" type="number" value={formData.capacity} onChange={handleChange} min="1" max="10000" pattern="\d+" required={false} autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="MANAGER ID" name="managerID" type="text" value={formData.managerID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} required={false} autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="eventTypeStatusDropdown" className={styles.label}>EVENT TYPE (choose one)</label>
                    <Dropdown
                        label={formData.eventType || "Select event type *"}
                        onSelect={(value) => handleSelect("eventType", value)}
                        id="eventTypeStatusDropdown"
                        value={formData.eventType}
                    >
                        {["Educational", "Entertainment", "Seasonal", "Workshops", "Fundraising", "Animal Interaction", "Corporate"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                
                <div className={styles.formRow}>
                    <textarea name="description" value={formData.description} placeholder="Enter event details" onChange={handleChange} rows="10" maxLength="2000" style={{ width: "100%", resize: "vertical" }} required={false} autoComplete="off"/>
                </div>

                <div className={styles.buttonContainer}>
                    <button type="button" onClick={() => handleSubmit("add")}>ADD</button>
                    <button type="button" onClick={() => handleSubmit("update")}>MODIFY</button>
                    <button type="button" onClick={() => handleSubmit("delete")}>DELETE</button>
                </div>

                {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
            </form>
        </div>
    );
};

export default EventForm;