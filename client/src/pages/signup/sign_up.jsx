// src/pages/sign_up/sign_up.jsx
import React from "react";

import Registration from "../../components/registration/registration";
import "./sign_up.css";

function Sign_up() {
  return (
    <div className="signup-page">
      <div className="signup-content">
        <h1 className="signup-heading">Create an Account</h1>
        <p className="signup-subtext">
          Join Nature Kingdom to get access to special events, discounts, and
          more!
        </p>
        <Registration />
      </div>
    </div>
  );
}

export default Sign_up;
