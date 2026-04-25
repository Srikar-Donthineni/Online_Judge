import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Problems from "./components/problemsUser.jsx";
import ProblemAdmin from "./components/problemsAdmin.jsx";
import CreateNew from "./components/createNew.jsx";
import CodeExecute from "./components/CodeExecute.jsx";

function App() {

  return (
    <>   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/problems" element={<Problems/>}/>
        <Route path="/problemsAdmin" element={<ProblemAdmin/>}/>
        <Route path="/createNew" element={<CreateNew/>}/>
        <Route path="/runCode" element={<CodeExecute/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
