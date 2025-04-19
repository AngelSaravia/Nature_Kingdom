import "./employee_login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext"; // Update the path as needed
import backgroundImage from "../../zoo_pictures/penguinImage.jpg";

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, employeeLogin } = useAuth();

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        navigate("/admin_dash", { replace: true });
      } else if (role === "manager") {
        navigate("/manager_dash", { replace: true });
      } else if (role === "staff") {
        navigate("/staff_dash", { replace: true });
      } else if (role === "zookeeper") {
        navigate("/zookeeper_dash", { replace: true });
      } else if (role === "veterinarian") {
        navigate("/veterinarian_dash", { replace: true });
      } else if (role === "operator") {
        navigate("/operator_dash", { replace: true });
      } else if (role === "giftshop") {
        navigate("/giftshop_dash", { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      console.log("Attempting employee login with email:", email);

      const result = await employeeLogin(email, password);

      if (result.success) {
        setMessage("Employee Login Successful");

        // Determine which dashboard to navigate to based on role
        if (result.role === "admin") {
          navigate("/admin_dash", { replace: true });
        } else if (result.role === "manager") {
          navigate("/manager_dash", { replace: true });
        } else {
          navigate("/staff_dash", { replace: true });
        }
      } else {
        setMessage(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="employee-dashboard-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="login">
        <div className="employee-wrapper">
          <form onSubmit={handleLogin}>
            <h1>Employee Login</h1>
            <div className="employee_input_container">
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
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
            <div className="login_button_button">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            {message && <p style={{ color: "red" }}>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLogin;
