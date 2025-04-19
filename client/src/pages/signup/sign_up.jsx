import React from "react";
import Registration from "../../components/registration/registration";
import "./sign_up.css";
import backgroundImage from "../../zoo_pictures/couple_lions.jpg";

function Sign_up() {
  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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
