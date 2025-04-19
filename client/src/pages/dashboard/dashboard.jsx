import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkMembershipStatus, getDashboardData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import backgroundImage from "../../zoo_pictures/jungle.jpg";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPasswordFields2, setShowPasswordFields2] = useState(false);

  const resetPasswordCheckbox2 = () => {
    setShowPasswordFields2(false);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    // Reset password fields when closing popup
    if (isPopupOpen) {
      setShowPasswordFields(false);
    }
  };

  useEffect(() => {
    // When popup is open, disable body scrolling and enable popup scrolling
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
      const popupContent = document.querySelector(".popup-content");
      if (popupContent) {
        popupContent.style.overflowY = "auto";
        popupContent.style.maxHeight = "80vh";
      }
    } else {
      // Reset when closed
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    gender: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const [dashboardData, setDashboardData] = useState({
    user: [],
    tickets: [],
    activeTicketsCount: 0,
    membership: [],
    orders: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData({
          tickets: data.tickets.tickets || [],
          activeTicketsCount: data.tickets.activeCount || 0,
          membership: data.membership || [],
          user: data.visitor || [],
          orders: data.giftShopPurchases.data.purchases || [],
        });

        // Initialize form data with user information
        if (data.visitor) {
          setFormData({
            first_name: data.visitor.first_name || "",
            last_name: data.visitor.last_name || "",
            email: data.visitor.email || "",
            phone_number: data.visitor.phone_number || "",
            street_address: data.visitor.street_address || "",
            city: data.visitor.city || "",
            state: data.visitor.state || "",
            zipcode: data.visitor.zipcode || "",
            country: data.visitor.country || "",
            gender: data.visitor.gender || "",
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear password error when user types in password fields
    if (
      name === "current_password" ||
      name === "new_password" ||
      name === "confirm_password"
    ) {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    // Always require current password for security
    if (!formData.current_password) {
      setPasswordError("Current password is required to make changes");
      return false;
    }

    // Validate password change if requested
    if (showPasswordFields) {
      if (!formData.new_password) {
        setPasswordError("New password is required");
        return false;
      }

      if (formData.new_password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        return false;
      }

      if (!/[A-Z]/.test(formData.new_password)) {
        setPasswordError("Password must contain at least one uppercase letter");
        return false;
      }

      if (!/[0-9]/.test(formData.new_password)) {
        setPasswordError("Password must contain at least one number");
        return false;
      }

      if (!/[!@#$%^&*.]/.test(formData.new_password)) {
        setPasswordError(
          "Password must contain at least one special character (!@#$%^&*.)"
        );
        return false;
      }

      if (formData.new_password !== formData.confirm_password) {
        setPasswordError("Passwords don't match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      console.log("User data being sent:", dashboardData.user);

      const userId = dashboardData.user.visitor_id;

      if (!userId) {
        console.error("No user ID found in user data");
        setPasswordError("User ID not found. Please try logging in again.");
        return;
      }

      const dataToSend = {
        visitor_id: userId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        country: formData.country,
        gender: formData.gender,
        current_password: formData.current_password,
        show_password_fields: showPasswordFields,
        new_password: showPasswordFields ? formData.new_password : null,
      };

      console.log("Sending data to backend:", {
        ...dataToSend,
        current_password: "[REDACTED]",
        new_password: dataToSend.new_password ? "[REDACTED]" : null,
      });

      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      setDashboardData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country,
          gender: formData.gender,
        },
      }));

      togglePopup();

      alert("Profile updated successfully!");

      window.location.reload();
    } catch (error) {
      setPasswordError(
        error.message ||
          "Failed to update profile. Please check your current password and try again."
      );
    }
  };

  console.log("user", dashboardData.user);
  console.log("member", dashboardData.tickets);
  console.log("orders ", dashboardData.orders);

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return null;
  };

  const handleDeleteUser = async () => {
    if (!formData.current_password) {
      setPasswordError("Current password is required to delete your account");
      return;
    }

    // Get confirmation from user, but don't validate it on frontend
    const confirmText = prompt(
      "To confirm deletion, please type 'Delete account'"
    );

    // Always proceed with the request, letting the backend validate the confirmation
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const userId = dashboardData.user.visitor_id;

        if (!userId) {
          console.error("No user ID found in user data");
          setPasswordError("User ID not found. Please try logging in again.");
          return;
        }

        // Send the confirmation text to the backend for validation
        const response = await fetch(`${API_BASE_URL}/delete-account`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitor_id: userId,
            current_password: formData.current_password,
            confirmation_text: confirmText, // Send user's confirmation text to backend
          }),
        });

        const responseText = await response.text();
        console.log("Raw server response:", responseText);

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response as JSON");
          throw new Error("Server returned an invalid response");
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete account");
        }

        alert("Your account has been successfully deleted.");
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        console.error("Error during account deletion:", error);
        setPasswordError(error.message || "Failed to delete account");
      }
    }
  };

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="dashboard-card">
        <h1 className="dashboard-title">Your Dashboard</h1>

        {/* Quick Summary */}
        <div className="dashboard-box single">
          <h2 className="dashboard-heading">
            Your Account{" "}
            <button className="modify-button" onClick={togglePopup}>
              Edit
            </button>
          </h2>
          <p className="dashboard-text">
            Username: {dashboardData.user.username}
          </p>
          <p className="dashboard-text">
            Full Name: {capitalizeFirstLetter(dashboardData.user.first_name)}{" "}
            {capitalizeFirstLetter(dashboardData.user.Minit_name)}{" "}
            {capitalizeFirstLetter(dashboardData.user.last_name)}
          </p>
          <p className="dashboard-text">Email: {dashboardData.user.email}</p>
          <p className="dashboard-text">
            Phone: {formatPhoneNumber(dashboardData.user.phone_number)}
          </p>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2 className="dashboard-heading">My Tickets</h2>
            <p className="dashboard-text">
              {dashboardData.activeTicketsCount} active ticket(s)
            </p>
            <button
              onClick={() =>
                navigate("/my-tickets", { state: { dashboardData } })
              }
              className="dashboard-button"
            >
              View Tickets
            </button>
          </div>
          <div className="dashboard-box">
            <h2 className="dashboard-heading">My Membership</h2>
            <p className="dashboard-text">
              {dashboardData.membership.length
                ? "Active membership"
                : "No active membership"}
            </p>
            <button
              onClick={() =>
                navigate("/my-membership", { state: { dashboardData } })
              }
              className="dashboard-button"
            >
              View Membership
            </button>
          </div>
          <div className="dashboard-box">
            <h2 className="dashboard-heading">Giftshop Purchases</h2>

            <button
              onClick={() =>
                navigate("/giftshop-purchases", { state: { dashboardData } })
              }
              className="dashboard-button"
            >
              View Purchases
            </button>
          </div>
          <div className="dashboard-box">
            <h2 className="dashboard-heading">Exhibits and Animals</h2>
            <button
              className="dashboard-button"
              onClick={() => navigate("/exhibits")}
            >
              View Exhibits and Animals
            </button>
          </div>
        </div>

        {/* Popup for editing account information */}
        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h3>Edit Account Information</h3>
                <span className="close-popup" onClick={togglePopup}>
                  &times;
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="street_address">Street Address</label>
                  <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipcode">Zip Code</label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <label>GENDER (choose one)</label>
                <div className="form-group">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Password section */}
                <div className="form-group">
                  <label htmlFor="current_password">
                    Current Password (required to make changes)
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div
                  className="form-group-checkbox-group"
                  style={{ display: "flex", gap: "20px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="change_password_1"
                      checked={showPasswordFields}
                      onChange={() =>
                        setShowPasswordFields(!showPasswordFields)
                      }
                    />
                    <label
                      htmlFor="change_password_1"
                      style={{ marginLeft: "5px" }}
                    >
                      Change my password
                    </label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="change_password_2"
                      checked={showPasswordFields2}
                      onChange={() => {
                        // If showPasswordFields2 is being enabled, disable showPasswordFields
                        if (!showPasswordFields2 && showPasswordFields) {
                          setShowPasswordFields(false);
                        }
                        setShowPasswordFields2(!showPasswordFields2);
                      }}
                    />
                    <label
                      htmlFor="change_password_2"
                      style={{ marginLeft: "5px" }}
                    >
                      Reset my Password
                    </label>
                  </div>
                </div>

                {showPasswordFields && (
                  <>
                    <div className="form-group">
                      <label htmlFor="new_password">New Password</label>
                      <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        required={showPasswordFields}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm_password">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        required={showPasswordFields}
                      />
                    </div>
                  </>
                )}

                {/* Add actual implementation for password reset option */}
                {showPasswordFields2 && (
                  <div className="form-group">
                    <p>
                      A password reset link will be sent to your email address.
                    </p>
                  </div>
                )}

                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}

                <div className="button-group">
                  <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </button>
                  <div className="right-buttons">
                    <button type="submit" className="save-button">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={togglePopup}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
