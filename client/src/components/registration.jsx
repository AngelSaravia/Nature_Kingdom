import React, { useState } from "react";
import axios from "axios";
import "./registration.css"; // Make sure to create this CSS file

function Registration() {
  // Form state management
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    age: "",
    state: "",
    country: "",
    zipcode: "",
    address: "",
    city: "",
    mobile: "",
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
    if (!formData.firstname.trim()) {
      errors.firstname = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstname)) {
      errors.firstname = "First name should contain only letters";
    }

    // Middle name validation (optional)
    if (formData.middlename && !/^[A-Za-z\s]*$/.test(formData.middlename)) {
      errors.middlename = "Middle name should contain only letters";
    }

    // Last name validation
    if (!formData.lastname.trim()) {
      errors.lastname = "Last name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastname)) {
      errors.lastname = "Last name should contain only letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Age validation
    if (!formData.age) {
      errors.age = "Age is required";
    } else if (
      isNaN(formData.age) ||
      parseInt(formData.age) < 0 ||
      parseInt(formData.age) > 120
    ) {
      errors.age = "Please enter a valid age (0-120)";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      age: "",
      state: "",
      country: "",
      zipcode: "",
      address: "",
      city: "",
      mobile: "",
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
        age: Number(formData.age), // Convert age to a number
      };

      try {
        // You can change the endpoint URL as needed

        console.log(correctedFormData);
        console.log(formData);
        const response = await axios.post(
          "http://localhost:5004/signup",
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
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={formErrors.firstname ? "error" : ""}
            />
            {formErrors.firstname && (
              <span className="error-text">{formErrors.firstname}</span>
            )}
          </div>

          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
              className={formErrors.middlename ? "error" : ""}
            />
            {formErrors.middlename && (
              <span className="error-text">{formErrors.middlename}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={formErrors.lastname ? "error" : ""}
            />
            {formErrors.lastname && (
              <span className="error-text">{formErrors.lastname}</span>
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
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={formErrors.age ? "error" : ""}
              min="0"
              max="120"
            />
            {formErrors.age && (
              <span className="error-text">{formErrors.age}</span>
            )}
          </div>

          <div className="form-group">
            <label>Mobile *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={formErrors.mobile ? "error" : ""}
              placeholder="1234567890"
            />
            {formErrors.mobile && (
              <span className="error-text">{formErrors.mobile}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={formErrors.address ? "error" : ""}
              rows="3"
            />
            {formErrors.address && (
              <span className="error-text">{formErrors.address}</span>
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
