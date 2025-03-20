import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./employee_form.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleInit: "",
        lastName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        salary: "",
        role: "",
        gender: "",
        email: "",
        phone: "",
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
            setSubmissionStatus("Employee successfully added.");
            setFormData({
                firstName: "",
                middleInit: "",
                lastName: "",
                streetAddress: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                salary: "",
                role: "",
                gender: "",
                email: "",
                phone: "",
                managerID: "",
            });
        } else {
            setSubmissionStatus("Failed to add employee. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmissionStatus("Server error. Please try again.");
    }
};

return (
    <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>ADD EMPLOYEE</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
                <InputFields label="FIRST NAME" name="firstName" value={formData.firstName} onChange={handleChange} pattern="[A-Za-z]+" autocomplete="given-name"/>
                <InputFields label="MIDDLE INITIAL" name="middleInit" value={formData.middleInit} onChange={handleChange} maxLength="1" pattern="[A-Za-z]" required={false} autocomplete="additional-name"/>
                <InputFields label="LAST NAME" name="lastName" value={formData.lastName} onChange={handleChange} pattern="[A-Za-z]+" autocomplete="family-name"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="STREET ADDRESS" name="streetAddress" value={formData.streetAddress} onChange={handleChange} pattern="[A-Za-z0-9\s]+" autocomplete="address-line1"/>
                <InputFields label="CITY" name="city" value={formData.city} onChange={handleChange} pattern="[A-Za-z\s]+" autocomplete="address-level2"/>
                <InputFields label="STATE" name="state" value={formData.state} onChange={handleChange} pattern="[A-Za-z\s]+" autocomplete="address-level1"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="ZIP CODE" name="zipCode" value={formData.zipCode} onChange={handleChange} type="text" pattern="[0-9]{5}" autocomplete="postal-code"/>
                <InputFields label="COUNTRY" name="country" value={formData.country} onChange={handleChange} pattern="[A-Za-z\s]+" autocomplete="country-name"/>
                <InputFields label="SALARY" name="salary" value={formData.salary} onChange={handleChange} type="text" pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="roleDropdown" className={styles.label}>ROLE (choose one)</label>
                <Dropdown
                    label={formData.role || "Select a role"}
                    onSelect={(value) => handleSelect("role", value)}
                    id="roleDropdown"
                >
                    {["Manager", "Zookeeper", "Veterinarian", "Maintenance", "Guest Services", "Administrator", "Operator"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>

                <label htmlFor="genderDropdown" className={styles.label}>GENDER (choose one)</label>
                <Dropdown
                    label={formData.gender || "Select gender"}
                    onSelect={(value) => handleSelect("gender", value)}
                    id="genderDropdown"
                >
                    {["Male", "Female", "Other", "Prefer not to say"].map((option) => (
                        <DropdownItem key={option} value={option}>
                            {option}
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className={styles.formRow}>
                <InputFields label="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} autocomplete="email"/>
                <InputFields label="PHONE" name="phone" type="tel" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" autocomplete="tel"/>
                <InputFields label="MANAGER ID" name="managerID" type="text" value={formData.managerID} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autocomplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default EmployeeForm;