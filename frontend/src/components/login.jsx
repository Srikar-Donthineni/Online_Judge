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
    const submitLogin = ()=>{
        const loginUrl = "http://localhost:3000/auth/login"
        const res = axios.get(loginUrl,loginForm);
        navigate("/home");
    }

    return (
        <>
  <div className="login-container">
    <div className="login-header">
            <h1>Login</h1>
        </div>
    <form className="login-form" onSubmit={submitLogin}>
      <label htmlFor="email">Email</label>
      <input id="email" value={loginForm.email} onChange={userLogin} />

      <label htmlFor="password">Password</label>
      <input id="password" value={loginForm.password} onChange={userLogin} />

      <button type="submit">submit</button>
    </form>
  </div>
</>
    )
}

export default Login;