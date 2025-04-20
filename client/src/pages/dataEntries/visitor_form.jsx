import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const VisitorForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [isEditMode, setIsEditMode] = useState(false); // New state to track if data is being passed

  useEffect(() => {
    console.log("Location object:", location);
    const tupleData =
      location.state?.tuple ||
      JSON.parse(sessionStorage.getItem("visitorEditData") || null);

    if (tupleData) {
      console.log("Loading visitor data:", tupleData);
      setFormData({
        visitor_id: tupleData.visitor_id || "",
        first_name: tupleData.first_name || "",
        Minit_name: tupleData.Minit_name || "",
        last_name: tupleData.last_name || "",
        username: tupleData.username || "",
        password: tupleData.password || "",
        email: tupleData.email || "",
        phone_number: tupleData.phone_number || "",
        date_of_birth: tupleData.date_of_birth
          ? tupleData.date_of_birth.slice(0, 10)
          : "",
        gender: tupleData.gender || "",
        street_address: tupleData.street_address || "",
        city: tupleData.city || "",
        state: tupleData.state || "",
        zipcode: tupleData.zipcode || "",
        country: tupleData.country || "",
        role: tupleData.role || "",
      });
      setIsEditMode(true); // Set edit mode to true if data is passed

      // Clear the sessionStorage after use
      sessionStorage.removeItem("visitorEditData");
    } else {
      console.log("No visitor data found - creating new form");
      setIsEditMode(false); // Set edit mode to false if no data is passed
    }
    fetch(`${API_BASE_URL}/get_visitors`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setVisitors(data.data);
      })
      .catch((error) => console.error("Error fetching visitors:", error));
  }, [location]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("visitorFormState");
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
        "first_name",
        "last_name",
        "email",
        "password",
        "phone_number",
        "date_of_birth",
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = formData[field];
        if (typeof value === "string") {
          return !value.trim();
        } else {
          return value === null || value === undefined || value === "";
        }
      });
      if (missingFields.length > 0) {
        setSubmissionStatus(
          `Please fill out all required fields. Missing: ${missingFields.join(
            ", "
          )}`
        );
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
            first_login: "",
            last_login: "",
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
      <div className={styles.queryReportLink}>
        <Link to="/entryForm/visitors" className={styles.queryReportButton}>
          View Visitors Query Report
        </Link>
      </div>
      <h2 className={styles.formTitle}>VISITOR DATA ENTRY FORM</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formRow}>
          <InputFields
            label="FIRST NAME *"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            pattern="[A-Za-z]+"
            autoComplete="given-name"
          />
          <InputFields
            label="MIDDLE INITIAL"
            name="Minit_name"
            value={formData.Minit_name}
            onChange={handleChange}
            maxLength="1"
            pattern="[A-Za-z]"
            required={false}
            autoComplete="additional-name"
          />
          <InputFields
            label="LAST NAME *"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            pattern="[A-Za-z]+"
            autoComplete="family-name"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="USER NAME *"
            name="username"
            value={formData.username}
            onChange={handleChange}
            pattern="[A-Za-z0-9_-]+"
            autoComplete="off"
          />
          <InputFields
            label="PASSWORD *"
            name="password"
            value={formData.password}
            onChange={handleChange}
            pattern="[A-Za-z0-9_-]+"
            autoComplete="off"
          />
          <InputFields
            label="EMAIL *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="PHONE *"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            pattern="^(\d{10}|\d{3}-\d{3}-\d{4})$"
            autoComplete="tel"
          />
          <InputFields
            label="DATE OF BIRTH *"
            name="date_of_birth"
            value={formData.date_of_birth}
            type="date"
            onChange={handleChange}
            autoComplete="bday"
          />
          <InputFields
            label="STREET ADDRESS"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            pattern="[A-Za-z0-9\s]+"
            required={false}
            autoComplete="address-line1"
          />
        </div>
        //first login and last login will be automated
        <div className={styles.formRow}>
          <InputFields
            label="CITY"
            name="city"
            value={formData.city}
            onChange={handleChange}
            pattern="[A-Za-z\s]+"
            required={false}
            autoComplete="address-level2"
          />
          <InputFields
            label="STATE"
            name="state"
            value={formData.state}
            onChange={handleChange}
            pattern="[A-Za-z\s]+"
            required={false}
            autoComplete="address-level1"
          />
          <InputFields
            label="ZIPCODE"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            pattern="\d{5}"
            required={false}
            autoComplete="postal-code"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="COUNTRY"
            name="country"
            value={formData.country}
            onChange={handleChange}
            pattern="[A-Za-z\s]+"
            required={false}
            autoComplete="country"
          />
          <InputFields
            label="VISITOR ROLE"
            name="role"
            value={formData.role}
            onChange={handleChange}
            pattern="[A-Za-z\s]+"
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="genderDropdown" className={styles.label}>
            GENDER (choose one)
          </label>
          <Dropdown
            label="Select gender *"
            selectedLabel={formData.gender || "Select gender *"}
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
          {isEditMode ? (
            <>
              <button type="button" onClick={() => handleSubmit("update")}>
                MODIFY
              </button>
              <button type="button" onClick={() => handleSubmit("delete")}>
                DELETE
              </button>
            </>
          ) : (
            <button type="button" onClick={() => handleSubmit("add")}>
              ADD
            </button>
          )}
        </div>
        {submissionStatus && (
          <p className={styles.statusMessage}>{submissionStatus}</p>
        )}
      </form>
    </div>
  );
};
export default VisitorForm;
