import "./login.css";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevents the default page from being reloaded

    console.log(import.meta.env.VITE_API_URL);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        username,
        password,
      });

      // Store token and username
      localStorage.setItem("username", username);
      localStorage.setItem("token", res.data.token);

      // Store email when it's included in the response
      if (res.data.email) {
        localStorage.setItem("email", res.data.email);
      } else {
        // If email isn't in the response, check if it's a special admin username
        // This is a temporary solution until your backend sends email
        if (username === "mrodriguez") {
          localStorage.setItem("email", "mrodriguez@admin.naturekingdom.com");
        } else {
          // Set a default email domain for regular users
          localStorage.setItem("email", `${username}@user.naturekingdom.com`);
        }
      }

      setMessage("Login Successful");

      // Check if user is staff by email domain to determine redirect
      const email = res.data.email || localStorage.getItem("email");
      const isStaff =
        email &&
        (email.endsWith("@admin.naturekingdom.com") ||
          email.endsWith("@manager.naturekingdom.com") ||
          email.endsWith("@staff.naturekingdom.com"));

      if (isStaff) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (e) {
      setMessage(e.response?.data?.error || "Login failed");
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
                type="password" // Changed to password to hide input
                placeholder="Password"
                value={password}
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
