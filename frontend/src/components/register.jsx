import "./register.css";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

const Register = ()=>{

const [exists,setExists] = useState(false)
const form = {
    firstname : '',
    lastname : '',
    email : '',
    password : ''
}
const [formData,setFormdata] = useState(form);
const navigate = useNavigate();
const changeForm = (e) => {
  setFormdata((prev) => ({
    ...prev,
    [e.target.id]: e.target.value
  }));
};

const userRegistration = async (e)=>{
    try {
     e.preventDefault();
     const registerUrl = "http://localhost:3000/auth/register";
     const response = await axios.post(registerUrl,formData);
     navigate("/login");
    } catch (error) {
        console.log("unable to register",error);
        setExists(true);
    }
}

return (<>
    <div className="container register-container">
        <div className="header">
            <h1>Registration Form</h1>
        </div>
        {exists &&
        <div className="exists">
            <p>User already exists</p>
        </div>}
        <div className="form">
            <form onSubmit={userRegistration}>
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" placeholder="John" value={formData.firstname} onChange={changeForm}/>
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" placeholder="Doe" value={formData.lastname} onChange={changeForm}/>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com" value={formData.email} onChange={changeForm}/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" value={formData.password} onChange={changeForm}/>
                <button type="submit">Submit</button>
            </form>
        </div>
        <div className="done">
            <p>Already Registered?</p>
            <Link to="/login">Login</Link>
        </div>
    </div>
    

</>)
};
export default Register;