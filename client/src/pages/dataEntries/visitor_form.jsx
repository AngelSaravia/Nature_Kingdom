import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const VisitorForm = () => {
    const [formData, setFormData] = useState({
        visitor_id: "",
        first_name: "",
        Minit_name: "",
        last_name: "",
        username: "",
        password: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        street_address: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        role: "",
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_visitors`)
            .then(response => response.json())
            .then(data => {
                if (data.success) setVisitors(data.data);
            })
            .catch(error => console.error("Error fetching visitors:", error));
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

    const handleVisitorSelect = (visitor) => {
        const formattedDate = visitor.date_of_birth?.split('T')[0];
        setFormData({
            visitor_id: visitor.visitor_id || "",
            first_name: visitor.first_name || "",
            Minit_name: visitor.Minit_name || "",
            last_name: visitor.last_name || "",
            username: visitor.username || "",
            password: visitor.password || "",
            email: visitor.email || "",
            phone_number: visitor.phone_number || "",
            date_of_birth: formattedDate || "",
            gender: visitor.gender || "",
            street_address: visitor.street_address || "",
            city: visitor.city || "",
            state: visitor.state || "",
            zipcode: visitor.zipcode || "",
            country: visitor.country || "",
            role: visitor.role || "",
        });
    };

    // Handle form submission
    const handleSubmit = async (action) => {
        if (action !== "delete") {
            const requiredFields = [
                'first_name', 'last_name', 'email', 'password', 'phone_number', 'date_of_birth'
            ];

            const missingFields = requiredFields.filter(field => {
                const value = formData[field];
                if (typeof value === 'string') {
                    return !value.trim();
                } else {
                    return value === null || value === undefined || value === ""
                }
            });
            if (missingFields.length > 0) {
                setSubmissionStatus(`Please fill out all required fields. Missing: ${missingFields.join(', ')}`);
                return;
            }
        }

        if (action === "delete" && !formData.visitor_id) {
            setSubmissionStatus("Visitor ID is required for deletion");
            return;
        }

        const requestData = { ...formData };
        if (action === "add") {
            delete requestData.visitor_id; // Remove visitor_id for add action
        }

        try {
            const response = await fetch(`${API_BASE_URL}/visitor_form`, {
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
                    const freshResponse = await fetch(`${API_BASE_URL}/get_visitors`);
                    const freshData = await freshResponse.json();
                    if (freshData.success) setVisitors(freshData.data);
                }
                if (action !== "delete") {
                    setFormData({
                        visitor_id: "",
                        first_name: "",
                        Minit_name: "",
                        last_name: "",
                        username: "",
                        password: "",
                        email: "",
                        phone_number: "",
                        date_of_birth: "",
                        gender: "",
                        street_address: "",
                        city: "",
                        state: "",
                        zipcode: "",
                        country: "",
                        role: "",
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
            <h2 className={styles.formTitle}>VISITOR DATA ENTRY FORM</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                    <Dropdown
                        label="Select Visitor to Modify/Delete"
                        onSelect={(value) => handleVisitorSelect(JSON.parse(value))}
                        selectedLabel={formData.visitor_id ? `${formData.first_name} (ID: ${formData.visitor_id})` : "Select Visitor to Modify/Delete"}
                    >
                        {visitors.map(visitor => (
                            <DropdownItem key={visitor.visitor_id} value={JSON.stringify(visitor)}>
                                {visitor.first_name} (ID: {visitor.visitor_id})
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="FIRST NAME *" name="first_name" value={formData.first_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="given-name"/>
                    <InputFields label="MIDDLE INITIAL" name="Minit_name" value={formData.Minit_name} onChange={handleChange} maxLength="1" pattern="[A-Za-z]" required={false} autoComplete="additional-name"/>
                    <InputFields label="LAST NAME *" name="last_name" value={formData.last_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="family-name"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="USER NAME *" name="username" value={formData.username} onChange={handleChange} pattern="[A-Za-z0-9_-]+" autoComplete="off"/>
                    <InputFields label="PASSWORD *" name="password" value={formData.password} onChange={handleChange} pattern="[A-Za-z0-9_-]+" autoComplete="off"/>
                    <InputFields label="EMAIL *" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="PHONE *" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} pattern="^(\d{10}|\d{3}-\d{3}-\d{4})$" autoComplete="tel"/>
                    <InputFields label="DATE OF BIRTH *" name="date_of_birth" value={formData.date_of_birth} type="date" onChange={handleChange} autoComplete="bday"/>
                    <InputFields label="STREET ADDRESS" name="street_address" value={formData.street_address} onChange={handleChange} pattern="[A-Za-z0-9\s]+" required={false} autoComplete="address-line1"/>
                </div>
                //first login and last login will be automated
                <div className={styles.formRow}>
                    <InputFields label="CITY" name="city" value={formData.city} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="address-level2"/>
                    <InputFields label="STATE" name="state" value={formData.state} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="address-level1"/>
                    <InputFields label="ZIPCODE" name="zipcode" value={formData.zipcode} onChange={handleChange} pattern="\d{5}" required={false} autoComplete="postal-code"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="COUNTRY" name="country" value={formData.country} onChange={handleChange} pattern="[A-Za-z\s]+" required={false} autoComplete="country"/>
                    <InputFields label="VISITOR ROLE" name="role" value={formData.role} onChange={handleChange} pattern="[A-Za-z\s]+" autoComplete="off"/>
                </div>
                <div className={styles.formRow}>
                <label htmlFor="genderDropdown" className={styles.label}>GENDER (choose one)</label>
                    <Dropdown
                        label={formData.gender || "Select gender *"}
                        onSelect={(value) => handleSelect("gender", value)}
                        id="genderDropdown"
                        value={formData.gender}
                    >
                        {["Male", "Female", "Other", "Prefer not to say"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={() => handleSubmit("add")}>ADD</button>
                    <button onClick={() => handleSubmit("update")}>MODIFY</button>
                    <button onClick={() => handleSubmit("delete")}>DELETE</button>
                </div>
                {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
            </form>
        </div>
    );

};
export default VisitorForm;