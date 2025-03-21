import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const AnimalForm = () => {
    const [formData, setFormData] = useState({
        animalName: "",
        dateOfBirth: "",
        enclosureID: "",
        species: "",
        animalType: "",
        healthStatus: "",
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
                animalName: "",
                dateOfBirth: "",
                enclosureID: "",
                species: "",
                animalType: "",
                healthStatus: "",
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
                <InputFields label="ANIMAL NAME" name="animalName" value={formData.animalName} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="DATE OF BIRTH" name="dateOfBirth" value={formData.dateOfBirth} type="date" onChange={handleChange} autocomplete="bday"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="SPECIES" name="species" value={formData.species} onChange={handleChange} pattern="[A-Za-z\s\-]+" autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="animalTypeDropdown" className={styles.label}>ANIMAL TYPE (choose one)</label>
                <Dropdown
                    label={formData.animalType || "Select animal type"}
                    onSelect={(value) => handleSelect("animalType", value)}
                    id="animalTypeDropdown"
                >
                    {["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>

                <label htmlFor="healthStatusDropdown" className={styles.label}>HEALTH STATUS (choose one)</label>
                <Dropdown
                    label={formData.gender || "Select health status"}
                    onSelect={(value) => handleSelect("healthStatus", value)}
                    id="healthStatusDropdown"
                >
                    {["HEALTHY", "NEEDS CARE", "CRITICAL"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className={styles.formRow}>
                <InputFields label="ENCLOSURE ID" name="enclosureID" type="text" value={formData.enclosureID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default AnimalForm;