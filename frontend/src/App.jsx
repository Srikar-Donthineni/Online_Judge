import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Home from "./components/home.jsx";

function App() {

  return (
    <>   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
