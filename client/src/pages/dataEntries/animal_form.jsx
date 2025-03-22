import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const AnimalForm = () => {
    const [formData, setFormData] = useState({
        animal_name: "",
        date_of_birth: "",
        enclosure_id: "",
        species: "",
        animal_type: "",
        health_status: "",
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
            setSubmissionStatus("Animal successfully added.");
            setFormData({
                animal_name: "",
                date_of_birth: "",
                enclosure_id: "",
                species: "",
                animal_type: "",
                health_status: "",
            });
        } else {
            setSubmissionStatus("Failed to add animal. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
    }
};

return (
    <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>ADD ANIMAL</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <InputFields label="ANIMAL NAME" name="animal_name" value={formData.animal_name} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="DATE OF BIRTH" name="date_of_birth" value={formData.date_of_birth} type="date" onChange={handleChange} autocomplete="bday"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="SPECIES" name="species" value={formData.species} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="animal_typeDropdown" className={styles.label}>ANIMAL TYPE (choose one)</label>
                <Dropdown
                    label={formData.animal_type || "Select animal type"}
                    onSelect={(value) => handleSelect("animal_type", value)}
                    id="animal_typeDropdown"
                >
                    {["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>

                <label htmlFor="health_statusDropdown" className={styles.label}>HEALTH STATUS (choose one)</label>
                <Dropdown
                    label={formData.health_status || "Select health status"}
                    onSelect={(value) => handleSelect("health_status", value)}
                    id="health_statusDropdown"
                >
                    {["HEALTHY", "NEEDS CARE", "CRITICAL"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className={styles.formRow}>
                <InputFields label="ENCLOSURE ID" name="enclosure_id" type="text" value={formData.enclosure_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default AnimalForm;