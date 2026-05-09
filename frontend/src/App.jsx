import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Problems from "./components/problemsUser.jsx";
import ProblemAdmin from "./components/problemsAdmin.jsx";
import CreateNew from "./components/createNew.jsx";
import CodeExecute from "./components/CodeExecute.jsx";
import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import {setUser} from "./components/authSlice.jsx"

function App() {
  const user = useSelector((state)=>state.auth.user)
  const dispatch = useDispatch();
  useEffect(()=>{
    const getUser = async ()=>{
      try{
      const getUrl = "https://backend.srikarweb.com:3000/auth/user"
      const user = await axios.get(getUrl,{withCredentials:true})
      dispatch(setUser(user.data));
      }
      catch(error){
        console.log("Error getting the user",error.message)
      }
    }
    if(!user){
      getUser();
    }
  },[])

  return (
    <>   
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Problems/>}/>
        <Route path="/problemsAdmin" element={<ProblemAdmin/>}/>
        <Route path="/createNew" element={<CreateNew/>}/>
        <Route path="/runCode/:slug" element={<CodeExecute/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
