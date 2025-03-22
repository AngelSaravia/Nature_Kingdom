import "./employee_login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(import.meta.env.VITE_API_URL);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/employee_login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("email", email);
      localStorage.setItem("token", res.data.token);
      setMessage("Employee Login Successful");
      navigate("/Employee/dashboard", { replace: true });
    } catch (e) {
      setMessage(e.response?.data?.e || "Login failed");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box-login">
        <form onSubmit={handleLogin}>
          <h1>Employee Login</h1>
          <div className="input_container">
            <div className="input-box">
              <input
                type="text"
                placeholder="Email *"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUserAlt />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Password *"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock />
            </div>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a className="forgot_password" href="#">
              Forgot password?
            </a>
          </div>
          <div className="login_button">
            <button type="submit">Login</button>
          </div>
          <p style={{ color: "red" }}>{message}</p>
          <div className="register-link"></div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
