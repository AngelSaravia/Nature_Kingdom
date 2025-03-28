import React, { useState } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        Minit_name: "",
        last_name: "",
        user_name: "",
        department_id: "",
        date_of_birth: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        salary: "",
        role: "",
        gender: "",
        email: "",
        phone: "",
        Manager_id: "",
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

    const requiredFields = ["first_name", "last_name", "date_of_birth", "salary", "user_name", "department_id", "role", "gender", "email", "phone"];
    if (requiredFields.some(field => !formData[field]?.trim())) {
        setSubmissionStatus("Please fill out all required fields before submitting.");
        return;
    }

    try {
        const response = await fetch("${API_BASE_URL}/employee_form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSubmissionStatus("Employee successfully added.");
            setFormData({
                first_name: "",
                Minit_name: "",
                last_name: "",
                user_name: "",
                department_id: "",
                date_of_birth: "",
                street_address: "",
                city: "",
                state: "",
                zip_code: "",
                country: "",
                salary: "",
                role: "",
                gender: "",
                email: "",
                phone: "",
                Manager_id: "",
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
                <InputFields label="FIRST NAME *" name="first_name" value={formData.first_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="given-name"/>
                <InputFields label="MIDDLE INITIAL" name="Minit_name" value={formData.Minit_name} onChange={handleChange} maxLength="1" pattern="[A-Za-z]" required={false} autoComplete="additional-name"/>
                <InputFields label="LAST NAME *" name="last_name" value={formData.last_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="family-name"/>
            </div>
            // add user_name and department_id
            <div className={styles.formRow}>
                <InputFields label="USER NAME *" name="user_name" value={formData.user_name} onChange={handleChange} pattern="[A-Za-z0-9_-]+" autoComplete="off"/>
                <InputFields label="DEPARTMENT ID *" name="department_id" type="text" value={formData.department_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="STREET ADDRESS" name="street_address" value={formData.street_address} onChange={handleChange} pattern="[A-Za-z0-9\s]+" required={false} autoComplete="address-line1"/>
                <InputFields label="CITY" name="city" value={formData.city} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="address-level2"/>
                <InputFields label="STATE" name="state" value={formData.state} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="address-level1"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="ZIP CODE" name="zip_code" value={formData.zip_code} onChange={handleChange} type="text" pattern="[0-9]{5}" required={false} autoComplete="postal-code"/>
                <InputFields label="COUNTRY" name="country" value={formData.country} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="country-name"/>
                <InputFields label="SALARY *" name="salary" value={formData.salary} onChange={handleChange} type="text" pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
            </div>

            <div className={styles.formRow}>
                <label htmlFor="roleDropdown" className={styles.label}>ROLE (choose one)</label>
                <Dropdown
                    label={formData.role || "Select role *"}
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
                    label={formData.gender || "Select gender *"}
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
                <InputFields label="DATE OF BIRTH *" name="date_of_birth" value={formData.date_of_birth} type="date" onChange={handleChange} autoComplete="bday"/>
            </div>

            <div className={styles.formRow}>
                <InputFields label="EMAIL *" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email"/>
                <InputFields label="PHONE *" name="phone" type="tel" value={formData.phone} onChange={handleChange} pattern="^(\d{10}|\d{3}-\d{3}-\d{4})$" autoComplete="tel"/>
                <InputFields label="MANAGER ID" name="Manager_id" type="text" value={formData.Manager_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} required={false} autoComplete="off"/>
            </div>

            <button type="submit" className={styles.submitButton}>Submit</button>

            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
    </div>
);
};

export default EmployeeForm;