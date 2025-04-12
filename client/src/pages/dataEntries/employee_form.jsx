import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Employee_id: "",
        first_name: "",
        Minit_name: "",
        last_name: "",
        user_name: "",
        password: "",
        department_id: "",
        date_of_birth: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        salary: "",
        gender: "",
        email: "",
        phone: "",
        Manager_id: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        console.log("Location object:", location);
        const tupleData = location.state?.tuple || JSON.parse(sessionStorage.getItem('employeeEditData') || null);
        
        if (tupleData) {
            console.log("Loading employee data:", tupleData);
            setFormData({
                Employee_id: tupleData.Employee_id || "",
                first_name: tupleData.first_name || "",
                Minit_name: tupleData.Minit_name || "",
                last_name: tupleData.last_name || "",
                user_name: tupleData.user_name || "",
                password: tupleData.password || "",
                department_id: tupleData.department_id || "",
                date_of_birth: tupleData.date_of_birth ? tupleData.date_of_birth.slice(0, 10) : "",
                street_address: tupleData.street_address || "",
                city: tupleData.city || "",
                state: tupleData.state || "",
                zip_code: tupleData.zip_code || "",
                country: tupleData.country || "",
                salary: tupleData.salary || "",
                gender: tupleData.gender || "",
                email: tupleData.email || "",
                phone: tupleData.phone || "",
                Manager_id: tupleData.Manager_id || "",
            });
            
            // Clear the sessionStorage after use
            sessionStorage.removeItem('employeeEditData');
        } else {
            console.log("No employee data found - creating new form");
        }
        fetch(`${API_BASE_URL}/get_employees`)
            .then(response => response.json())
            .then(data => {
                if (data.success) setEmployees(data.data);
            })
            .catch(error => console.error("Error fetching employees:", error));
    }, [location]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('employeeFormState');
        };
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

    // Handle form submission
    const handleSubmit = async (action) => {
        if (action !== "delete") {
            const requiredFields = [
                'first_name', 'last_name', 'date_of_birth', 'salary',
                'user_name', 'password', 'department_id', 'gender', 'email', 'phone'
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
        
        if (action === "delete" && !formData.Employee_id) {
            setSubmissionStatus("Employee ID is required for deletion");
            return;
        }

        const requestData = { ...formData };
        if (action === "add") {
            delete requestData.Employee_id; // Remove Employee_id for add action
        }

        try {
            const response = await fetch(`${API_BASE_URL}/employee_form`, { //const response = await fetch("${API_BASE_URL}/employee_form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...requestData, action}),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const result = await response.json();
            setSubmissionStatus(result.message);

            if (result.success) {
                if (action === "delete") {
                    const freshResponse = await fetch (`${API_BASE_URL}/get_employees`);
                    const freshData = await freshResponse.json();
                    if (freshData.success) setEmployees(freshData.data);
                }
                if (action !== "delete") {
                    setFormData({
                        Employee_id: "",
                        first_name: "",
                        Minit_name: "",
                        last_name: "",
                        user_name: "",
                        password: "",
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
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionStatus("Server error. Please try again.");
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>EMPLOYEE DATA ENTRY FORM</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                    <InputFields label="FIRST NAME *" name="first_name" value={formData.first_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="given-name"/>
                    <InputFields label="MIDDLE INITIAL" name="Minit_name" value={formData.Minit_name} onChange={handleChange} maxLength="1" pattern="[A-Za-z]" required={false} autoComplete="additional-name"/>
                    <InputFields label="LAST NAME *" name="last_name" value={formData.last_name} onChange={handleChange} pattern="[A-Za-z]+" autoComplete="family-name"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="USER NAME *" name="user_name" value={formData.user_name} onChange={handleChange} pattern="[A-Za-z0-9_-]+" autoComplete="off"/>
                    <InputFields label="PASSWORD *" name="password" value={formData.password} onChange={handleChange} pattern="[A-Za-z0-9_-]+" autoComplete="off"/>
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
                    {/*<label htmlFor="roleDropdown" className={styles.label}>ROLE (choose one)</label>
                     <Dropdown
                        label={formData.role || "Select role *"}
                        onSelect={(value) => handleSelect("role", value)}
                        id="roleDropdown"
                        value={formData.role}
                    >
                        {["Manager", "Zookeeper", "Veterinarian", "Maintenance", "Guest Services", "Administrator", "Operator"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown> */}

                    <label htmlFor="genderDropdown" className={styles.label}>GENDER (choose one)</label>
                    <Dropdown
                        label="Select gender *"
                        selectedLabel={formData.gender || "Select gender *"} // Pass selectedLabel
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

                <div className={styles.formRow}>
                    <InputFields label="DATE OF BIRTH *" name="date_of_birth" value={formData.date_of_birth} type="date" onChange={handleChange} autoComplete="bday"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="EMAIL *" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email"/>
                    <InputFields label="PHONE *" name="phone" type="tel" value={formData.phone} onChange={handleChange} pattern="^(\d{10}|\d{3}-\d{3}-\d{4})$" autoComplete="tel"/>
                    <InputFields label="MANAGER ID" name="Manager_id" type="text" value={formData.Manager_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} required={false} autoComplete="off"/>
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

export default EmployeeForm;