import "./login.css";
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function Login() {
  console.log("hi from login page");
  return (
    <div className="wrapper">
      <div className="form-box-login">
        <form action="">
          <h1>Login</h1>
          <div className="input_container">
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <FaUserAlt />
            </div>
            <div className="input-box">
              <input type="text" placeholder="Password" required />
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
