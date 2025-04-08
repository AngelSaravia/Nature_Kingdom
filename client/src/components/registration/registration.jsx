import React, { useState } from "react";
import axios from "axios";
import "./registration.css"; // Make sure to create this CSS file
const API_BASE_URL = import.meta.env.VITE_API_URL;

function Registration() {
  // Form state management
  const [formData, setFormData] = useState({
    first_name: "",
    Minit_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    date_of_birth: "",
    state: "",
    country: "",
    zipcode: "",
    street_address: "",
    city: "",
    phone_number: "",
    gender: "",
  });

  // Validation and UI states
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ message: "", type: "" });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate the form
  const validateForm = () => {
    let errors = {};

    //username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters";
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.username)) {
      errors.username =
        "Username can only contain letters, numbers, hyphens, and underscores";
    }

    //password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }

    // First name validation
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.first_name)) {
      errors.first_name = "First name should contain only letters";
    }

    // Middle name validation (optional)
    if (formData.Minit_name && !/^[A-Za-z\s]*$/.test(formData.Minit_name)) {
      errors.Minit_name = "Middle name should contain only letters";
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) {
      errors.last_name = "Last name should contain only letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Age validation
    if (!formData.date_of_birth) {
      errors.date_of_birth = "Date of Birth is required";
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const currentDate = new Date();
    
      // Check if it's a valid date
      if (isNaN(birthDate.getTime())) {
        errors.date_of_birth = "Please enter a valid Date of Birth";
      } else {
        // Calculate the age by comparing the birthdate with the current date
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const birthMonth = birthDate.getMonth(); // Birth month (0-indexed)
        const currentMonth = currentDate.getMonth(); // Current month (0-indexed)
    
        // If the birthday hasn't occurred yet this year (considering month and day)
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
          age--;  // Subtract 1 if the birthday hasn't passed yet this year
        }
    
        // Validate age range: 0 to 120
        if (age < 0 || age > 120) {
          errors.date_of_birth = "Please enter a valid Date of Birth";
        }
      }
    }

    // phone_number validation
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      errors.phone_number = "Please enter a valid 10-digit mobile number";
    }

    // Address validation
    if (!formData.street_address.trim()) {
      errors.street_address = "Address is required";
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    // State validation
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    // Zipcode validation
    if (!formData.zipcode.trim()) {
      errors.zipcode = "Zip code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
      errors.zipcode =
        "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
    }
    
    if (!formData.gender) {
      errors.gender = "Gender selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      first_name: "",
      Minit_name: "",
      last_name: "",
      username: "",
      password: "",
      email: "",
      date_of_birth: "",
      state: "",
      country: "",
      zipcode: "",
      street_address: "",
      city: "",
      phone_number: "",
    });
    setFormErrors({});
    setSubmitStatus({ message: "", type: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous status message
    setSubmitStatus({ message: "", type: "" });

    if (validateForm()) {
      setIsSubmitting(true);

      const correctedFormData = {
        ...formData,
        date_of_birth: new Date(formData.date_of_birth).toISOString().split('T')[0], 
      };

      try {
        // You can change the endpoint URL as needed

        console.log(correctedFormData);
        console.log(formData);
        const response = await axios.post(
          `${API_BASE_URL}/signup`,
          correctedFormData
        );
        setSubmitStatus({
          message: "Registration successful!",
          type: "success",
        });
        resetForm();
      } catch (error) {
        console.error("Registration failed:", error);

        // Handle different error scenarios
        let errorMessage = "Registration failed. Please try again.";

        if (error.response) {
          // The server responded with an error status
          errorMessage = error.response.data.message || errorMessage;
          console.error("Server response:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage =
            "No response from server. Please check your connection.";
        }

        setSubmitStatus({ message: errorMessage, type: "error" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Form has validation errors, focus on the first error field
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration Form</h2>

      {submitStatus.message && (
        <div className={`status-message ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={formErrors.username ? "error" : ""}
          />
          {formErrors.username && (
            <span className="error-text">{formErrors.username}</span>
          )}
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={formErrors.password ? "error" : ""}
          />
          {formErrors.password && (
            <span className="error-text">{formErrors.password}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={formErrors.first_name ? "error" : ""}
            />
            {formErrors.first_name && (
              <span className="error-text">{formErrors.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="Minit_name"
              value={formData.Minit_name}
              onChange={handleChange}
              className={formErrors.Minit_name ? "error" : ""}
            />
            {formErrors.Minit_name && (
              <span className="error-text">{formErrors.Minit_name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={formErrors.last_name ? "error" : ""}
            />
            {formErrors.last_name && (
              <span className="error-text">{formErrors.last_name}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
              placeholder="example@email.com"
            />
            {formErrors.email && (
              <span className="error-text">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Mobile *</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={formErrors.phone_number ? "error" : ""}
              placeholder="1234567890"
            />
            {formErrors.phone_number && (
              <span className="error-text">{formErrors.phone_number}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={formErrors.date_of_birth ? "error" : ""}
          />
          {formErrors.date_of_birth && (
            <span className="error-text">{formErrors.date_of_birth}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Address *</label>
            <textarea
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              className={formErrors.street_address ? "error" : ""}
              rows="3"
            />
            {formErrors.street_address && (
              <span className="error-text">{formErrors.street_address}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={formErrors.city ? "error" : ""}
            />
            {formErrors.city && (
              <span className="error-text">{formErrors.city}</span>
            )}
          </div>

          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={formErrors.state ? "error" : ""}
            />
            {formErrors.state && (
              <span className="error-text">{formErrors.state}</span>
            )}
          </div>

          <div className="form-group">
            <label>Zip Code *</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className={formErrors.zipcode ? "error" : ""}
              placeholder="12345"
            />
            {formErrors.zipcode && (
              <span className="error-text">{formErrors.zipcode}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={formErrors.country ? "error" : ""}
            />
            {formErrors.country && (
              <span className="error-text">{formErrors.country}</span>
            )}
          </div>
        </div>

        <label  >GENDER (choose one)</label>
        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={formErrors.gender ? "error" : ""}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {formErrors.gender && (
            <span className="error-text">{formErrors.gender}</span>
          )}
        </div>

                    

        <div className="form-actions">
          <button type="button" onClick={resetForm} disabled={isSubmitting}>
            Reset
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default Registration;
