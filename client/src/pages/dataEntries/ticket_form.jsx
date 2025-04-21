import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import { useLocation, useNavigate, Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const TicketForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ticket_id: "",
    visitor_id: "",
    start_date: "",
    end_date: "",
    price: "",
    ticket_type: "",
    purchase_date: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // New state to track if data is being passed

  useEffect(() => {
    console.log("Location object:", location);
    const tupleData =
      location.state?.tuple ||
      JSON.parse(sessionStorage.getItem("ticketEditData") || null);

    if (tupleData) {
      console.log("Loading ticket data:", tupleData);
      const formatDateTime = (dateTime) => {
        if (!dateTime) return "";
        return new Date(dateTime).toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
      };
      setFormData({
        ticket_id: tupleData.ticket_id || "",
        visitor_id: tupleData.visitor_id || "",
        start_date: formatDateTime(tupleData.start_date) || "",
        end_date: formatDateTime(tupleData.end_date) || "",
        price: tupleData.price || "",
        ticket_type: tupleData.ticket_type || "",
        purchase_date: formatDateTime(tupleData.purchase_date) || "",
      });
      setIsEditMode(true); // Set edit mode to true if data is passed

      // Clear the sessionStorage after use
      sessionStorage.removeItem("ticketEditData");
    } else {
      console.log("No ticket data found - creating new form");
      setIsEditMode(false); // Set edit mode to false if no data is passed
    }
    fetch(`${API_BASE_URL}/get_tickets`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setTickets(data.data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, [location]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("ticketFormState");
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
      const requiredFields = ["visitor_id", "price"];

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
    if (action === "delete" && !formData.ticket_id) {
      setSubmissionStatus("Ticket ID is required for deletion.");
      return;
    }
    // Format date fields as TIMESTAMP strings
    const formatDateTime = (dateTime) => {
      if (!dateTime) return null;
      return new Date(dateTime).toISOString().slice(0, 19).replace("T", " "); // Format as 'YYYY-MM-DD HH:mm:ss'
    };
    const requestData = {
      ...formData,
      start_date: formatDateTime(formData.start_date),
      end_date: formatDateTime(formData.end_date),
      purchase_date: formatDateTime(formData.purchase_date),
    };
    if (action === "add") {
      delete requestData.ticket_id; // Remove ticket_id for add action
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ticket_form`, {
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
          const freshResponse = await fetch(`${API_BASE_URL}/get_tickets`);
          const freshData = await freshResponse.json();
          if (freshData.success) setTickets(freshData.data);
        }
        if (action !== "delete") {
          setFormData({
            ticket_id: "",
            visitor_id: "",
            start_date: "",
            end_date: "",
            price: "",
            ticket_type: "",
            purchase_date: "",
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
        <Link to="/entryForm/tickets" className={styles.queryReportButton}>
          View Ticket Query Report
        </Link>
      </div>
      <h2 className={styles.formTitle}>TICKET DATA ENTRY FORM</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formRow}>
          <InputFields
            label="VISITOR ID *"
            name="visitor_id"
            type="text"
            value={formData.visitor_id}
            onChange={handleChange}
            pattern="[0-9]+"
            onInput={handleNumericInput}
            autoComplete="off"
          />
          <InputFields
            label="PRICE *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            min="0"
            max="9999.99"
            pattern="^\d+(\.\d{1,2})?$"
            step="0.01"
            onInput={handleNumericInput}
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="START DATE"
            name="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={handleChange}
            autoComplete="off"
          />
          <InputFields
            label="END DATE"
            name="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <InputFields
            label="PURCHASE DATE"
            name="purchase_date"
            type="datetime-local"
            value={formData.purchase_date}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="ticketTypeDropdown" className={styles.label}>
            TICKET TYPE (choose one)
          </label>
          <Dropdown
            label="Select ticket type"
            selectedLabel={formData.ticket_type || "Select ticket type"}
            onSelect={(value) => handleSelect("ticket_type", value)}
            id="ticketTypeDropdown"
            value={formData.ticket_type}
          >
            {["Child", "Adult", "Senior", "Group", "Member"].map((option) => (
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
export default TicketForm;
