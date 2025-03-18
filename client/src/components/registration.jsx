import React, { useState } from "react";
import { registerUser } from "../services/api";
import { validateRegistrationForm } from "../utils/validation";
import "./registration.css";
function RegistrationForm() {
  const [formData, setFormData] = useState({
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRegistrationForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        await registerUser(formData);
        alert("User added successfully!");
        resetForm();
      } catch (error) {
        console.error("Registration failed:", error);
        alert("Error adding person!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
  };

  return (
    <div className="signup-container">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
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
            />
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
              placeholder="e.g. 1234567890"
            />
            {formErrors.mobile && (
              <span className="error-text">{formErrors.mobile}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
            />
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

export default RegistrationForm;
