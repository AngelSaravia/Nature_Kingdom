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
  if (!formData.address.trim()) {
    errors.address = "Address is required";
  }

  if (!formData.city.trim()) {
    errors.city = "City is required";
  }

  if (!formData.state.trim()) {
    errors.state = "State is required";
  }

  if (!formData.zipcode.trim()) {
    errors.zipcode = "Zip code is required";
  } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
    errors.zipcode = "Please enter a valid zip code";
  }

  // Validate email (required)
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

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
