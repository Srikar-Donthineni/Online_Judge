import "./register.css";
import axios from "axios";
import { useState, useEffect } from "react";
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
    <div className="reg-page">
      {/* Ambient glow blobs */}
      <div className="reg-glow reg-glow--tl" />
      <div className="reg-glow reg-glow--br" />

      <div className="reg-card">
        {/* Top accent bar */}
        <div className="reg-accent-bar" />

        <div className="reg-body">
          <div className="reg-brand">
            <span className="reg-brand-bracket">{"<"}</span>
            <span className="reg-brand-text">CodeJudge</span>
            <span className="reg-brand-bracket">{"/>"}</span>
          </div>

          <h1 className="reg-heading">Create account</h1>
          <p className="reg-subheading">Fill in the details to get started</p>

          {exists && (
            <div className="reg-error">
              <span className="reg-error-icon">!</span>
              User already exists with this email.
            </div>
          )}

          <form className="reg-form" onSubmit={userRegistration}>
            <div className="reg-row">
              <div className="reg-field">
                <label className="reg-label" htmlFor="firstname">First name</label>
                <input
                  className="reg-input"
                  type="text"
                  id="firstname"
                  placeholder="John"
                  value={formData.firstname}
                  onChange={changeForm}
                />
              </div>
              <div className="reg-field">
                <label className="reg-label" htmlFor="lastname">Last name</label>
                <input
                  className="reg-input"
                  type="text"
                  id="lastname"
                  placeholder="Doe"
                  value={formData.lastname}
                  onChange={changeForm}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="email">Email</label>
              <div className="reg-input-wrapper">
                <span className="reg-input-icon">@</span>
                <input
                  className="reg-input reg-input--icon"
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={changeForm}
                />
              </div>
            </div>

            <div className="reg-field">
              <label className="reg-label" htmlFor="password">Password</label>
              <div className="reg-input-wrapper">
                <span className="reg-input-icon">⌘</span>
                <input
                  className="reg-input reg-input--icon"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={changeForm}
                />
              </div>
            </div>

            <button className="reg-submit-btn" type="submit">
              <span className="reg-submit-btn-text">Create account</span>
              <span className="reg-submit-btn-arrow">→</span>
            </button>
          </form>

          <div className="reg-footer">
            <p>Already registered?</p>
            <Link className="reg-footer-link" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
