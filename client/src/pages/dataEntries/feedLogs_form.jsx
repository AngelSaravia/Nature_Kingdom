import React, { useState, useEffect, use } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const FeedLogsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        schedule_id: "",
        animal_id: "",
        enclosure_id: "",
        employee_id: "",
        date: "",
        health_status: "",
        summary: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [feedLogs, setfeedLogs] = useState([]);

    useEffect(() => {
        console.log("Location object:", location);
        const tupleData = location.state?.tuple || JSON.parse(sessionStorage.getItem('feedLogEditData') || null);
        
        if (tupleData) {
            console.log("Loading feed log data:", tupleData);
            // Format date fields as TIMESTAMP strings
            const formatDateTime = (dateTime) => {
                if (!dateTime) return null;
                return new Date(dateTime).toISOString().slice(0, 16); // Format as 'YYYY-MM-DD HH:mm:ss'
            };
            setFormData({
                schedule_id: tupleData.schedule_id || "",
                animal_id: tupleData.animal_id || "",
                enclosure_id: tupleData.enclosure_id || "",
                employee_id: tupleData.employee_id || "",
                date: formatDateTime(tupleData.date) || "",
                health_status: tupleData.health_status || "",
                summary: tupleData.summary || "",
            });
            
            // Clear the sessionStorage after use
            sessionStorage.removeItem('feedLogEditData');
        } else {
            console.log("No feed log data found - creating new form");
        }
        fetch(`${API_BASE_URL}/get_feedLogs`)
            .then(response => response.json())
            .then(data => {
                if (data.success) setfeedLogs(data.data);
            })
            .catch(error => console.error("Error fetching feed logs:", error));
    }, [location]);

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('feedLogFormState');
        };
    }, []);

    // Handle text input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle dropdown selections
    const handleSelect = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handles only numeric input
    const handleNumericInput = (event) => {
        event.target.value = event.target.value.replace(/\D/g, "");
    };

    const handleSubmit = async (action) => {
        if (action !== "delete") {
            const requiredFields = ["animal_id", "enclosure_id", "employee_id", "health_status", "summary"];
            const missingFields = requiredFields.filter(field => {
                const value = formData[field];
                if (typeof value === 'string') {
                    return !value.trim();
                } else {
                    return value === null || value === undefined || value === ""
                }
            });
            if (missingFields.length > 0) {
                setSubmissionStatus({ success: false, message: "Please fill in all required fields." });
                return;
            }
        }
        if (action === "delete" && !formData.schedule_id) {
            setSubmissionStatus({ success: false, message: "Feed schedule ID required for deletion." });
            return;
        }
        
        const requestData = { ...formData, date: formatDateTime(formData.date) };
        if (action === "add") {
            delete requestData.schedule_id; // Remove ticket_id for add action
        }

        try {
            const response = await fetch(`${API_BASE_URL}/feedLog_form`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...requestData, action }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const result = await response.json();
            setSubmissionStatus(result.message);

            if (result.success) {
                if (action === "delete") {
                    const freshResponse = await fetch(`${API_BASE_URL}/get_feedLogs`);
                    const freshData = await freshResponse.json();
                    if (freshData.sucess) setfeedLogs(freshData.data);
                }
                if (action !== "delete") {
                    setFormData({
                        schedule_id: "",
                        animal_id: "",
                        enclosure_id: "",
                        employee_id: "",
                        date: "",
                        health_status: "",
                        summary: "",
                    });
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionStatus({ success: false, message: "Server error. Please try again." });
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>FEED LOGS DATA ENTRY FORM</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                    <InputFields label="ANIMAL ID *" name="animal_id" type="text" value={formData.animal_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
                    <InputFields label="ENCLOSURE ID *" name="enclosure_id" type="text" value={formData.enclosure_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="EMPLOYEE ID *" name="employee_id" type="text" value={formData.employee_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
                    <InputFields label="FEEDING SCHEDULE DATE *" name="date" type="datetime-local" value={formData.date} onChange={handleChange} autoComplete="off"/>
                </div>
                <div className={styles.formRow}>
                <label htmlFor="health_statusDropdown" className={styles.label}>HEALTH STATUS (choose one)</label>
                    <Dropdown
                        label={formData.health_status || "Select health status *"}
                        onSelect={(value) => handleSelect("health_status", value)}
                        id="health_statusDropdown"
                        value={formData.health_status}
                    >
                        {["HEALTHY", "NEEDS CARE", "CRITICAL"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.formRow}>
                    <textarea name="summary" value={formData.summary} placeholder="Enter feed log summary" onChange={handleChange} rows="10" maxLength="2000" style={{ width: "100%", resize: "vertical" }} required={false} autoComplete="off"/>
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
export default FeedLogsForm;