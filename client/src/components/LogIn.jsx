import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

//Style
import "../styles/LogIn.css";

const LogIn = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("api/users/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
      window.location.reload();
    } else {
      alert("Login failed: " + data.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Log In
        </button>
      </form>
      <p className="signup-text">
        Don&apos;t have an account?{" "}
        <Link to="/sign-up" className="signup-link">
          Sign up
        </Link>
      </p>
    </div>
  );
};

LogIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LogIn;
