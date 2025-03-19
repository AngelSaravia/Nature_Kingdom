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
    const handleChange = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
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
          <InputFields label="FIRST NAME" value={formData.firstName} onChange={(value) => handleChange("firstName", value)} />
          <InputFields label="MIDDLE INITIAL" value={formData.middleInit} onChange={(value) => handleChange("middleInit", value)} />
          <InputFields label="LAST NAME" value={formData.lastName} onChange={(value) => handleChange("lastName", value)} />
          <InputFields label="STREET ADDRESS" value={formData.streetAddress} onChange={(value) => handleChange("streetAddress", value)} />
          <InputFields label="CITY" value={formData.city} onChange={(value) => handleChange("city", value)} />
          <InputFields label="STATE" value={formData.state} onChange={(value) => handleChange("state", value)} />
          <InputFields label="ZIP CODE" value={formData.zipCode} onChange={(value) => handleChange("zipCode", value)} />
          <InputFields label="COUNTRY" value={formData.country} onChange={(value) => handleChange("country", value)} />
          <InputFields label="SALARY" value={formData.salary} onChange={(value) => handleChange("salary", value)} />

          <SelectGroup label="ROLE (choose one)" options={["Manager", "Zookeeper", "Veterinarian", "Maintenance", "Guest Services", "Administrator", "Operator"]} selectedOption={formData.role} onChange={(value) => handleChange("role", value)} />
          <SelectGroup label="GENDER (choose one)" options={["Male", "Female", "Other", "Prefer not to say"]} selectedOption={formData.gender} onChange={(value) => handleChange("gender", value)} />

          <InputFields label="MANAGER ID" value={formData.managerID} onChange={(value) => handleChange("managerID", value)} />
          <InputFields label="EMAIL" type="email" value={formData.email} onChange={(value) => handleChange("email", value)} />
          <InputFields label="PHONE" type="tel" value={formData.phone} onChange={(value) => handleChange("phone", value)} />
  
          <button type="submit" className={styles.submitButton}>Submit</button>
  
          {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </form>
      </div>
    );
  };
  
  export default EmployeeForm;