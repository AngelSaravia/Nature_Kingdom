/**
 * Validates the registration form for a zoo visitor
 * @param {Object} formData - Registration form data
 * @returns {Object} Object containing validation errors
 */
export const validateRegistrationForm = (formData) => {
  let errors = {};

  // Validate first name (required)
  if (!formData.firstname.trim()) {
    errors.firstname = "First name is required";
  } else if (!/^[A-Za-z\s]+$/.test(formData.firstname)) {
    errors.firstname = "First name should contain only letters";
  }

  // Validate middle name (optional)
  if (formData.middlename && !/^[A-Za-z\s]*$/.test(formData.middlename)) {
    errors.middlename = "Middle name should contain only letters";
  }

  // Validate last name (required)
  if (!formData.lastname.trim()) {
    errors.lastname = "Last name is required";
  } else if (!/^[A-Za-z\s]+$/.test(formData.lastname)) {
    errors.lastname = "Last name should contain only letters";
  }

  // Validate email (required)
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Validate age (required)
  if (!formData.age) {
    errors.age = "Age is required";
  } else if (
    isNaN(formData.age) ||
    parseInt(formData.age) < 0 ||
    parseInt(formData.age) > 120
  ) {
    errors.age = "Please enter a valid age (0-120)";
  }

  // Validate mobile (required)
  if (!formData.mobile.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
    errors.mobile = "Please enter a valid 10-digit mobile number";
  }

  // Validate country (required)
  if (!formData.country.trim()) {
    errors.country = "Country is required";
  }

  // Validate zipcode (optional but if provided, validate format)
  if (formData.zipcode && !/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
    errors.zipcode =
      "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
  }

  // Optional validation for address, city, and state if needed
  // These are currently not required fields based on your form

  return errors;
};
