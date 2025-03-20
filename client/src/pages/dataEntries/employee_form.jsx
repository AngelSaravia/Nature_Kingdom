import React, {useState} from "react";
import SelectGroup from "./select_buttons.jsx";
import InputFields from "./inputs.jsx";
import styles from "./employee_form.module.css";


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
  
    // For input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleSelect = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: prevData[name] === value ? "" : value, // Toggle selection
        }));
    };
    
    // For form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!formData.firstName || !formData.lastName || !formData.streetAddress || !formData.city || !formData.state || !formData.zipCode || !formData.country || !formData.salary || !formData.role || !formData.gender || !formData.email || !formData.phone || !formData.managerID) {
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
                <InputFields label="FIRST NAME" name="firstName" value={formData.firstName} onChange={handleChange} />
                <InputFields label="MIDDLE INITIAL" name="middleInit" value={formData.middleInit} onChange={handleChange} required={false} />
                <InputFields label="LAST NAME" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className={styles.formRow}>
                <InputFields label="STREET ADDRESS" name="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                <InputFields label="CITY" name="city" value={formData.city} onChange={handleChange} />
                <InputFields label="STATE" name="state" value={formData.state} onChange={handleChange} />
            </div>

            <div className={styles.formRow}>
                <InputFields label="ZIP CODE" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                <InputFields label="COUNTRY" name="country" value={formData.country} onChange={handleChange} />
                <InputFields label="SALARY" name="salary" value={formData.salary} onChange={handleChange} />
            </div>

            <div className={styles.formRow}> 
                <SelectGroup label="ROLE (choose one)" name="role" options={["Manager", "Zookeeper", "Veterinarian", "Maintenance", "Guest Services", "Administrator", "Operator"]} selectedOption={formData.role} onChange={handleSelect} required />
            </div>

            <div className={styles.formRow}> 
                <SelectGroup label="GENDER (choose one)" name="gender" options={["Male", "Female", "Other", "Prefer not to say"]} selectedOption={formData.gender} onChange={handleSelect} required />
            </div>
            
            <div className={styles.formRow}>
                <InputFields label="EMAIL" name="email" type="email" value={formData.email} onChange={handleChange} />
                <InputFields label="PHONE" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                <InputFields label="MANAGER ID" name="managerID" value={formData.managerID} onChange={handleChange} />
            </div>

          <button type="submit" className={styles.submitButton}>Submit</button>
  
          {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
      </div>
    );
  };
  
  export default EmployeeForm;