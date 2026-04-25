import "./register.css";
import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [exists, setExists] = useState(false);
  const [formData, setFormdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const changeForm = (e) => {
    setFormdata((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const userRegistration = async (e) => {
    try {
      e.preventDefault();
      const registerUrl = "http://localhost:3000/auth/register";
      await axios.post(registerUrl, formData);
      navigate("/login");
    } catch (error) {
      console.log("unable to register", error);
      setExists(true);
    }
  };
  useEffect(() => {
  setFormdata({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  setExists(false);
}, []);

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-heading">Create account</h1>
        <p className="register-subheading">Fill in the details to get started</p>

        {exists && (
          <div className="register-error">
            User already exists with this email.
          </div>
        )}

        <form className="register-form" onSubmit={userRegistration}>
          <div className="register-row">
            <div className="register-field">
              <label className="register-label" htmlFor="firstname">First name</label>
              <input
                className="register-input"
                type="text"
                id="firstname"
                placeholder="John"
                value={formData.firstname}
                onChange={changeForm}
              />
            </div>

            <div className="register-field">
              <label className="register-label" htmlFor="lastname">Last name</label>
              <input
                className="register-input"
                type="text"
                id="lastname"
                placeholder="Doe"
                value={formData.lastname}
                onChange={changeForm}
              />
            </div>
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="email">Email</label>
            <input
              className="register-input"
              type="email"
              id="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={changeForm}
            />
          </div>

          <div className="register-field">
            <label className="register-label" htmlFor="password">Password</label>
            <input
              className="register-input"
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={changeForm}
            />
          </div>

          <button className="register-submit-btn" type="submit">Create account</button>
        </form>

        <div className="register-footer">
          <p>Already registered?</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;