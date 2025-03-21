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
    e.preventDefault(); //prevents the default page from being reloaded

    console.log(import.meta.env.VITE_API_URL);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        username,
        password,
      });

      localStorage.setItem("username", username);
      localStorage.setItem("token", res.data.token); //store JWT token in login local storage
      setMessage("Login Successful");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setMessage(e.response?.data?.e || "Login failed");
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
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUserAlt />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Password"
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
