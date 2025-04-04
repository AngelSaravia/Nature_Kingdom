import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const MembershipForm = () => {
    const [formData, setFormData] = useState({
        membership_id: "",
        visitor_id: "",
        start_date: "",
        end_date: "",
        max_guests: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_memberships`)
            .then(response => response.json())
            .then(data => {
                if (data.success) setMemberships(data.data);
            })
            .catch(error => console.error("Error fetching memberships:", error));
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

    const handleMembershipSelect = (membership) => {
        const formatDateTime = (dateTime) => {
            if (!dateTime) return "";
            return new Date(dateTime).toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
        };
        const formattedDate = membership.end_date?.split('T')[0];
        setFormData({
            membership_id: membership.membership_id || "",
            visitor_id: membership.visitor_id || "",
            start_date: formattedDate || "",
            end_date: membership.end_date || "",
            max_guests: membership.max_guests || "",
        });
    };

    const handleSubmit = async (action) => {
        if (action !== "delete") {
            const requiredFields = ["membership_id", "visitor_id", "start_date", "end_date", "max_guests"];
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
        if (action === "delete" && !formData.membership_id) {
            setSubmissionStatus("Membership ID is required for deletion");
            return;
        }
        // Format date fields as TIMESTAMP strings
        const formatDateTime = (dateTime) => {
            if (!dateTime) return null;
            return new Date(dateTime).toISOString().slice(0, 19).replace("T", " "); // Format as 'YYYY-MM-DD HH:mm:ss'
        };
        const requestData = { ...formData, start_date: formatDateTime(formData.start_date), };
        if (action === "add") {
            delete requestData.membership_id; // Remove Membership ID for add action
        }

        try {
            const response = await fetch(`${API_BASE_URL}/membership_form`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...requestData, action }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const data = await response.json();
            setSubmissionStatus(result.message);

            if (result.success) {
                if (action === "delete") {
                    const freshResponse = await fetch (`${API_BASE_URL}/get_memberships`);
                    const freshData = await freshResponse.json();
                    if (freshData.success) setMemberships(freshData.data);
                }
                if (action !== "delete") {
                    setFormData({
                        membership_id: "",
                        visitor_id: "",
                        start_date: "",
                        end_date: "",
                        max_guests: "",
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
            <h2 className={styles.formTitle}>MEMBERSHIP DATA ENTRY FORM</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formRow}>
                    <Dropdown
                        label="Select Membership to Modify/Delete"
                        onSelect={(value) => handleMembershipSelect(JSON.parse(value))}
                        selectedLabel={formData.membership_id ? `${formData.start_date} (ID: ${formData.membership_id})` : "Select Membership to Modify/Delete"}
                    >
                        {memberships.map(membership => (
                            <DropdownItem key={membership.membership_id} value={JSON.stringify(membership)}>
                                {membership.start_date} (ID: {membership.membership_id})
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="VISITOR ID *" name="visitor_id" type="text" value={formData.visitor_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
                </div>
                <div className={styles.formRow}> //change to timestamp
                    <InputFields label="START DATE" name="datetime-local" type="date" value={formData.start_date} onChange={handleChange} autoComplete="off"/>
                    <InputFields label="END DATE" name="end_date" type="date" value={formData.end_date} onChange={handleChange} autoComplete="off"/>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="MAX GUESTS" name="max_guests" type="text" value={formData.max_guests} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
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
export default MembershipForm;