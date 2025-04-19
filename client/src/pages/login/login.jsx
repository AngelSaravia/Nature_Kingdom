import "./login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import backgroundImage from "../../zoo_pictures/zebra.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const localRefreshAuthState = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    let role = localStorage.getItem("role");
    if (!role && token && username) {
      role = "customer";
      localStorage.setItem("role", role);
    }

    console.log("Auth state refreshed with:", { username, email, role });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(username, password);
      if (result.success) {
        localRefreshAuthState(); // Refresh if needed
        // Login will handle navigation
      } else {
        setMessage(result.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
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
      <div className="login">
        <div className="wrapper">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input_container">
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <div className="register-link">
              <p>
                Don't have an account? <a href="/signup">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
