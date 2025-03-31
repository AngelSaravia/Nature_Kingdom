import "./login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login request with:", { username, password });
      console.log("apibaseurl ", API_BASE_URL);
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        {
          username,
          password,
        }
      );

      console.log("Login response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);

      if (res.data.email) {
        localStorage.setItem("email", res.data.email);
      }

      setMessage("Login Successful");

      // All regular users go to the dashboard
      navigate("/dashboard", { replace: true });
    } catch (e) {
      console.error("Login error:", e);
      setMessage(
        e.response?.data?.error ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box-login">
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
            <button type="submit">Login</button>
          </div>
          <p style={{ color: "red" }}>{message}</p>
          <div className="register-link">
            <p>
              Don't have an account? <a href="/signup">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
