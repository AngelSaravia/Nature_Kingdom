import "./employee_login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Sending employee login request with email:", email);
    try {
      const res = await axios.post(`${API_BASE_URL}/employee_login`, {
        email,
        password,
      });

      console.log("Employee login response:", res.data);

      // Store user information
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", email);
      localStorage.setItem("token", res.data.token);

      setMessage("Employee Login Successful");

      // Determine if the employee is admin staff or regular staff based on email domain
      const isAdmin = email.includes("@admin.naturekingdom.com");
      const isManager = email.includes("@manager.naturekingdom.com");

      // Navigate based on user role
      if (isAdmin) {
        navigate("/admin_dash", { replace: true });
      } else if (isManager) {
        navigate("/manager_dash", { replace: true });
      } else {
        navigate("/staff_dash", { replace: true });
      }
    } catch (e) {
      console.error("Login error:", e);
      setMessage(e.response?.data?.error || "Login failed");
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUserAlt />
            </div>
            <div className="input-box">
              <input
                type={visible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="p-2" onClick={() => setVisible(!visible)}>
                {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </div>
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
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
