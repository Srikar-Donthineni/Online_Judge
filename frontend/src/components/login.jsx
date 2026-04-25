import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ()=>{
    const navigate = useNavigate();
   const loginform = {
    email:'',
    password:''
   }
   const [loginForm,setLoginform] = useState(loginform);
   const userLogin = (e) => {
    setLoginform((prev) => ({
    ...prev,
    [e.target.id]: e.target.value
  }));
    };
    const submitLogin = async (e)=>{
        e.preventDefault();
        const loginUrl = "http://localhost:3000/auth/login"
        console.log(1000000);
        const res = await axios.post(loginUrl,loginForm,{ withCredentials: true });
        const user = res.data.user;
        setLoginform({
          email:'',
          password:''
        });
        if(user.role=='admin'){
        navigate("/problemsAdmin");}
        else{
          navigate("/problems")
        }
    }

    return (
  <div className="login-container">
    <div className="login-card">
      <h1 className="login-heading">Welcome back</h1>
      <p className="login-subheading">Login to your account</p>

      <form className="login-form" onSubmit={submitLogin}>
        <div className="login-field">
          <label className="login-label" htmlFor="email">Email</label>
          <input
            className="login-input"
            id="email"
            type="email"
            value={loginForm.email}
            onChange={userLogin}
            placeholder="you@example.com"
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="password">Password</label>
          <input
            className="login-input"
            id="password"
            type="password"
            value={loginForm.password}
            onChange={userLogin}
            placeholder="••••••••"
          />
        </div>

        <button className="login-submit-btn" type="submit">Login</button>
      </form>
    </div>
  </div>
);
}

export default Login;