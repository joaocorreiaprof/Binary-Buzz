import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

//Style
import "../styles/SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/users/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert("User created successfully!");
        navigate("/log-in");
      } else {
        const message = await response.text();
        setError(message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="sign-up">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username" className="label">
            Username: *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email" className="label">
            Email: *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="label">
            Password: *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword" className="label">
            Confirm Password: *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
      <p className="login-text">
        Already have an account? <Link to="/log-in">Log in</Link>
      </p>
    </div>
  );
};

export default SignUp;
