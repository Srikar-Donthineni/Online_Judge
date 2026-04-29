import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";

const Login = () => {
  const navigate = useNavigate();
  const loginform = { email: "", password: "" };
  const [loginForm, setLoginform] = useState(loginform);
  const dispatch = useDispatch();

  const userLogin = (e) => {
    setLoginform((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    try{
    const loginUrl = "http://localhost:3000/auth/login";
    const res = await axios.post(loginUrl, loginForm, { withCredentials: true });
    const user = res.data.user;
    setLoginform({ email: "", password: "" });
    dispatch(setUser(user));
    if (user.role == "admin") {
      navigate("/problemsAdmin");
    } else {
      navigate("/");
    }}
    catch(error){
      console.log("Incorrect username or password",error);
    }
  };

  return (
    <div className="lgn-page">
      {/* Ambient glow blobs */}
      <div className="lgn-glow lgn-glow--tl" />
      <div className="lgn-glow lgn-glow--br" />

      <div className="lgn-card">
        {/* Top accent bar */}
        <div className="lgn-accent-bar" />

        <div className="lgn-body">
          <div className="lgn-brand">
            <span className="lgn-brand-bracket">{"<"}</span>
            <span className="lgn-brand-text">CodeJudge</span>
            <span className="lgn-brand-bracket">{"/>"}</span>
          </div>

          <h1 className="lgn-heading">Welcome back</h1>
          <p className="lgn-subheading">Login to your account</p>

          <form className="lgn-form" onSubmit={submitLogin}>
            <div className="lgn-field">
              <label className="lgn-label" htmlFor="email">Email</label>
              <div className="lgn-input-wrapper">
                <span className="lgn-input-icon">@</span>
                <input
                  className="lgn-input lgn-input--icon"
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={userLogin}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="lgn-field">
              <label className="lgn-label" htmlFor="password">Password</label>
              <div className="lgn-input-wrapper">
                <span className="lgn-input-icon">⌘</span>
                <input
                  className="lgn-input lgn-input--icon"
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={userLogin}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="lgn-submit-btn" type="submit">
              <span className="lgn-submit-btn-text">Login</span>
              <span className="lgn-submit-btn-arrow">→</span>
            </button>
          </form>

          <div className="lgn-footer">
            <p>Don't have an account?</p>
            <a className="lgn-footer-link" href="/register">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
